'use client';

import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UpcomingEventsCard({ events = [] }) {
  const hasEvents = events && events.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-tour="upcoming-events" 
      className="relative overflow-hidden bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group select-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Upcoming Events</h3>
          <p className="text-xs text-[#8C6D58] font-medium mt-0.5">Scheduled client events and functions</p>
        </div>
        <Link 
          href="/event/bookings" 
          className="group/link text-xs font-bold text-[#6F4E37] hover:text-[#4A3324] px-3.5 py-1.5 rounded-full bg-[#FFF8F0] border border-[#6F4E37]/20 hover:border-[#6F4E37] transition-all duration-300 flex items-center gap-1.5 shadow-2xs"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Body Content */}
      {!hasEvents ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8F0] to-[#F3E8DC] border border-[#6F4E37]/15 rounded-2xl flex items-center justify-center mb-4 text-[#6F4E37] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Calendar className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-extrabold text-[#2C1810] mb-1">No upcoming events</h4>
          <p className="text-xs text-[#2C1810]/60 max-w-xs leading-relaxed">Your schedule is clear for now. Prepare for upcoming bookings or review past events.</p>
        </div>
      ) : (
        <div className="space-y-3.5 flex-1 relative z-10">
          {events.map((event, idx) => {
            const dateStr = event.date || event.booking_date;
            const date = dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Invalid Date';
            return (
              <div 
                key={idx} 
                className="flex gap-4 items-center p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE1] hover:border-[#6F4E37]/30 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group/item"
              >
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#6F4E37] to-[#4A3324] text-white w-14 h-14 rounded-xl shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{date.split(' ')[0]}</span>
                  <span className="text-lg font-black leading-none">{date.split(' ')[1] || ''}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-[#2C1810] truncate group-hover/item:text-[#6F4E37] transition-colors">
                    {event.customerName || event.customer_name || 'Customer Event'}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#2C1810]/60 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6F4E37]" /> {
                        (() => {
                          const t = event.startTime || event.start_time;
                          if (!t) return 'TBD';
                          try {
                            if (t.includes('T')) return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
                            const [h, m] = t.split(':');
                            const d = new Date();
                            d.setHours(h, m);
                            return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                          } catch (e) { return t; }
                        })()
                      }
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" /> {event.cafeName || event.venue || 'Main Hall'}
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0">
                  <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border shadow-2xs ${
                    event.status === 'CONFIRMED' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
