import { useCalendarStore } from '@/store/useCalendarStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function CalendarToolbar() {
  const { currentDate, view, next, prev, today, setView } = useCalendarStore();

  const getTitle = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    return format(currentDate, 'MMMM d, yyyy');
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 sm:p-5 bg-white border border-[#FEE2E2] rounded-3xl shadow-xs gap-4 mb-6 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#E50914]/10 via-[#B71C1C]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Date Navigation & Title */}
      <div className="flex items-center gap-3 relative z-10 flex-wrap">
        <button 
          type="button"
          onClick={today}
          className="px-4 py-2 text-xs font-black text-[#E50914] bg-[#FFF5F5] hover:bg-[#E50914] hover:text-white border border-[#E50914]/20 rounded-2xl transition-all shadow-2xs active:scale-95"
        >
          Today
        </button>
        <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl p-1 shadow-2xs">
          <button 
            type="button"
            onClick={prev}
            className="p-1.5 text-[#757575] hover:text-[#252525] hover:bg-[#FFF5F5] rounded-xl transition-colors active:scale-95"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button 
            type="button"
            onClick={next}
            className="p-1.5 text-[#757575] hover:text-[#252525] hover:bg-[#FFF5F5] rounded-xl transition-colors active:scale-95"
            title="Next"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#252525] tracking-tight ml-1">{getTitle()}</h2>
      </div>

      {/* View Switcher Pills */}
      <div className="flex items-center p-1 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl shadow-2xs relative z-10 overflow-x-auto scrollbar-none">
        {['month', 'week', 'day', 'agenda'].map((v) => {
          const isActive = view === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl capitalize transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-[#E50914] text-white shadow-xs' 
                  : 'text-[#757575] hover:text-[#252525] hover:bg-[#FFF5F5]'
              }`}
            >
              {v === 'agenda' ? (
                <div className="flex items-center gap-1.5">
                  <List className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Agenda</span>
                </div>
              ) : (
                v
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
