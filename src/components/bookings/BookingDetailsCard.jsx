import { AlignLeft, MessageSquare, Sparkles } from 'lucide-react';

export default function BookingDetailsCard({ booking }) {
  if (!booking) return null;

  const eventReq = booking.event_special_request || booking.special_request || booking.special_requests || booking.specialRequests;
  const cafeReq = booking.special_request;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-7 shadow-xs hover:shadow-sm transition-all space-y-6 text-[#2C1810]">
      <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
        <div className="w-11 h-11 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] border border-[#DDB892]/40 flex items-center justify-center font-black text-sm shrink-0">
          <AlignLeft className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#2C1810] tracking-tight">Booking Notes & Requests</h2>
          <p className="text-xs text-stone-500 font-medium">Special instructions from the customer</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" /> Event Manager Special Requests
          </span>
          {eventReq ? (
            <p className="text-xs text-[#2C1810] bg-[#FFF8F0] p-4 rounded-2xl border border-[#DDB892]/50 font-medium leading-relaxed italic">
              "{eventReq}"
            </p>
          ) : (
            <p className="text-xs font-bold text-stone-400 italic p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              No specific event arrangement requests provided by customer.
            </p>
          )}
        </div>

        {cafeReq && eventReq && cafeReq !== eventReq && (
          <div>
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MessageSquare size={12} /> Cafe Venue Requests
            </span>
            <p className="text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 font-medium leading-relaxed">
              "{cafeReq}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
