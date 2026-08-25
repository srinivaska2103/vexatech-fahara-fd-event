'use client';

import { Clock, MapPin, CheckCircle, CircleDashed, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TodaysScheduleCard({ events = [] }) {
  const today = new Date().toDateString();
  const formatTimeStr = (t) => {
    if (!t) return 'TBD';
    try {
      if (t.includes('T')) return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
      const [h, m] = t.split(':');
      const d = new Date();
      d.setHours(h, m);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) { return t; }
  };
  
  const todaysEvents = (events || [])
    .filter(event => new Date(event.date || event.booking_date).toDateString() === today)
    .sort((a, b) => (a.startTime || a.start_time || '').localeCompare(b.startTime || b.start_time || ''));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="relative overflow-hidden bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group select-none"
    >
      {/* Background Soft Glow Accent */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-[#A67B5B]/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Today's Schedule</h3>
          <p className="text-xs text-[#8C6D58] font-medium mt-0.5">Real-time daily timeline & itinerary</p>
        </div>
        <Link 
          href="/event/calendar" 
          className="group/link text-xs font-bold text-[#6F4E37] hover:text-[#4A3324] px-3.5 py-1.5 rounded-full bg-[#FFF8F0] border border-[#6F4E37]/20 hover:border-[#6F4E37] transition-all duration-300 flex items-center gap-1.5 shadow-2xs"
        >
          <span>Calendar</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Body Content */}
      {todaysEvents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8F0] to-[#F3E8DC] border border-[#6F4E37]/15 rounded-2xl flex items-center justify-center mb-4 text-[#6F4E37] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Clock className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-extrabold text-[#2C1810] mb-1">No events scheduled for today</h4>
          <p className="text-xs text-[#2C1810]/60 max-w-xs leading-relaxed">Take a break or prepare for upcoming events on your schedule.</p>
        </div>
      ) : (
        <div className="space-y-4 relative z-10 flex-1">
          {todaysEvents.map((event, idx) => (
            <div key={idx} className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE1] hover:border-[#6F4E37]/30 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                {event.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <CircleDashed className="w-4 h-4 text-amber-600 animate-spin-slow" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-extrabold text-sm text-[#2C1810] truncate">{event.customerName || event.customer_name || 'Event Booking'}</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFF8F0] text-[#6F4E37] border border-[#6F4E37]/20">
                    {formatTimeStr(event.startTime || event.start_time)}
                  </span>
                </div>
                <p className="text-xs text-[#2C1810]/60 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" /> {event.cafeName || event.venue || 'Venue TBD'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
