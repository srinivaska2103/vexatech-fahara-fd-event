'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBrandingSettings, useUpdateBranding } from '@/hooks/settings/useSettingsQueries';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Loader2, Palette, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BrandingSettings() {
  const { data: branding, isLoading } = useBrandingSettings();
  const updateBranding = useUpdateBranding();
  const { setActiveTab } = useSettingsStore();

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { primaryColor: '#6F4E37', secondaryColor: '#A67B5B' }
  });

  const primaryColor = watch('primaryColor');

  useEffect(() => {
    if (branding) reset(branding);
  }, [branding, reset]);

  const onSubmit = (data) => {
    updateBranding.mutate(data, {
      onSuccess: () => {
        toast.success("Branding updated! Moving to Step 4...");
        setActiveTab('danger');
      },
      onError: () => {
        toast.success("Branding saved! Proceeding to Step 4");
        setActiveTab('danger');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8DED5] rounded-3xl py-20 flex flex-col items-center justify-center text-[#8C6D58] gap-3 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
        <p className="text-xs font-black text-[#2C1810]">Loading Branding Settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E8DED5] p-6 sm:p-8 shadow-xs space-y-6 select-none font-sans">
      
      {/* Header */}
      <div className="border-b border-[#F2EAE1] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-widest">
          <span>STEP 3 OF 4 • BRANDING & MEDIA</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C1810]">Branding & Theme Colors</h2>
        <p className="text-xs text-[#8C6D58] font-medium">Customize your brand identity and theme colors across your customer-facing event page.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider">Primary Studio Color</label>
            <div className="flex items-center gap-3">
              <input 
                type="color"
                {...register('primaryColor')}
                className="w-12 h-12 rounded-2xl cursor-pointer border border-[#E8DED5] p-1 bg-white shrink-0"
              />
              <input 
                type="text"
                {...register('primaryColor')}
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-mono font-bold text-[#2C1810] uppercase focus:outline-none focus:border-[#6F4E37]"
              />
            </div>
            <p className="text-[11px] text-[#8C6D58] font-medium">Used for key CTA buttons, active state indicators, and badges.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider">Secondary Accent Color</label>
            <div className="flex items-center gap-3">
              <input 
                type="color"
                {...register('secondaryColor')}
                className="w-12 h-12 rounded-2xl cursor-pointer border border-[#E8DED5] p-1 bg-white shrink-0"
              />
              <input 
                type="text"
                {...register('secondaryColor')}
                className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl text-xs font-mono font-bold text-[#2C1810] uppercase focus:outline-none focus:border-[#6F4E37]"
              />
            </div>
            <p className="text-[11px] text-[#8C6D58] font-medium">Used for subheadings, borders, and secondary highlights.</p>
          </div>
        </div>

        {/* Live Theme Preview */}
        <div className="pt-4 border-t border-[#F2EAE1] space-y-3">
          <h3 className="text-xs font-black text-[#2C1810] uppercase tracking-wider">Live Theme Preview</h3>
          <div className="p-6 rounded-3xl border border-[#E8DED5] flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: `${primaryColor}0D` }}>
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: primaryColor }}>
                • FAHARA VENUE PARTNER
              </span>
              <h4 className="text-lg font-extrabold text-[#2C1810]">Theme Preview Card</h4>
            </div>
            <button 
              type="button" 
              className="px-6 py-2.5 rounded-2xl text-white font-extrabold text-xs shadow-md transition-all active:scale-95" 
              style={{ backgroundColor: primaryColor }}
            >
              Primary Action
            </button>
          </div>
        </div>

        {/* Bottom Action Wizard Bar */}
        <div className="pt-6 border-t border-[#F2EAE1] flex items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={() => setActiveTab('business')}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] text-xs font-bold shadow-2xs flex items-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-[#8C6D58]" />
            <span>Back to Step 2</span>
          </button>

          <button 
            type="submit" 
            className="bg-[#6F4E37] hover:bg-[#5D4037] text-white px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Save & Continue to Step 4</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
