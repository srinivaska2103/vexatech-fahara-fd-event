'use client';

import { useRef, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { useUploadMultipleImagesMutation } from '@/hooks/profile/useProfileMutations';
import { Images, UploadCloud, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryUploader() {
  const { gallery, setGallery } = useProfileStore();
  const fileInputRef = useRef(null);
  const uploadMutation = useUploadMultipleImagesMutation();

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    uploadMutation.mutate(files, {
      onSuccess: (urls) => {
        setGallery([...gallery, ...urls]);
      }
    });
  };

  const removeImage = (indexToRemove) => {
    setGallery(gallery.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group/card">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover/card:bg-primary/10 transition-colors duration-500" />
      
      <div className="border-b border-white/5 p-6 md:p-8 flex items-center gap-5 bg-gradient-to-r from-background/50 to-surface/50 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <Images className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight">Event Gallery</h2>
          <p className="text-sm text-text/60 mt-1 font-medium">Showcase your past events and decorations</p>
        </div>
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-4">
          <AnimatePresence>
            {gallery.map((url, idx) => (
              <motion.div 
                key={url + idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <button 
                  onClick={() => removeImage(idx)}
                  className="absolute top-3 right-3 p-2 bg-red-500/90 backdrop-blur-md text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-110 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group
              ${uploadMutation.isPending ? 'border-white/10 bg-background/50 opacity-50 pointer-events-none' : 'border-white/20 hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.15)]'}
            `}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : (
              <>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-text/80 group-hover:text-text transition-colors">Add Photos</span>
              </>
            )}
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden" 
        />
      </div>
    </div>
  );
}
