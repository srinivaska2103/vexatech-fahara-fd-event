import { Calendar, Clock, MapPin, Users, Tag, Package as PackageIcon } from 'lucide-react';

export default function EventInformationCard({ booking }) {
  if (!booking) return null;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden h-full">
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] -z-10" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight">Event Details</h2>
          <p className="text-sm text-text/60 mt-0.5">Service and scheduling information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mb-6">
        <div>
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Tag className="w-3 h-3"/> Service</p>
          <p className="font-bold text-text bg-background/50 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
            {booking.service_name || booking.event_services?.service_name || booking.event_services?.category || 'Not specified'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><PackageIcon className="w-3 h-3"/> Package</p>
          <p className="font-bold text-primary bg-background/50 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
            {booking.package_name || booking.packages?.package_name || booking.cafe_packages?.package_name || (booking.event_service_id ? 'Custom Service' : 'N/A')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10 mb-6">
        <div>
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</p>
          <p className="font-semibold text-text/80 bg-background/50 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
            {(booking.event_date || booking.booking_date || booking.date) ? new Date(booking.event_date || booking.booking_date || booking.date).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
          <p className="font-semibold text-text/80 bg-background/50 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
            {(() => {
                const parseT = (t) => t.includes('T') ? t.split('T')[1].substring(0, 5) : t.substring(0, 5);
                const sTime = booking.event_time || booking.start_time || booking.startTime;
                if (!sTime) return 'N/A';
                
                try {
                    const timeParts = parseT(sTime);
                    const [h, m] = timeParts.split(':');
                    const d = new Date(); d.setHours(h, m, 0);
                    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                } catch(e) {
                    return sTime;
                }
            })()}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Guests</p>
          <p className="font-semibold text-text/80 bg-background/50 px-3 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
            {booking.guest_count || booking.total_persons || booking.guests || 0} Persons
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Venue Address</p>
        <p className="font-semibold text-text/80 bg-background/50 px-4 py-3 rounded-xl border border-white/5 backdrop-blur-sm leading-relaxed">
          {booking.venue_address || booking.cafes?.address || 'Not specified'}
        </p>
      </div>
    </div>
  );
}
