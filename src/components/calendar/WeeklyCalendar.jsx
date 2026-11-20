'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isToday, 
  isSameDay 
} from 'date-fns';
import { ShieldAlert, Clock, MapPin, Plus } from 'lucide-react';

export default function WeeklyCalendar({ events = [] }) {
  const { currentDate, selectedDate, setSelectedDate, openCreateBlockModal, openEditBlockModal, filters } = useCalendarStore();
  
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Filter events based on active legend/filters
  const filteredEvents = events.filter(e => {
    if (!filters.status || filters.status === 'all') return true;
    const filterUpper = filters.status.toUpperCase();
    if (filterUpper === 'BLOCKED') return e.type === 'BLOCK';
    if (filterUpper === 'CONFIRMED') return e.type === 'BOOKING' && (e.status === 'CONFIRMED' || e.status === 'ACCEPTED');
    if (filterUpper === 'PENDING') return e.type === 'BOOKING' && e.status === 'PENDING';
    if (filterUpper === 'PRIVATE') return e.type === 'BLOCK' && e.reason === 'PRIVATE_EVENT';
    if (filterUpper === 'CANCELLED') return e.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col w-full bg-white border border-[#FEE2E2] rounded-3xl overflow-hidden shadow-xs">
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <div className="min-w-[750px] flex flex-col h-full">
          
          {/* Header Row */}
          <div className="flex border-b border-[#FEE2E2] bg-[#FFF5F5] sticky top-0 z-20 select-none">
            <div className="w-20 shrink-0 border-r border-[#FEE2E2] py-3 text-center text-[10px] font-black text-[#757575] uppercase">
              TIME
            </div>
            {days.map(day => {
              const isCurrentDay = isToday(day);
              const isDaySelected = selectedDate && isSameDay(day, selectedDate);
              return (
                <div 
                  key={day.toISOString()} 
                  onClick={() => setSelectedDate(day)}
                  className={`flex-1 py-3 px-1 text-center border-r border-[#FEE2E2] last:border-r-0 cursor-pointer transition-colors ${
                    isDaySelected ? 'bg-[#FFF5F5]' : 'hover:bg-white/80'
                  }`}
                >
                  <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isCurrentDay ? 'text-[#E50914]' : 'text-[#757575]'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-xs font-black w-7 h-7 mx-auto flex items-center justify-center rounded-xl transition-all ${
                    isCurrentDay 
                      ? 'bg-[#E50914] text-white shadow-xs scale-105' 
                      : isDaySelected
                      ? 'bg-[#B71C1C] text-white'
                      : 'text-[#252525]'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Timeline Grid Body */}
          <div className="flex-1 overflow-y-auto max-h-[650px] scrollbar-none">
            <div className="flex relative">
              {/* Hour Labels */}
              <div className="w-20 shrink-0 border-r border-[#FEE2E2] bg-[#FFFDF9] sticky left-0 z-10 select-none">
                {hours.map(hour => (
                  <div key={hour} className="h-16 border-b border-[#F2EAE1] relative text-right pr-2">
                    <span className="text-[10px] font-extrabold text-[#757575] absolute -top-2.5 right-1.5 bg-[#FFFDF9] px-1 rounded-md border border-[#FEE2E2]/40">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Day Columns */}
              <div className="flex-1 flex w-full">
                {days.map(day => {
                  const dayDateStr = format(day, 'yyyy-MM-dd');
                  const dayEvents = filteredEvents.filter(e => {
                    if (e.date && e.endDate) {
                      return dayDateStr >= e.date && dayDateStr <= e.endDate;
                    }
                    if (e.date) return e.date === dayDateStr;
                    if (e.startTime) {
                      const sStr = format(new Date(e.startTime), 'yyyy-MM-dd');
                      const eStr = e.endTime ? format(new Date(e.endTime), 'yyyy-MM-dd') : sStr;
                      return dayDateStr >= sStr && dayDateStr <= eStr;
                    }
                    return false;
                  });

                  return (
                    <div key={day.toISOString()} className="flex-1 border-r border-[#F2EAE1] last:border-r-0 relative min-w-[90px]">
                      {hours.map(hour => (
                        <div 
                          key={hour} 
                          onClick={() => {
                            const d = new Date(day);
                            d.setHours(hour, 0, 0, 0);
                            setSelectedDate(d);
                            openCreateBlockModal(d);
                          }}
                          className="h-16 border-b border-[#F2EAE1] border-dashed hover:bg-[#FFF5F5]/40 transition-colors cursor-pointer group relative"
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#E50914]/60">
                            + Add
                          </span>
                        </div>
                      ))}

                      {/* Event and Block Overlays for this Day */}
                      {dayEvents.map((evt, idx) => {
                        const isBlock = evt.type === 'BLOCK';
                        const isAllDay = evt.isAllDay;
                        
                        let topPx = 9 * 64; // default 9am
                        let heightPx = 64;

                        if (!isAllDay && evt.startTime) {
                          const sDt = new Date(evt.startTime);
                          const eDt = evt.endTime ? new Date(evt.endTime) : new Date(sDt.getTime() + 60 * 60 * 1000);
                          const sHour = sDt.getHours() + sDt.getMinutes() / 60;
                          const eHour = eDt.getHours() + eDt.getMinutes() / 60;
                          topPx = sHour * 64;
                          heightPx = Math.max(32, (eHour - sHour) * 64);
                        }

                        if (isAllDay) {
                          topPx = 0;
                          heightPx = 24 * 64;
                        }

                        return (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isBlock && evt.block) {
                                openEditBlockModal(evt.block);
                              }
                            }}
                            style={{
                              top: `${topPx}px`,
                              height: `${heightPx}px`,
                              zIndex: isBlock ? 5 : 6
                            }}
                            className={`absolute left-1 right-1 rounded-xl p-2 cursor-pointer shadow-xs border text-[10px] font-bold overflow-hidden transition-all hover:scale-101 hover:z-20 ${
                              isBlock
                                ? evt.reason === 'PRIVATE_EVENT'
                                  ? 'bg-purple-100 text-purple-950 border-purple-300'
                                  : 'bg-rose-100/90 text-rose-950 border-rose-300'
                                : evt.status === 'CONFIRMED' || evt.status === 'ACCEPTED'
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-amber-100 text-amber-950 border-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-1 font-black truncate">
                              {isBlock ? <ShieldAlert className="w-3 h-3 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
                              <span className="truncate">{evt.title}</span>
                            </div>
                            {evt.venueName && (
                              <div className="flex items-center gap-1 text-[9px] text-[#252525]/70 truncate mt-0.5">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{evt.venueName}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
