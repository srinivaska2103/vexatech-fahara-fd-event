import { XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function CancelledBookingsCard({ bookings = [] }) {
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');

  if (cancelled.length === 0) {
    return null; // Don't show if no cancelled bookings
  }

  return (
    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-6 pb-4 border-b border-red-200 flex items-center justify-between">
        Cancelled Events
        <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs">{cancelled.length}</span>
      </h3>
      
      <div className="space-y-4">
        {cancelled.map(booking => (
          <div key={booking.id} className="p-4 bg-white border border-red-100 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-text">{booking.service_name || 'Event Service'}</h4>
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xs text-text/70 mt-2">
              Originally scheduled for: {booking.event_date ? format(new Date(booking.event_date), 'MMM d, yyyy') : 'Unknown'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
