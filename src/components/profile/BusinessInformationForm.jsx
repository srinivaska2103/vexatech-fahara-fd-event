'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfileStore } from '@/store/profileStore';
import { Building2 } from 'lucide-react';

const businessSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  description: z.string().optional(),
  experienceYears: z.string().optional(),
  gstNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export default function BusinessInformationForm() {
  const { profile, customFields, updateCustomFields } = useProfileStore();

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: profile?.name || '',
      description: profile?.description || '',
      experienceYears: customFields?.experienceYears || '',
      gstNumber: customFields?.gstNumber || '',
      registrationNumber: customFields?.registrationNumber || '',
    }
  });

  useEffect(() => {
    reset({
      name: profile?.name || '',
      description: profile?.description || '',
      experienceYears: customFields?.experienceYears || '',
      gstNumber: customFields?.gstNumber || '',
      registrationNumber: customFields?.registrationNumber || '',
    });
  }, [profile, customFields, reset]);

  const onSubmit = (data) => {
    useProfileStore.getState().setProfile({ ...profile, name: data.name, description: data.description });
    updateCustomFields({ 
      experienceYears: data.experienceYears, 
      gstNumber: data.gstNumber, 
      registrationNumber: data.registrationNumber 
    });
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="border-b border-white/5 p-6 md:p-8 flex items-center gap-5 bg-gradient-to-r from-background/50 to-surface/50 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <Building2 className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight">Business Information</h2>
          <p className="text-sm text-text/60 mt-1 font-medium">Core details about your company</p>
        </div>
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <form onChange={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">Company Name <span className="text-primary">*</span></label>
            <input 
              type="text" 
              {...register('name')}
              className={`w-full bg-background/50 hover:bg-surface/50 border ${errors.name ? 'border-red-500/50' : 'border-white/10 hover:border-primary/50'} rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm`}
              placeholder="e.g. Dream Weddings"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">Company Description</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="w-full bg-background/50 hover:bg-surface/50 border border-white/10 hover:border-primary/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm leading-relaxed"
              placeholder="Tell customers about your services and expertise..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">Years of Experience</label>
            <input 
              type="text" 
              {...register('experienceYears')}
              className="w-full bg-background/50 hover:bg-surface/50 border border-white/10 hover:border-primary/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm"
              placeholder="e.g. 5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">GST Number</label>
            <input 
              type="text" 
              {...register('gstNumber')}
              className="w-full bg-background/50 hover:bg-surface/50 border border-white/10 hover:border-primary/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all uppercase shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm tracking-wide"
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">Business Registration Number</label>
            <input 
              type="text" 
              {...register('registrationNumber')}
              className="w-full bg-background/50 hover:bg-surface/50 border border-white/10 hover:border-primary/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all uppercase shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm tracking-wide"
              placeholder="CIN / LLPIN"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
