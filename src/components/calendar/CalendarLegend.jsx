'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Lock, 
  XCircle, 
  Calendar as CalendarIcon, 
  Sparkles 
} from 'lucide-react';

export default function CalendarLegend() {
  const { filters, setFilters } = useCalendarStore();

  const statuses = [
    { id: 'all', label: 'All Items', color: 'bg-[#E50914]', border: 'border-[#E50914]/30' },
    { id: 'CONFIRMED', label: 'Confirmed Events', color: 'bg-emerald-600', border: 'border-emerald-600/30' },
    { id: 'PENDING', label: 'Pending Requests', color: 'bg-amber-500', border: 'border-amber-500/30' },
    { id: 'BLOCKED', label: 'Blocked / Unavailable', color: 'bg-rose-500', border: 'border-rose-500/30' },
    { id: 'PRIVATE', label: 'Private Events', color: 'bg-purple-600', border: 'border-purple-600/30' },
    { id: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-400', border: 'border-gray-400/30' },
  ];

  const currentStatus = filters.status || 'all';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-[#FEE2E2] rounded-3xl shadow-xs select-none">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#757575] flex items-center gap-1.5 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
          Filter View:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {statuses.map((st) => {
          const isSelected = currentStatus.toUpperCase() === st.id.toUpperCase();
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilters({ status: st.id })}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-[#FFF5F5] text-[#E50914] border-[#E50914]/30 shadow-2xs'
                  : 'bg-white text-[#757575] border-transparent hover:bg-[#FFFDF9] hover:text-[#252525]'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
