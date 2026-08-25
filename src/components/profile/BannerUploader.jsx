'use client';

import { useRef, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { useUploadImageMutation } from '@/hooks/profile/useProfileMutations';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BannerUploader() {
  const { coverImage, setCoverImage } = useProfileStore();
  const fileInputRef = useRef(null);
  const uploadMutation = useUploadImageMutation();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (url) => {
        setCoverImage(url);
      }
    });
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group/card">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover/card:bg-primary/10 transition-colors duration-500" />
      
      <div className="border-b border-white/5 p-6 md:p-8 flex items-center gap-5 bg-gradient-to-r from-background/50 to-surface/50 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <ImageIcon className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight">Banner Image</h2>
          <p className="text-sm text-text/60 mt-1 font-medium">High-quality cover image for your public profile</p>
        </div>
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <div 
          className={`group relative w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-300
            ${coverImage ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]' : 'border-white/20 hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]'}
            ${uploadMutation.isPending ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onClick={() => !coverImage && fileInputRef.current?.click()}
        >
          {uploadMutation.isPending && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-3 drop-shadow-md" />
              <span className="text-sm font-bold text-text animate-pulse">Uploading...</span>
            </div>
          )}

          {coverImage ? (
            <>
              <img src={coverImage} alt="Cover Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 bg-white text-text font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Replace
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverImage(null);
                  }}
                  className="p-2.5 bg-red-500/90 text-white rounded-xl hover:bg-red-500 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center p-6 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-text mb-1">Click or drag banner here</p>
              <p className="text-xs text-text/50 font-medium">SVG, PNG, JPG or GIF (max. 10MB)</p>
              <p className="text-xs text-text/40 mt-4 font-semibold tracking-wide">RECOMMENDED: 1920 x 1080px</p>
            </motion.div>
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
}
