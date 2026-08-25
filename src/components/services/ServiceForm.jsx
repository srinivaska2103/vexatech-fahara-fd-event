'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  price: z.preprocess((val) => Number(val), z.number().min(0, 'Price must be positive')),
  gallery: z.array(z.string()).optional(),
  inclusions: z.array(z.object({ value: z.string().min(1, "Inclusion cannot be empty") })).optional(),
});

const STEPS = [
  { id: 1, title: 'Basic Details', subtitle: 'Name, category & price', icon: Layers },
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

  const { register, handleSubmit, control, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      service_name: initialData?.service_name || '',
      category: initialData?.category || '',
      description: initialDesc,
      price: initialData?.price ? Number(initialData.price) : '',
      gallery: Array.isArray(initialData?.gallery) ? initialData.gallery : [],
      inclusions: Array.isArray(initialData?.inclusions) ? initialData.inclusions.map(inc => ({ value: inc })) : [],
    }
  });

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(['service_name', 'category', 'price']);
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
    const payload = {
      service_name: data.service_name,
      category: data.category,
      price: Number(data.price),
      description: data.description,
      gallery: data.gallery || [],
      inclusions: data.inclusions?.map(inc => inc.value) || [],
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
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* STEP PROGRESS TABS */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#FFF8F0] border-[#6F4E37] shadow-sm ring-2 ring-[#6F4E37]/20' 
                    : isCompleted 
                    ? 'bg-[#FFFDF9] border-[#E8DED5] hover:border-[#6F4E37]/40' 
                    : 'bg-white border-[#F2EAE1] opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black transition-colors ${
                  isActive 
                    ? 'bg-[#6F4E37] text-white shadow-sm' 
                    : isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#FFF8F0] text-[#8C6D58] border border-[#6F4E37]/15'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <div className="min-w-0">
                  <span className={`text-xs font-black truncate block ${isActive ? 'text-[#2C1810]' : 'text-[#6F4E37]'}`}>
                    {step.title}
                  </span>
                  <p className="text-[10px] text-[#8C6D58] font-medium truncate mt-0.5">{step.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP FORM CONTAINER */}
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
              className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37]">
                    <Layers className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#2C1810]">Basic Information</h2>
                    <p className="text-xs text-[#8C6D58] font-medium">Service name, category, pricing, and overview.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#6F4E37] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#6F4E37]/20">
                  Step 1 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-2">Service Name *</label>
                  <input 
                    {...register('service_name')}
                    className={`w-full bg-[#FFFDF9] border ${errors.service_name ? 'border-rose-500' : 'border-[#E8DED5]'} rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all`}
                    placeholder="e.g. Premium Wedding Photography & Videography"
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
                  <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-2">Starting Price (₹) *</label>
                  <input 
                    type="number"
                    {...register('price')}
                    className={`w-full bg-[#FFFDF9] border ${errors.price ? 'border-rose-500' : 'border-[#E8DED5]'} rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-rose-600 text-xs font-bold mt-1">{errors.price.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    {...register('description')}
                    rows={4}
                    className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all resize-none"
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

              <ServiceInclusions control={control} register={register} errors={errors} />
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
        <div className="flex justify-between items-center bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-xs">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-[#E8DED5] text-[#2C1810] hover:bg-[#FFF8F0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5C402D] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-[#6F4E37]/20 active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Publish Service'}</span>
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
