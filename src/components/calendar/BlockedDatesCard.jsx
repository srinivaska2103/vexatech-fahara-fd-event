'use client';

import { useCalendarBlockedDates } from '@/hooks/calendar/useCalendarQueries';
import { useCalendarStore } from '@/store/useCalendarStore';
import { ShieldAlert, Loader2, Plus, Clock, MapPin, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BlockedDatesCard() {
  const { data: blockedDates = [], isLoading } = useCalendarBlockedDates();
  const { openCreateBlockModal, openEditBlockModal } = useCalendarStore();

  return (
    <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 shadow-xs mt-6 select-none">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#2C1810]">Active Availability Blocks</h3>
            <p className="text-xs text-[#8C6D58] font-semibold">Locked dates, private reservations, and buffer times</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => openCreateBlockModal()}
          className="px-3.5 py-2 rounded-2xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/25 flex items-center gap-1.5 text-xs font-black transition-all active:scale-95 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Add Block</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8 text-[#8C6D58]">
          <Loader2 className="w-6 h-6 animate-spin text-[#6F4E37]" />
        </div>
      ) : blockedDates.length === 0 ? (
        <div className="text-center py-10 bg-[#FFFDF9] rounded-2xl border border-[#E8DED5] border-dashed text-[#8C6D58]">
          <p className="text-xs font-black text-[#2C1810]">No active availability blocks.</p>
          <p className="text-[11px] text-[#8C6D58] mt-1 font-semibold">All configured service dates are currently available for booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {blockedDates.map((block, idx) => {
            const startDt = new Date(block.start_at || block.startAt);
            const endDt = new Date(block.end_at || block.endAt);
            const isPrivate = block.reason === 'PRIVATE_EVENT';

            return (
              <div 
                key={block.id || idx} 
                onClick={() => openEditBlockModal(block)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-101 shadow-2xs ${
                  isPrivate 
                    ? 'bg-purple-50/50 border-purple-200 hover:border-purple-300' 
                    : 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs font-black text-[#2C1810] truncate">{block.title}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
                      isPrivate 
                        ? 'bg-purple-100 text-purple-900 border-purple-300' 
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}>
                      {block.reason}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#8C6D58] font-bold">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {block.is_all_day ? (
                          `${format(startDt, 'MMM d, yyyy')} (All Day)`
                        ) : (
                          `${format(startDt, 'MMM d, hh:mm a')} – ${format(endDt, 'hh:mm a')}`
                        )}
                      </span>
                    </div>

                    {block.cafes?.name && (
                      <div className="flex items-center gap-1.5 text-[#2C1810]">
                        <MapPin className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
                        <span className="truncate">{block.cafes.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] text-[#8C6D58] font-semibold">
                    {block.buffer_minutes > 0 ? `+${block.buffer_minutes}m buffer` : 'No buffer'}
                  </span>
                  <span className="text-[10px] font-black text-[#6F4E37] flex items-center gap-1 hover:underline">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
