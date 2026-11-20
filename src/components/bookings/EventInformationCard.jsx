import { Calendar, Clock, MapPin, Users, Tag, Package as PackageIcon, Store } from 'lucide-react';

export default function EventInformationCard({ booking }) {
  if (!booking) return null;

  const serviceName = booking.event_services?.service_name || booking.event_services?.category || booking.service_name || booking.packages?.package_name || 'Event Service';
  const packageName = booking.packages?.package_name || booking.package_name || booking.cafe_packages?.package_name || booking.event_services?.service_name || booking.event_services?.category || 'Standard Package';
  
  const dateStr = (booking.event_date || booking.booking_date || booking.date) ? new Date(booking.event_date || booking.booking_date || booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  const timeStr = (() => {
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
  })();

  const guests = booking.guest_count || booking.total_persons || booking.guests || 0;

  const venueAddress = (() => {
    if (booking.venue_address && booking.venue_address.trim()) return booking.venue_address;
    if (booking.cafes?.address && booking.cafes.address.trim()) {
      return booking.cafes.city ? `${booking.cafes.address}, ${booking.cafes.city}` : booking.cafes.address;
    }
    if (booking.cafes?.name) {
      return `${booking.cafes.name}${booking.cafes.city ? ` (${booking.cafes.city})` : ''}`;
    }
    return 'Venue details available on cafe confirmation';
  })();

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-7 shadow-xs hover:shadow-sm transition-all space-y-6 text-[#252525]">
      <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-black text-sm shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#252525] tracking-tight">Event & Schedule Details</h2>
          <p className="text-xs text-stone-500 font-medium">Service specs and venue location</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5]/70 border border-[#EF5350]/40">
          <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <Tag size={12} /> Service Category
          </span>
          <p className="text-sm font-black text-[#252525]">{serviceName}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5]/70 border border-[#EF5350]/40">
          <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
            <PackageIcon size={12} /> Selected Package
          </span>
          <p className="text-sm font-black text-[#E50914]">{packageName}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-0.5">Date</span>
          <p className="text-xs font-black text-[#252525]">{dateStr}</p>
        </div>
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-0.5">Time</span>
          <p className="text-xs font-black text-[#252525]">{timeStr}</p>
        </div>
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-0.5">Guests</span>
          <p className="text-xs font-black text-[#252525]">{guests} Persons</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-stone-50 border border-stone-200/80 flex items-start gap-3">
        <Store size={18} className="text-[#E50914] shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider block mb-0.5">Venue Location</span>
          <p className="text-xs font-black text-[#252525] leading-relaxed">{venueAddress}</p>
        </div>
      </div>
    </div>
  );
}
