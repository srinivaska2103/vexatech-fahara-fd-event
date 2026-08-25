'use client';

import { useProfileStore } from '@/store/profileStore';
import { useUpdateProfileMutation, useCreateProfileMutation } from '@/hooks/profile/useProfileMutations';
import CompanyLogoUploader from './CompanyLogoUploader';
import BusinessStatusBadge from './BusinessStatusBadge';
import { Save, Loader2 } from 'lucide-react';

export default function CompanyProfileCard() {
  const { profile, coverImage, gallery, businessHours, customFields } = useProfileStore();
  const updateMutation = useUpdateProfileMutation(profile?.id);
  const createMutation = useCreateProfileMutation();

  const handleSaveAll = () => {
    const payload = {
      name: profile?.name,
      description: profile?.description,
      address: profile?.address,
      city: profile?.city,
      latitude: profile?.latitude,
      longitude: profile?.longitude,
      cover_image: coverImage,
      gallery: gallery,
      business_hours: businessHours,
      amenities: customFields, 
      provides_event_services: true
    };

    if (profile?.id) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = updateMutation.isPending || createMutation.isPending;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
      {/* Subtle shine effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex-1 w-full relative z-10">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <CompanyLogoUploader />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 shrink-0 w-full md:w-auto relative z-10">
        <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-2xl border border-white/5 backdrop-blur-md">
          <span className="text-sm font-medium text-text/60">Status:</span>
          <BusinessStatusBadge />
        </div>
        
        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className={`group relative flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0
            ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_auto] animate-gradient-x" />
          
          <div className="relative flex items-center gap-2">
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            )}
            <span>{isSaving ? 'Saving Profile...' : 'Save All Changes'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
