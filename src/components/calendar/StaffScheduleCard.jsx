import AvailabilityTimeline from './AvailabilityTimeline';
import { Mail, Phone, Calendar } from 'lucide-react';

export default function StaffScheduleCard({ staff }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {staff?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="font-bold text-text text-lg">{staff?.name || 'Staff Name'}</h3>
            <p className="text-sm text-text/50">{staff?.role || 'Event Manager'}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-text/70">
          <Mail className="w-4 h-4" />
          {staff?.email || 'staff@example.com'}
        </div>
        <div className="flex items-center gap-2 text-sm text-text/70">
          <Phone className="w-4 h-4" />
          {staff?.phone || '+1 234 567 8900'}
        </div>
      </div>

      <AvailabilityTimeline staffId={staff?.id} />
    </div>
  );
}
