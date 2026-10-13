'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Pencil, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Users, 
  Clock, 
  Sparkles,
  Cake,
  Heart,
  Briefcase,
  Camera,
  Music,
  Utensils,
  PartyPopper
} from 'lucide-react';

const CATEGORY_ICONS = {
  Birthday: Cake,
  Anniversary: Heart,
  'Corporate Meeting': Briefcase,
  Photography: Camera,
  'Music & DJ': Music,
  Catering: Utensils,
  Decoration: PartyPopper,
};

export default function ServiceCard({ service, onDelete, onEdit }) {
  const categoryName = service.category || 'Birthday';
  const IconComponent = CATEGORY_ICONS[categoryName] || PartyPopper;

  const inclusions = Array.isArray(service.inclusions) ? service.inclusions : [];
  const status = (service.status || 'ACTIVE').toUpperCase();
  const isActive = status === 'ACTIVE';

  const guestCount = service.max_guests || service.guests || 10;
  const durationHours = service.duration_hours || service.duration || 1;
  const pricingType = service.pricing_type || 'package'; // 'package' or 'guest'

  return (
    <div className="bg-white rounded-3xl border border-[#F2E8DE] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden p-5 sm:p-6 text-[#2C1810]">
      
      {/* Card Header: Category Badge & Status */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#FCD34D] text-[#92400E] text-[11px] font-black uppercase tracking-wider">
          <IconComponent className="w-3.5 h-3.5" />
          <span>{categoryName}</span>
        </div>

        {isActive && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>ACTIVE</span>
          </div>
        )}
      </div>

      {/* Package Name & Price */}
      <div className="space-y-1 mb-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-[#2C1810] tracking-tight line-clamp-1">
          {service.service_name}
        </h3>
        
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
            ₹{Number(service.price || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-semibold text-stone-500">
            / {pricingType === 'guest' ? 'guest' : 'package'}
          </span>
        </div>
      </div>

      {/* Capacity & Duration Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#FDE68A] text-[#92400E] text-xs font-bold">
          <Users className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Up to {guestCount} Guests</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFEFF] border border-[#A5F3FC] text-[#0891B2] text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-[#0891B2]" />
          <span>{durationHours} {durationHours === 1 ? 'Hour' : 'Hours'}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-stone-600 font-medium line-clamp-2 mb-5 leading-relaxed">
        {service.description || 'Custom tailored event celebration package for your guests.'}
      </p>

      {/* Package Inclusions */}
      <div className="mt-auto space-y-2.5 pt-4 border-t border-stone-100">
        <div className="flex items-center gap-1 text-[10px] font-black text-[#D97706] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#D97706]" />
          <span>PACKAGE INCLUSIONS ({inclusions.length})</span>
        </div>

        <div className="space-y-1.5">
          {inclusions.length > 0 ? (
            inclusions.slice(0, 3).map((inc, idx) => {
              const name = typeof inc === 'string' ? inc : (inc.name || inc.category || `Item ${idx + 1}`);
              const unit = typeof inc === 'object' && inc.unit ? inc.unit : (typeof inc === 'object' && inc.quantity ? `${inc.quantity} Qty` : null);
              
              return (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-stone-50/80 border border-stone-100 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
                    <span className="font-bold text-[#2C1810] truncate">{name}</span>
                  </div>
                  {unit && (
                    <span className="text-[10px] font-extrabold text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200 shrink-0 ml-2">
                      {unit}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-stone-400 italic">No specific inclusions listed.</p>
          )}

          {inclusions.length > 3 && (
            <p className="text-[10px] font-bold text-stone-500 text-center pt-1">
              +{inclusions.length - 3} more items included
            </p>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center gap-2 pt-5 mt-4">
        {onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="flex-1 py-2.5 px-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        ) : (
          <Link
            href={`/event/services/${service.id}/edit`}
            className="flex-1 py-2.5 px-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
        )}

        <Link
          href={`/event/services/${service.id}/edit`}
          className="flex-1 py-2.5 px-4 rounded-2xl bg-[#4A2E1D] hover:bg-[#382215] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer text-center"
        >
          <Eye className="w-3.5 h-3.5 text-amber-300" />
          <span>Manage</span>
        </Link>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(service.id)}
            className="p-2.5 rounded-2xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            title="Delete package"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
