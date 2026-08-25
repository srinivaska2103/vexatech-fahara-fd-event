import { useCalendarStore } from '@/store/useCalendarStore';
import { Calendar as CalendarIcon, Users, CheckCircle2, Clock } from 'lucide-react';

export default function CalendarSidebar() {
  const { filters, setFilters } = useCalendarStore();

  const handleStatusChange = (status) => {
    setFilters({ status });
  };

  return (
    <div className="w-full lg:w-64 bg-surface border-r border-border p-4 flex flex-col gap-6 shrink-0 h-full overflow-y-auto">
      <div>
        <h3 className="text-xs font-bold text-text/50 uppercase tracking-wider mb-4">Event Status</h3>
        <div className="space-y-2">
          {['all', 'ACCEPTED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="status"
                value={status}
                checked={filters.status === status}
                onChange={() => handleStatusChange(status)}
                className="w-4 h-4 text-primary focus:ring-primary border-border"
              />
              <span className={`text-sm font-semibold capitalize transition-colors ${filters.status === status ? 'text-primary' : 'text-text group-hover:text-primary/70'}`}>
                {status}
              </span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
