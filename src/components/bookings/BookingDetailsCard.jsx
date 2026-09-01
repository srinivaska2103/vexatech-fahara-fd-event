import { AlignLeft } from 'lucide-react';

export default function BookingDetailsCard({ booking }) {
  if (!booking) return null;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden h-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <AlignLeft className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight">Booking Notes & Requests</h2>
          <p className="text-sm text-text/60 mt-0.5">Special requirements from the customer</p>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Event Manager Special Request */}
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            ✨ Event Manager Requests
          </p>
          {(booking.event_special_request || booking.special_request || booking.special_requests || booking.specialRequests) ? (
            <p className="text-sm text-text/90 bg-primary/5 p-4 rounded-xl border border-primary/20 backdrop-blur-sm leading-relaxed whitespace-pre-wrap font-medium">
              {booking.event_special_request || booking.special_request || booking.special_requests || booking.specialRequests}
            </p>
          ) : (
            <p className="text-sm font-medium text-text/40 italic p-4 bg-background/30 rounded-xl border border-dashed border-border">
              No specific event arrangement requests provided.
            </p>
          )}
        </div>

        {/* Venue Special Request */}
        {booking.special_request && booking.event_special_request && (
          <div>
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-2">Venue & Cafe Requests</p>
            <p className="text-sm text-text/80 bg-background/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm leading-relaxed whitespace-pre-wrap">
              {booking.special_request}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
