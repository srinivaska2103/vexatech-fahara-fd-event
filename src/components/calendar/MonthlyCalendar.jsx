import { useCalendarStore } from '@/store/useCalendarStore';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday } from 'date-fns';

export default function MonthlyCalendar({ events = [] }) {
  const { currentDate } = useCalendarStore();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="flex-1 flex flex-col w-full bg-white border border-[#E8DED5] rounded-3xl overflow-hidden shadow-xs">
      {/* Day Names Header */}
      <div className="grid grid-cols-7 border-b border-[#E8DED5] bg-[#FFF8F0] select-none">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-[10px] font-black text-[#8C6D58] tracking-widest uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);
          const dayEvents = events.filter(e => e.date === format(day, 'yyyy-MM-dd'));
          
          return (
            <div 
              key={day.toISOString()} 
              className={`min-h-[90px] sm:min-h-[110px] border-r border-b border-[#F2EAE1] p-2 transition-all hover:bg-[#FFFDF9] cursor-pointer flex flex-col justify-between group ${
                !isCurrentMonth ? 'bg-[#FFFDF9]/40 text-[#8C6D58]/40' : 'bg-white text-[#2C1810]'
              } ${isCurrentDay ? 'bg-[#FFF8F0]/80' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-xl transition-all ${
                  isCurrentDay 
                    ? 'bg-[#6F4E37] text-white shadow-xs scale-105' 
                    : isCurrentMonth 
                    ? 'text-[#2C1810] group-hover:bg-[#FFF8F0] group-hover:text-[#6F4E37]' 
                    : 'text-[#8C6D58]/40'
                }`}>
                  {format(day, 'd')}
                </span>
                
                {dayEvents.length > 0 && (
                  <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full border border-amber-200">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Chips */}
              <div className="space-y-1 overflow-y-auto max-h-[60px] scrollbar-none">
                {dayEvents.slice(0, 2).map((event, j) => (
                  <div 
                    key={j} 
                    className="text-[10px] font-bold truncate bg-[#FFF8F0] text-[#6F4E37] border border-[#6F4E37]/15 px-2 py-0.5 rounded-lg shadow-2xs hover:bg-[#6F4E37] hover:text-white transition-colors"
                  >
                    {event.title || 'Event Booking'}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[9px] font-black text-[#8C6D58] block pl-1">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
