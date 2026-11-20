'use client';

import { Check, Clock, Calendar } from 'lucide-react';

export default function BookingTimeline({ booking }) {
  if (!booking) return null;

  const getStatusIndex = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 0;
      case 'ACCEPTED':
      case 'CONFIRMED': return 1;
      case 'ASSIGNED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      default: return -1;
    }
  };

  const currentIndex = getStatusIndex(booking.booking_status);

  const steps = [
    { label: 'Booking Created', date: booking.created_at },
    { label: 'Booking Accepted', date: currentIndex >= 1 ? booking.updated_at : null },
    { label: 'Staff Assigned', date: currentIndex >= 2 ? booking.updated_at : null },
    { label: 'Event Started', date: currentIndex >= 3 ? booking.updated_at : null },
    { label: 'Event Completed', date: currentIndex >= 4 ? booking.updated_at : null },
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-7 shadow-xs text-[#252525] h-full space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-black text-sm shrink-0">
          <Clock size={18} />
        </div>
        <div>
          <h2 className="text-base font-black text-[#252525] tracking-tight">Booking Timeline</h2>
          <p className="text-xs text-stone-500 font-medium">Real-time status progression</p>
        </div>
      </div>

      <div className="relative border-l-2 border-stone-200 ml-3.5 space-y-6">
        {steps.map((step, idx) => {
          const isCompleted = currentIndex >= idx;

          return (
            <div key={idx} className="relative pl-6">
              <div 
                className={`absolute left-[-9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                  isCompleted ? 'bg-[#E50914] text-white shadow-2xs' : 'bg-stone-100 border border-stone-300 text-stone-400'
                }`}
              >
                {isCompleted ? <Check size={10} className="stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
              </div>

              <div>
                <h4 className={`text-xs font-black transition-colors ${isCompleted ? 'text-[#252525]' : 'text-stone-400'}`}>
                  {step.label}
                </h4>
                {step.date ? (
                  <p className="text-[11px] font-bold text-[#E50914] mt-0.5">
                    {new Date(step.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} at {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                ) : (
                  <p className="text-[10px] font-medium text-stone-400 mt-0.5">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
