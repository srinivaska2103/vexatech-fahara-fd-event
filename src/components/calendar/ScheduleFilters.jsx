import { useCalendarStore } from '@/store/useCalendarStore';

export default function ScheduleFilters() {
  const { filters, setFilters } = useCalendarStore();

  return (
    <div className="flex gap-2">
      <select 
        value={filters.service} 
        onChange={(e) => setFilters({ service: e.target.value })}
        className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm font-semibold text-text focus:outline-none focus:border-primary"
      >
        <option value="all">All Services</option>
        <option value="photography">Photography</option>
        <option value="catering">Catering</option>
      </select>
    </div>
  );
}
