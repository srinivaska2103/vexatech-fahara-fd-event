import { Image as ImageIcon } from 'lucide-react';

export default function ReviewGallery({ images = [] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 flex items-center gap-2 pb-4 border-b border-border">
        <ImageIcon className="w-4 h-4 text-text/50" /> Customer Photos ({images.length})
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-background border border-border relative group cursor-pointer">
            {/* Fallback for broken images in development */}
            <div className="absolute inset-0 flex items-center justify-center text-text/20">
              <ImageIcon className="w-8 h-8" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={url} 
              alt={`Review attachment ${idx + 1}`} 
              className="w-full h-full object-cover relative z-10 hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
