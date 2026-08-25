import Link from 'next/link';
import { Edit2, Trash2, Tag, Star, IndianRupee, Image as ImageIcon, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ServiceStatusBadge from './ServiceStatusBadge';

export default function ServiceCard({ service, onDelete }) {
  const firstImage = Array.isArray(service.gallery) ? service.gallery[0] : null;
  const coverImage = (firstImage && typeof firstImage === 'string' && firstImage.startsWith('http')) 
    ? firstImage 
    : null;

  let displayDescription = service.description || 'No description provided.';
  try {
    if (displayDescription.includes('{"meta":')) {
      displayDescription = displayDescription.split('{"meta":')[0].trim();
      if (!displayDescription) {
        displayDescription = 'No description provided.';
      }
    }
  } catch (e) {
    // ignore
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-[#E8DED5] rounded-3xl overflow-hidden hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group flex flex-col h-full relative"
    >
      {/* Soft Hover Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#6F4E37]/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-[#FFFDF9]">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={service.service_name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8F0] text-[#8C6D58]">
            <ImageIcon className="w-10 h-10 mb-1 opacity-60 text-[#6F4E37]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">Catalog Media</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <ServiceStatusBadge status={service.status || 'ACTIVE'} />
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#6F4E37] flex items-center gap-1.5 shadow-sm border border-[#6F4E37]/15">
          <Tag className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>{service.category}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-black text-base sm:text-lg text-[#2C1810] line-clamp-1 group-hover:text-[#6F4E37] transition-colors">
            {service.service_name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{Number(service.average_rating || 0).toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-[#8C6D58] font-medium line-clamp-2 mb-4 flex-1 leading-relaxed">
          {displayDescription}
        </p>

        {/* Pricing divider */}
        <div className="mb-5 py-3 border-y border-[#F2EAE1] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">Starting Price</span>
            <div className="flex items-center font-black text-lg text-[#2C1810]">
              <IndianRupee className="w-4 h-4 text-[#6F4E37] stroke-[2.5]" />
              <span>{Number(service.price || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#6F4E37]/20">
            Per Event
          </span>
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center gap-2.5 mt-auto">
          <Link 
            href={`/event/services/${service.id}/edit`}
            className="flex-1 bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/20 hover:border-[#6F4E37] rounded-2xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-black transition-all shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Service</span>
          </Link>
          <button 
            type="button"
            onClick={() => onDelete(service.id)}
            className="w-10 h-10 shrink-0 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-rose-200 hover:border-rose-600 shadow-2xs active:scale-95"
            title="Delete Service"
          >
            <Trash2 className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
