'use client';

import { useProfileStore } from '@/store/profileStore';
import { Clock } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function WorkingHoursCard() {
  const { businessHours, updateBusinessHours } = useProfileStore();

  const handleToggleClosed = (day, closed) => {
    updateBusinessHours(day, { closed });
  };

  const handleTimeChange = (day, field, value) => {
    updateBusinessHours(day, { [field]: value });
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="border-b border-white/5 p-6 md:p-8 flex items-center gap-5 bg-gradient-to-r from-background/50 to-surface/50 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <Clock className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight">Working Hours</h2>
          <p className="text-sm text-text/60 mt-1 font-medium">Set your regular business hours</p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-3 relative z-10">
        {DAYS.map((day) => {
          const config = businessHours[day] || { open: '09:00', close: '17:00', closed: false };
          const isOpen = !config.closed;
          
          return (
            <div key={day} className={`flex flex-wrap items-center justify-between p-4 rounded-2xl transition-all duration-300 border gap-4 ${isOpen ? 'bg-background/40 border-primary/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]' : 'bg-transparent border-transparent hover:bg-background/20 hover:border-white/5'}`}>
              <div className="flex items-center gap-4 w-32 shrink-0">
                {/* Modern Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isOpen}
                    onChange={(e) => handleToggleClosed(day, !e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-surface border border-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className={`font-bold text-sm capitalize transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-text/60'}`}>{day}</span>
              </div>

              <div className={`flex items-center justify-end gap-3 flex-1 min-w-[200px] overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 max-h-20 translate-y-0' : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none'}`}>
                {isOpen && (
                  <>
                    <input 
                      type="time" 
                      value={config.open}
                      onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                      className="bg-surface hover:bg-background border border-white/10 hover:border-primary/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text font-semibold flex-1 max-w-[120px] text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all cursor-pointer backdrop-blur-sm"
                    />
                    <span className="text-text/30 font-bold text-xs uppercase tracking-widest shrink-0">to</span>
                    <input 
                      type="time" 
                      value={config.close}
                      onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                      className="bg-surface hover:bg-background border border-white/10 hover:border-primary/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-text font-semibold flex-1 max-w-[120px] text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all cursor-pointer backdrop-blur-sm"
                    />
                  </>
                )}
              </div>
              
              {!isOpen && (
                <div className="flex-1 flex justify-end items-center min-w-[200px] absolute right-4 md:right-8">
                  <span className="px-4 py-1.5 bg-surface/50 rounded-xl text-text/40 font-bold text-xs uppercase tracking-widest border border-white/5 backdrop-blur-sm">
                    Closed
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
