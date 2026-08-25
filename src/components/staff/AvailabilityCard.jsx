import { Calendar } from 'lucide-react';
import AvailabilityTimeline from '../calendar/AvailabilityTimeline';

export default function AvailabilityCard({ staff }) {
  if (!staff) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Availability & Schedule</h3>
          <p className="text-xs text-text/50">Current working hours and upcoming leaves</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-text mb-3">Today's Timeline</h4>
          <AvailabilityTimeline staffId={staff.id} />
        </div>

        <div className="pt-6 border-t border-border">
          <h4 className="text-sm font-bold text-text mb-3">Regular Working Days</h4>
          <div className="flex gap-2 flex-wrap">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <span key={day} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {day}
              </span>
            ))}
            {['Sat', 'Sun'].map(day => (
              <span key={day} className="px-3 py-1 bg-background text-text/40 border border-border border-dashed text-xs font-bold rounded-full">
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
