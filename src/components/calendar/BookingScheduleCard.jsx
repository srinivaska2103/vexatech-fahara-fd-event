export default function BookingScheduleCard({ booking }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-text">{booking?.service_name || 'Booking Service'}</h4>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/20 text-text">
          {booking?.status || 'PENDING'}
        </span>
      </div>
      <div className="text-sm text-text/70 mb-4">
        {booking?.customer || 'Customer Name'}
      </div>
      <div className="flex items-center justify-between text-xs font-semibold text-text/50">
        <span>{booking?.date || 'Today'}</span>
        <span>{booking?.time || '10:00 AM - 12:00 PM'}</span>
      </div>
    </div>
  );
}
