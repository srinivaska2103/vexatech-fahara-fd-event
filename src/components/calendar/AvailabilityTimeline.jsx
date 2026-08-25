import { useStaffAvailability } from '@/hooks/calendar/useCalendarQueries';
import AvailabilityBadge from './AvailabilityBadge';
import { Loader2 } from 'lucide-react';

export default function AvailabilityTimeline({ staffId, date }) {
  // Mock date range for the day
  const dateRange = { start: new Date(), end: new Date() };
  const { data: availability, isLoading } = useStaffAvailability(staffId, dateRange);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-text/50 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs font-semibold">Loading timeline...</span>
      </div>
    );
  }

  // Since backend APIs are missing, we simulate an empty timeline or basic state
  return (
    <div className="mt-4 pt-4 border-t border-border border-dashed">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text/50">Today's Schedule</h4>
        <AvailabilityBadge status="available" />
      </div>
      
      <div className="relative h-12 bg-background rounded-lg border border-border overflow-hidden flex">
        {/* Visual timeline blocks would go here based on the availability data */}
        <div className="flex-1 border-r border-border/50 bg-green-50/50 hover:bg-green-50 transition-colors" title="Available"></div>
        <div className="flex-1 border-r border-border/50 bg-green-50/50 hover:bg-green-50 transition-colors" title="Available"></div>
        <div className="flex-1 border-r border-border/50 bg-orange-50/50 hover:bg-orange-50 transition-colors" title="Busy (Booking #123)"></div>
        <div className="flex-1 border-r border-border/50 bg-green-50/50 hover:bg-green-50 transition-colors" title="Available"></div>
        <div className="flex-1 bg-green-50/50 hover:bg-green-50 transition-colors" title="Available"></div>
      </div>
      
      <div className="flex justify-between mt-1 text-[10px] font-bold text-text/40">
        <span>09:00</span>
        <span>12:00</span>
        <span>15:00</span>
        <span>18:00</span>
      </div>
    </div>
  );
}
