import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function UpcomingBookingsCard({ bookings = [] }) {
  const upcoming = bookings.filter(b => b.booking_status === 'PENDING' || b.booking_status === 'ACCEPTED');

  if (upcoming.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 pb-4 border-b border-border">
          Upcoming Events
        </h3>
        <div className="text-sm font-semibold text-text/50 text-center py-4">
          No upcoming events scheduled.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 pb-4 border-b border-border flex items-center justify-between">
        Upcoming Events
        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">{upcoming.length}</span>
      </h3>
      
      <div className="space-y-4">
        {upcoming.map(booking => (
          <div key={booking.id} className="p-4 bg-background border border-border rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-text">{booking.cafes?.name || 'Cafe Booking'}</h4>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">#{booking?.id ? String(booking.id).slice(0, 8) : ''}</span>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2 text-xs text-text/70">
                <Calendar className="w-3.5 h-3.5" />
                {booking.booking_date ? format(new Date(booking.booking_date), 'MMMM d, yyyy') : 'Date TBD'}
              </div>
              <div className="flex items-center gap-2 text-xs text-text/70">
                <Clock className="w-3.5 h-3.5" />
                {booking.start_time || 'Time TBD'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
