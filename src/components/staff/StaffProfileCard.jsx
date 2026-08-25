import StaffRoleBadge from './StaffRoleBadge';
import StaffStatusBadge from './StaffStatusBadge';
import { Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function StaffProfileCard({ staff }) {
  if (!staff) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-4xl text-primary shrink-0">
          {staff.name?.charAt(0) || 'S'}
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-text">{staff.name}</h1>
            <div className="flex items-center gap-2">
              <StaffRoleBadge role={staff.role} />
              <StaffStatusBadge status={staff.status} />
            </div>
          </div>
          <p className="text-sm text-text/60 max-w-lg">{staff.experience || 'Event team member specializing in creating unforgettable experiences.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-2">Contact Info</h3>
          <div className="flex items-center gap-3 text-sm text-text/70">
            <Phone className="w-4 h-4 text-primary" />
            {staff.phone || 'N/A'}
          </div>
          <div className="flex items-center gap-3 text-sm text-text/70">
            <Mail className="w-4 h-4 text-primary" />
            {staff.email || 'N/A'}
          </div>
          <div className="flex items-center gap-3 text-sm text-text/70">
            <MapPin className="w-4 h-4 text-primary" />
            {staff.address || 'Location not specified'}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-2">Employment Details</h3>
          <div className="flex items-center gap-3 text-sm text-text/70">
            <Calendar className="w-4 h-4 text-primary" />
            Joined: {staff.created_at ? format(new Date(staff.created_at), 'MMMM d, yyyy') : 'Recently'}
          </div>
          <div className="flex items-center gap-3 text-sm text-text/70">
            <Clock className="w-4 h-4 text-primary" />
            Type: Full-Time
          </div>
        </div>
      </div>
    </div>
  );
}
