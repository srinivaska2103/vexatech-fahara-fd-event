'use client';

import { Image as ImageIcon, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewGallery({ images = [] }) {
  if (!images || images.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)] mb-6 font-sans"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <h3 className="text-sm font-black text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4.5 h-4.5 text-[#6F4E37]" /> Customer Attachments ({images.length})
        </h3>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#DDB892]/40">
          User Uploads
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 relative group cursor-pointer shadow-2xs">
            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
              <ImageIcon className="w-8 h-8" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={url} 
              alt={`Review photo ${idx + 1}`} 
              className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center text-white backdrop-blur-[2px]">
              <Maximize2 className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
