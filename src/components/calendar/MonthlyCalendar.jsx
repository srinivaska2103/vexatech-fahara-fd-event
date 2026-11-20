'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { ShieldAlert, Clock, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function MonthlyCalendar({ events = [], onSelectDate }) {
  const { currentDate, selectedDate, setSelectedDate, openCreateBlockModal, openEditBlockModal, filters } = useCalendarStore();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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

  const getEventBadge = (event) => {
    if (event.type === 'BLOCK') {
      const isPrivate = event.reason === 'PRIVATE_EVENT';
      return {
        bg: isPrivate ? 'bg-purple-100 text-purple-900 border-purple-200' : 'bg-rose-100 text-rose-900 border-rose-200',
        dot: isPrivate ? 'bg-purple-600' : 'bg-rose-600',
        label: event.title || (isPrivate ? 'Private Event' : 'Blocked')
      };
    }
    if (event.status === 'CONFIRMED' || event.status === 'ACCEPTED') {
      return {
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        dot: 'bg-emerald-600',
        label: event.title || 'Confirmed Booking'
      };
    }
    if (event.status === 'PENDING') {
      return {
        bg: 'bg-amber-100 text-amber-900 border-amber-200',
        dot: 'bg-amber-600',
        label: event.title || 'Pending Request'
      };
    }
    return {
      bg: 'bg-stone-100 text-stone-700 border-stone-200',
      dot: 'bg-stone-500',
      label: event.title || 'Event'
    };
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-white border border-[#FEE2E2] rounded-3xl overflow-hidden shadow-xs">
      {/* Day Names Header */}
      <div className="grid grid-cols-7 border-b border-[#FEE2E2] bg-[#FFF5F5] select-none">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-black text-[#757575] tracking-widest uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);
          const isDaySelected = selectedDate && isSameDay(day, selectedDate);
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

          const hasBlocks = dayEvents.some(e => e.type === 'BLOCK');
          const hasBookings = dayEvents.some(e => e.type === 'BOOKING');

          return (
            <div 
              key={day.toISOString()} 
              onClick={() => {
                setSelectedDate(day);
                if (onSelectDate) onSelectDate(day);
              }}
              className={`min-h-[95px] sm:min-h-[120px] border-r border-b border-[#F2EAE1] p-2 transition-all cursor-pointer flex flex-col justify-between group relative ${
                !isCurrentMonth ? 'bg-[#FFFDF9]/40 text-[#757575]/40' : 'bg-white text-[#252525]'
              } ${isCurrentDay ? 'bg-[#FFF5F5]/80' : ''} ${isDaySelected ? 'ring-2 ring-inset ring-[#E50914] bg-[#FFF5F5]/40' : ''}`}
            >
              {/* Day Header */}
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-xl transition-all ${
                  isCurrentDay 
                    ? 'bg-[#E50914] text-white shadow-xs scale-105' 
                    : isDaySelected
                    ? 'bg-[#B71C1C] text-white'
                    : isCurrentMonth 
                    ? 'text-[#252525] group-hover:bg-[#FFF5F5] group-hover:text-[#E50914]' 
                    : 'text-[#757575]/40'
                }`}>
                  {format(day, 'd')}
                </span>
                
                {dayEvents.length > 0 && (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                    hasBlocks 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event & Availability Chips */}
              <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-none">
                {dayEvents.slice(0, 3).map((event, j) => {
                  const badge = getEventBadge(event);
                  return (
                    <div 
                      key={j} 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (event.type === 'BLOCK' && event.block) {
                          openEditBlockModal(event.block);
                        } else {
                          setSelectedDate(day);
                        }
                      }}
                      className={`text-[9.5px] font-bold truncate px-1.5 py-0.5 rounded-lg border transition-all flex items-center gap-1.5 shadow-2xs hover:scale-101 ${badge.bg}`}
                      title={badge.label}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`} />
                      <span className="truncate">{badge.label}</span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-[8.5px] font-black text-[#757575] block pl-1">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>

              {/* Hover quick add action on desktop */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(day);
                  openCreateBlockModal(day);
                }}
                className="opacity-0 group-hover:opacity-100 absolute bottom-1 right-1 p-1 bg-[#E50914] text-white rounded-lg text-[9px] font-bold shadow-xs transition-opacity hover:bg-[#252525]"
                title="Add Block on this date"
              >
                + Block
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
