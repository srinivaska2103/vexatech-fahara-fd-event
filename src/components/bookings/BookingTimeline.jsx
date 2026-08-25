'use client';

import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

export default function BookingTimeline({ booking }) {
  if (!booking) return null;

  const getStatusIndex = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
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
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <h2 className="text-xl font-bold text-text tracking-tight mb-8">Booking Timeline</h2>

      <div className="relative border-l-2 border-border/50 ml-4 space-y-8">
        {steps.map((step, idx) => {
          const isCompleted = currentIndex >= idx;
          const isCurrent = currentIndex === idx;

          return (
            <div key={idx} className="relative pl-8">
              {/* Line active fill */}
              {isCompleted && idx < steps.length - 1 && (
                <div className="absolute left-[-2px] top-6 w-[2px] h-full bg-primary/40 -z-10" />
              )}
              
              <div 
                className={`absolute left-[-11px] top-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500
                  ${isCompleted ? 'bg-primary' : 'bg-background border-2 border-border/50'}
                `}
              >
                {isCompleted ? <Check className="w-3 h-3 text-white" /> : <Circle className="w-2 h-2 text-border/50" fill="currentColor" />}
              </div>

              <div>
                <h4 className={`text-sm font-bold transition-colors ${isCompleted ? 'text-text' : 'text-text/40'}`}>
                  {step.label}
                </h4>
                {step.date ? (
                  <p className="text-xs font-medium text-text/50 mt-1">
                    {new Date(step.date).toLocaleDateString()} at {new Date(step.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-text/30 mt-1">Pending</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
