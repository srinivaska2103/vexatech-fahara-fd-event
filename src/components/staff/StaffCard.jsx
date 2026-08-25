import StaffRoleBadge from './StaffRoleBadge';
import StaffStatusBadge from './StaffStatusBadge';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function StaffCard({ staff, onDelete }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary">
            {staff.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h3 className="font-bold text-text text-base leading-tight group-hover:text-primary transition-colors">
              <Link href={`/event/staff/${staff.id}`} className="after:absolute after:inset-0">
                {staff.name}
              </Link>
            </h3>
            <p className="text-xs text-text/50 mt-0.5">{staff.experience || 'New Joiner'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <StaffRoleBadge role={staff.role} />
        <StaffStatusBadge status={staff.status} />
      </div>
      
      <div className="flex flex-col gap-2 mt-auto text-sm text-text/70">
        <div className="flex items-center gap-2 relative z-10">
          <Phone className="w-4 h-4 shrink-0 text-text/40" />
          <span className="truncate">{staff.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <Mail className="w-4 h-4 shrink-0 text-text/40" />
          <span className="truncate">{staff.email || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
