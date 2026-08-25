'use client';

import { useRef } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { useUploadImageMutation } from '@/hooks/profile/useProfileMutations';
import { Camera, Loader2 } from 'lucide-react';

export default function CompanyLogoUploader() {
  const { customFields, updateCustomFields } = useProfileStore();
  const fileInputRef = useRef(null);
  const uploadMutation = useUploadImageMutation();

  const logoUrl = customFields?.logo || null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (url) => {
        updateCustomFields({ logo: url });
      }
    });
  };

  return (
    <div className="flex items-center gap-6">
      <div 
        className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-surface shadow-md flex items-center justify-center overflow-hidden bg-background shrink-0 group
          ${uploadMutation.isPending ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadMutation.isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {logoUrl ? (
          <>
            <img src={logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-primary/50 group-hover:text-primary transition-colors">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
            <span className="text-[10px] sm:text-xs font-semibold">Upload Logo</span>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden" 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-text">Company Logo</h3>
        <p className="text-sm text-text/60 mt-1 max-w-sm">
          Recommended size is 256x256px. This will be displayed on your profile and bookings.
        </p>
      </div>
    </div>
  );
}
