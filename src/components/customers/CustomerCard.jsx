import CustomerStatusBadge from './CustomerStatusBadge';
import VIPBadge from './VIPBadge';
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomerCard({ customer }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary">
            {customer.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-text text-base leading-tight group-hover:text-primary transition-colors">
                <Link href={`/event/customers/${customer.id}`} className="after:absolute after:inset-0">
                  {customer.name || 'Unknown'}
                </Link>
              </h3>
              <VIPBadge isVip={customer.is_vip} />
            </div>
            <p className="text-xs text-text/50 mt-0.5">LTV: ₹{(customer.total_spend || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <CustomerStatusBadge status={customer.status || 'ACTIVE'} />
      </div>
      
      <div className="flex flex-col gap-2 mt-auto text-sm text-text/70">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 shrink-0 text-text/40" />
            <span className="truncate">{customer.phone || 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 shrink-0 text-text/40" />
            <span className="truncate">{customer.email || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between z-10">
        <div className="text-xs font-bold text-text/50 uppercase tracking-wider">
          {customer.total_bookings || 0} Bookings
        </div>
        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transform">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
