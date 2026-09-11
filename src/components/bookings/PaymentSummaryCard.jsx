import { IndianRupee, CheckCircle, Clock, Sparkles } from 'lucide-react';

export default function PaymentSummaryCard({ booking }) {
  if (!booking) return null;

  const eventAmount = Number(booking.event_service_amount || 0);

  // Extract inclusion items (strictly EVENT items, exclude CAFE charges & cafe inclusions)
  const inclusionItems = Array.isArray(booking.booking_items)
    ? booking.booking_items.filter(item => (item.provider_type === 'EVENT' || item.item_type === 'EVENT_INCLUSION') && item.item_type !== 'CAFE_CHARGE' && item.provider_type !== 'CAFE')
    : (Array.isArray(booking.inclusions) ? booking.inclusions : []);

  const isPaid = (booking.payment_status || '').toLowerCase() === 'paid';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-7 shadow-xs hover:shadow-sm transition-all space-y-6 text-[#2C1810]">
      <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-sm shrink-0">
          <IndianRupee className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#2C1810] tracking-tight">Payment Summary</h2>
          <p className="text-xs text-stone-500 font-medium">Event manager charges & payment status</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border border-[#DDB892]/60 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-extrabold text-[#6F4E37] uppercase tracking-wider">Event Service Package</span>
          <span className="font-black text-[#2C1810]">₹{eventAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="pt-2 border-t border-[#DDB892]/40 flex justify-between items-center">
          <span className="text-xs font-black text-[#2C1810]">Total Event Earnings</span>
          <span className="text-xl font-black text-[#6F4E37]">₹{eventAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Selected Inclusions */}
      {inclusionItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Selected Inclusions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {inclusionItems.map((inc, i) => {
              const name = typeof inc === 'string' ? inc : (inc.item_name || inc.name || inc.tier_name || 'Inclusion');
              const level = inc.package_level || inc.tier_name || inc.level || '';
              return (
                <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white border border-stone-200 shadow-2xs text-[#2C1810]">
                  ✓ {name}{level ? ` (${level})` : ''}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-1.5">Payment Status</p>
        {isPaid ? (
          <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 py-2.5 rounded-2xl border border-emerald-200 font-extrabold text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Paid in Full
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-800 py-2.5 rounded-2xl border border-amber-200 font-extrabold text-xs">
            <Clock className="w-4 h-4 text-amber-600" /> Pending Payment
          </div>
        )}
      </div>
    </div>
  );
}
