'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfileStore } from '@/store/profileStore';
import { PhoneCall } from 'lucide-react';

const contactSchema = z.object({
  supportEmail: z.string().email('Invalid email format').or(z.literal('')),
  website: z.string().url('Invalid URL').or(z.literal('')),
});

export default function ContactInformationForm() {
  const { customFields, updateCustomFields } = useProfileStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      supportEmail: customFields?.supportEmail || '',
      website: customFields?.website || '',
    }
  });

  useEffect(() => {
    reset({
      supportEmail: customFields?.supportEmail || '',
      website: customFields?.website || '',
    });
  }, [customFields, reset]);

  const onSubmit = (data) => {
    updateCustomFields({ 
      supportEmail: data.supportEmail, 
      website: data.website 
    });
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="border-b border-border p-5 sm:p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <PhoneCall className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text">Contact Information</h2>
          <p className="text-sm text-text/60 mt-0.5">How customers can reach you directly</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <form onChange={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Support Email</label>
            <input 
              type="email" 
              {...register('supportEmail')}
              className={`w-full bg-background border ${errors.supportEmail ? 'border-red-500' : 'border-border'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              placeholder="support@company.com"
            />
            {errors.supportEmail && <p className="text-red-500 text-xs mt-1">{errors.supportEmail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Website</label>
            <input 
              type="url" 
              {...register('website')}
              className={`w-full bg-background border ${errors.website ? 'border-red-500' : 'border-border'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              placeholder="https://company.com"
            />
            {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
          </div>
          
          <div className="md:col-span-2">
            <p className="text-xs text-text/50">
              Note: Primary Email and Phone Number are managed in your Account Settings.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
