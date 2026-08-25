import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import Link from 'next/link';

export default function BookingHistoryTable({ bookings = [] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-background border border-border border-dashed rounded-xl">
        <p className="text-sm font-semibold text-text/50">No booking history available.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-background/50 border-b border-border">
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Booking ID</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Service & Date</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Amount</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b border-border hover:bg-background/30 transition-colors">
              <td className="p-4 text-sm font-bold text-text">#{booking?.id ? String(booking.id).slice(0, 8) : ''}</td>
              <td className="p-4">
                <div className="font-bold text-sm text-text">{booking.cafes?.name || 'Cafe Booking'}</div>
                <div className="text-xs text-text/50">{booking.booking_date ? format(new Date(booking.booking_date), 'MMM d, yyyy') : 'TBD'}</div>
              </td>
              <td className="p-4 text-sm font-semibold text-text">₹{(booking.total_price || 0).toLocaleString()}</td>
              <td className="p-4">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(booking.booking_status)}`}>
                  {booking.booking_status || 'PENDING'}
                </span>
              </td>
              <td className="p-4 text-right">
                <Link 
                  href={`/event/bookings/${booking.id}`} 
                  className="inline-flex p-2 text-text/50 hover:text-primary hover:bg-surface rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
