import { useCalendarStore } from '@/store/useCalendarStore';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';

export default function WeeklyCalendar({ events = [] }) {
  const { currentDate } = useCalendarStore();
  
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 flex flex-col w-full bg-white border border-[#E8DED5] rounded-3xl overflow-hidden shadow-xs">
      <div className="flex-1 overflow-x-auto scrollbar-none">
        <div className="min-w-[650px] flex flex-col h-full">
          {/* Header Row */}
          <div className="flex border-b border-[#E8DED5] bg-[#FFF8F0] sticky top-0 z-10 select-none">
            <div className="w-16 shrink-0 border-r border-[#E8DED5] py-3 text-center text-[10px] font-black text-[#8C6D58] uppercase">
              TIME
            </div>
            {days.map(day => {
              const isCurrentDay = isToday(day);
              return (
                <div key={day.toISOString()} className="flex-1 py-3 px-1 text-center border-r border-[#E8DED5] last:border-r-0">
                  <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isCurrentDay ? 'text-[#6F4E37]' : 'text-[#8C6D58]'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-sm font-black w-8 h-8 mx-auto flex items-center justify-center rounded-xl transition-all ${
                    isCurrentDay ? 'bg-[#6F4E37] text-white shadow-xs scale-105' : 'text-[#2C1810]'
                  }`}>
                    {format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Timeline Grid Body */}
          <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-none">
            <div className="flex relative">
              <div className="w-16 shrink-0 border-r border-[#E8DED5] bg-[#FFFDF9] sticky left-0 z-10 select-none">
                {hours.map(hour => (
                  <div key={hour} className="h-16 border-b border-[#F2EAE1] relative text-right pr-2">
                    <span className="text-[10px] font-extrabold text-[#8C6D58] absolute -top-2.5 right-1.5 bg-[#FFFDF9] px-1 rounded-md border border-[#E8DED5]/40">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex-1 flex w-full">
                {days.map(day => (
                  <div key={day.toISOString()} className="flex-1 border-r border-[#F2EAE1] last:border-r-0 relative">
                    {hours.map(hour => (
                      <div key={hour} className="h-16 border-b border-[#F2EAE1] border-dashed hover:bg-[#FFF8F0]/50 transition-colors"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
