'use client';

import React, { useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ChevronRight, ChevronLeft, Check, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCategorySelect from './ServiceCategorySelect';
import ServiceGalleryUploader from './ServiceGalleryUploader';
import ServiceInclusions from './ServiceInclusions';
import { useCreateServiceMutation, useUpdateServiceMutation } from '@/hooks/services/useServicesMutations';

const serviceSchema = z.object({
  service_name: z.string().min(2, 'Service name is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val || 0), z.number().optional()),
  gallery: z.array(z.string()).optional(),
  inclusions: z.array(z.any()).optional(),
});

const STEPS = [
  { id: 1, title: 'Basic Details', subtitle: 'Name & category', icon: Layers },
  { id: 2, title: 'Service Inclusions', subtitle: 'What is included', icon: Sparkles },
  { id: 3, title: 'Media & Gallery', subtitle: 'Photos & catalog images', icon: ImageIcon },
];

export default function ServiceForm({ initialData = null }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);
  
  const createMutation = useCreateServiceMutation();
  const updateMutation = useUpdateServiceMutation(initialData?.id);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  let initialDesc = initialData?.description || '';

  const methods = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      service_name: initialData?.service_name || '',
      category: initialData?.category || '',
      description: initialDesc,
      price: initialData?.price ? Number(initialData.price) : 0,
      gallery: Array.isArray(initialData?.gallery) ? initialData.gallery : [],
      // inclusions stored as rich tiered objects; legacy string arrays are treated as plain inclusions
      inclusions: Array.isArray(initialData?.inclusions)
        ? initialData.inclusions.map(inc => (typeof inc === 'string' ? { id: null, name: inc } : inc))
        : [],
    }
  });

  const { register, handleSubmit, control, trigger, setValue, watch, formState: { errors } } = methods;

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(['service_name', 'category']);
      if (!isValid) return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = (data) => {
    // Serialize inclusions as the tiered rich array (backend handles pricing from tiers[])
    const inclusionsPayload = (data.inclusions || []).map(inc => {
      // If it's still a legacy { value: string } shape, convert
      if (inc && !inc.tiers && typeof inc.value === 'string') {
        return { name: inc.value, id: inc.id || null };
      }
      return inc;
    });

    const payload = {
      service_name: data.service_name,
      category: data.category,
      price: Number(data.price),
      description: data.description,
      gallery: data.gallery || [],
      inclusions: inclusionsPayload,
    };

    if (isEditing) {
      updateMutation.mutate(payload, {
        onSuccess: () => router.push('/event/services')
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => router.push('/event/services')
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 select-none">
      
      {/* STEP PROGRESS TABS */}
      <div className="bg-white border border-[#E8DED5] rounded-2xl p-3 sm:p-5 shadow-xs">
        <div className="flex items-stretch gap-2">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-2 py-2.5 sm:px-3 rounded-xl border text-left transition-all duration-300 flex-1 min-w-0 ${
                    isActive 
                      ? 'bg-[#FFF8F0] border-[#6F4E37] shadow-sm ring-1 ring-[#6F4E37]/20' 
                      : isCompleted 
                      ? 'bg-[#FFFDF9] border-[#E8DED5] hover:border-[#6F4E37]/40' 
                      : 'bg-white border-[#F2EAE1] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                    isActive 
                      ? 'bg-[#6F4E37] text-white' 
                      : isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-[#FFF8F0] text-[#8C6D58] border border-[#6F4E37]/15'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                  </div>
                  <div className="min-w-0 hidden xs:block sm:block">
                    <span className={`text-[10px] sm:text-xs font-black truncate block ${isActive ? 'text-[#2C1810]' : 'text-[#6F4E37]'}`}>
                      {step.title}
                    </span>
                    <p className="text-[9px] text-[#8C6D58] font-medium truncate mt-0.5 hidden sm:block">{step.subtitle}</p>
                  </div>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`w-px self-stretch my-1 transition-colors ${currentStep > step.id ? 'bg-emerald-300' : 'bg-[#E8DED5]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP FORM CONTAINER */}
      <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#E8DED5] rounded-2xl p-4 sm:p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37] shrink-0">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-black text-[#2C1810] leading-tight">Basic Information</h2>
                    <p className="text-[10px] text-[#8C6D58] font-medium hidden sm:block">Service name, category, and overview.</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#6F4E37]/20 shrink-0">
                  1 / 3
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#2C1810] uppercase tracking-wider mb-1.5">Service Name *</label>
                  <input 
                    {...register('service_name')}
                    className={`w-full bg-[#FFFDF9] border ${errors.service_name ? 'border-rose-500' : 'border-[#E8DED5]'} rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all`}
                    placeholder="e.g. Premium Wedding Photography"
                  />
                  {errors.service_name && <p className="text-rose-600 text-xs font-bold mt-1">{errors.service_name.message}</p>}
                </div>

                <div>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <ServiceCategorySelect 
                        value={field.value} 
                        onChange={field.onChange} 
                        error={errors.category} 
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#2C1810] uppercase tracking-wider mb-1.5">Description</label>
                  <textarea 
                    {...register('description')}
                    rows={3}
                    className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all resize-none"
                    placeholder="Describe what this service covers, duration, and key deliverables..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: INCLUSIONS & FEATURES */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37]">
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#2C1810]">Service Inclusions</h2>
                    <p className="text-xs text-[#8C6D58] font-medium">Add key items or package highlights provided with this service.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#6F4E37]/20">
                  Step 2 of 3
                </span>
              </div>

              <ServiceInclusions />
            </motion.div>
          )}

          {/* STEP 3: MEDIA & GALLERY */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37]">
                    <ImageIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#2C1810]">Media & Catalog Photos</h2>
                    <p className="text-xs text-[#8C6D58] font-medium">Upload portfolio photos and sample work for your service.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#6F4E37]/20">
                  Step 3 of 3
                </span>
              </div>

              <Controller
                name="gallery"
                control={control}
                render={({ field }) => (
                  <ServiceGalleryUploader 
                    value={field.value} 
                    onChange={field.onChange} 
                    error={errors.gallery} 
                  />
                )}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* STEPPER NAVIGATION FOOTER */}
        <div className="flex justify-between items-center bg-white border border-[#E8DED5] rounded-3xl p-3 sm:p-5 shadow-xs">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-[#E8DED5] text-[#2C1810] hover:bg-[#FFF8F0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#6F4E37] hover:bg-[#5C402D] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-[#6F4E37]/20 active:scale-95 shrink-0"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Publish Service'}</span>
              </button>
            )}
          </div>
        </div>

      </form>
      </FormProvider>
    </div>
  );
}
