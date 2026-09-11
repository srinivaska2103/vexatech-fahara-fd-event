import CustomerStatusBadge from './CustomerStatusBadge';
import VIPBadge from './VIPBadge';
import { useToggleVIPMutation } from '@/hooks/customers/useCustomerMutations';
import { MapPin, Calendar, Clock, Crown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerProfileCard({ customer, bookings = [] }) {
  const toggleVipMutation = useToggleVIPMutation(customer?.id);

  if (!customer) return null;

  const lastBooking = bookings.length > 0 
    ? bookings.reduce((latest, current) => {
        if (!latest.booking_date) return current;
        if (!current.booking_date) return latest;
        return new Date(latest.booking_date) > new Date(current.booking_date) ? latest : current;
      })
    : null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Decorative background element for VIPs */}
      {customer.is_vip && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full -z-0"></div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0 max-w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-2xl sm:text-3xl text-primary shrink-0 shadow-sm">
            {customer.name?.charAt(0) || 'C'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-text truncate max-w-[200px] sm:max-w-xs">
                {customer.name || 'Unknown'}
              </h1>
              <VIPBadge isVip={customer.is_vip} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CustomerStatusBadge status={customer.status || 'ACTIVE'} />
              <span className="text-[11px] text-text/50 font-bold uppercase tracking-wider truncate max-w-[160px] sm:max-w-xs" title={`ID: #${customer.id}`}>
                ID: #{customer.id}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => toggleVipMutation.mutate(!customer.is_vip)}
          disabled={toggleVipMutation.isPending}
          className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shrink-0 ${
            customer.is_vip 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
              : 'bg-background border border-border text-text hover:bg-surface'
          }`}
        >
          {toggleVipMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Crown className="w-4 h-4" />
          )}
          {customer.is_vip ? 'Remove VIP' : 'Mark as VIP'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 mt-6 border-t border-border relative z-10">
        <div className="flex items-center gap-3 text-sm text-text/70">
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text/40 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/40 uppercase">Registered</div>
            <div className="font-medium">{customer.created_at ? format(new Date(customer.created_at), 'MMM d, yyyy') : 'Unknown'}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-text/70">
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text/40 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/40 uppercase">Last Booking</div>
            <div className="font-medium">{lastBooking?.booking_date ? format(new Date(lastBooking.booking_date), 'MMM d, yyyy') : 'No bookings'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-text/70">
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text/40 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/40 uppercase">Location</div>
            <div className="font-medium">{customer.city || 'Not specified'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
