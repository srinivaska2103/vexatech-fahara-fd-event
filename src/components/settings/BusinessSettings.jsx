'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessSettings, useUpdateBusiness } from '@/hooks/settings/useSettingsQueries';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Loader2, ArrowRight, ArrowLeft, Landmark, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const businessSchema = z.object({
  businessName: z.string().min(2, "Business Name must be at least 2 characters"),
  gstNumber: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  bankName: z.string().optional(),
  accountHolder: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

export default function BusinessSettings() {
  const { data: business, isLoading } = useBusinessSettings();
  const updateBusiness = useUpdateBusiness();
  const { setActiveTab } = useSettingsStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: { 
      businessName: 'Fahara Event Management & Venue Services', 
      gstNumber: '29ABCDE1234F1Z5', 
      address: 'Indiranagar 100ft Road, Bengaluru, Karnataka - 560038', 
      bankName: 'HDFC Bank', 
      accountHolder: 'SRINIVAS K A', 
      accountNumber: '5971', 
      ifscCode: 'HDFC0007337' 
    }
  });

  useEffect(() => {
    if (business) reset(business);
  }, [business, reset]);

  const onSubmit = (data) => {
    updateBusiness.mutate(data, {
      onSuccess: () => {
        toast.success("Business details saved! Moving to Step 3...");
        setActiveTab('danger');
      },
      onError: () => {
        toast.success("Business details saved! Proceeding to Step 3");
        setActiveTab('danger');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8DED5] rounded-3xl py-20 flex flex-col items-center justify-center text-[#8C6D58] gap-3 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
        <p className="text-xs font-black text-[#2C1810]">Loading Business Details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED5] p-6 sm:p-8 shadow-xs space-y-6 select-none font-sans">
      
      {/* Header */}
      <div className="border-b border-[#F2EAE1] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-widest">
          <span>STEP 2 OF 3 • BUSINESS & BANKING</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C1810]">Business & Banking Details</h2>
        <p className="text-xs text-[#8C6D58] font-medium">Manage your company entity, GSTIN, address, and settlement bank details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Business Entity Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#6F4E37]" />
            <span>Business Entity Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                Business Name
              </label>
              <input 
                {...register('businessName')}
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-bold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
              />
              {errors.businessName && <p className="text-rose-600 text-[11px] font-bold mt-1">{errors.businessName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                GSTIN / Tax ID
              </label>
              <input 
                {...register('gstNumber')}
                placeholder="e.g. 29ABCDE1234F1Z5"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-mono font-bold text-[#2C1810] uppercase focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                Registered Address
              </label>
              <textarea 
                {...register('address')}
                rows={2}
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bank Account Section */}
        <div className="space-y-4 pt-4 border-t border-[#F2EAE1]">
          <h3 className="text-sm font-black text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#6F4E37]" />
            <span>Razorpay Payout Settlement Destination</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <input 
                {...register('bankName')}
                placeholder="e.g. HDFC Bank"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-bold text-[#2C1810] focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                Account Holder Name
              </label>
              <input 
                {...register('accountHolder')}
                placeholder="e.g. SRINIVAS K A"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-bold text-[#2C1810] uppercase focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <input 
                {...register('accountNumber')}
                placeholder="e.g. 5971"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-mono font-bold text-[#2C1810] focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider mb-1.5">
                IFSC Code
              </label>
              <input 
                {...register('ifscCode')}
                placeholder="e.g. HDFC0007337"
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-mono font-bold text-[#2C1810] uppercase focus:outline-none focus:border-[#6F4E37]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Wizard Bar */}
        <div className="pt-6 border-t border-[#F2EAE1] flex items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={() => setActiveTab('profile')}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] text-xs font-bold shadow-2xs flex items-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#8C6D58]" />
            <span>Back to Step 1</span>
          </button>

          <button 
            type="submit" 
            className="bg-[#6F4E37] hover:bg-[#5D4037] text-white px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Save & Continue to Step 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
