import { Coffee, Sparkles } from 'lucide-react';

export default function IncludedServicesCard({ booking }) {
  if (!booking) return null;

  const bookingData = booking.data || booking;
  const allItems = bookingData.booking_items || bookingData.bookingItems || [];

  // Filter strictly for event inclusions provided by EVENT manager (exclude CAFE provider items)
  const eventInclusions = allItems.filter(
    (it) => (it.provider_type === 'EVENT' || it.item_type === 'EVENT_INCLUSION') && it.item_type !== 'CAFE_CHARGE' && it.provider_type !== 'CAFE'
  );

  // Fallback to booking.inclusions JSON field
  let parsedInclusions = [];
  if (eventInclusions.length === 0 && bookingData.inclusions) {
    let inc = typeof bookingData.inclusions === 'string' ? (() => { try { return JSON.parse(bookingData.inclusions); } catch { return null; } })() : bookingData.inclusions;
    if (Array.isArray(inc)) {
      parsedInclusions = inc;
    } else if (inc && typeof inc === 'object') {
      Object.values(inc).forEach((val) => {
        if (Array.isArray(val)) val.forEach((v) => v && typeof v === 'object' && parsedInclusions.push(v));
        else if (val && typeof val === 'object') parsedInclusions.push(val);
      });
    }
  }

  const displayInclusions = eventInclusions.length > 0
    ? eventInclusions.map((it) => ({
        name: it.item_name || it.name || 'Inclusion',
        tierName: it.tier_name || null,
        tierId: it.tier_id || null,
        tierLevel: it.package_level || it.level || null,
        description: it.description || null,
        pricingType: it.pricing_type || 'FIXED',
        unitPrice: Number(it.unit_price || 0),
        quantity: Number(it.quantity || 1),
        amount: Number(it.amount || it.unit_price || 0),
      }))
    : parsedInclusions.map((it) => {
        const tierName = it.tier_name || it.tierName || it.name || null;
        const tierId = it.tier_id || it.tierId || it.id || null;
        return {
          name: it.item_name || it.inclusion_name || it.inclusionName || tierName || 'Inclusion',
          tierName,
          tierId,
          tierLevel: it.level || it.tierLevel || tierName,
          description: it.description || null,
          pricingType: it.pricing_type || it.pricingType || 'FIXED',
          unitPrice: Number(it.unit_price || it.unitPrice || it.price || 0),
          quantity: Number(it.quantity || 1),
          amount: Number(it.amount || it.price || it.unit_price || it.unitPrice || 0),
        };
      });

  const packageItem = allItems.find((it) => it.item_type === 'PACKAGE' && (it.provider_type === 'EVENT' || !it.provider_type)) || bookingData.event_services;

  if (displayInclusions.length === 0 && !packageItem) return null;

  const TIER_COLORS = {
    BASIC:    { bg: 'bg-sky-50',    border: 'border-sky-300/60',    text: 'text-sky-700',    pill: 'bg-sky-100 text-sky-700 border-sky-300' },
    STANDARD: { bg: 'bg-violet-50', border: 'border-violet-300/60', text: 'text-violet-700', pill: 'bg-violet-100 text-violet-700 border-violet-300' },
    PREMIUM:  { bg: 'bg-amber-50',  border: 'border-amber-300/60',  text: 'text-amber-700',  pill: 'bg-amber-100 text-amber-700 border-amber-400' },
  };
  const getTierColors = (tier) => TIER_COLORS[String(tier || '').toUpperCase()] || { bg: 'bg-surface/40', border: 'border-border/50', text: 'text-[#6F4E37]', pill: 'bg-[#6F4E37]/10 text-[#6F4E37] border-[#DDB892]/60' };

  const guestCount = bookingData.total_persons || bookingData.guest_count || bookingData.guestCount || 1;

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5 text-[#2C1810]">
      <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-black text-sm shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-[#2C1810] tracking-tight">Included Services & Packages</h3>
          <p className="text-xs text-stone-500 font-medium">Selected party packages and event add-ons</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Package Base Row if present */}
        {packageItem && packageItem.service_name && (
          <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#DDB892]/60 flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#DDB892]/30 to-[#FFF8F0] border border-[#DDB892]/60 flex items-center justify-center text-[#6F4E37] shrink-0 font-black text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-extrabold text-[#2C1810] text-sm">
                  {packageItem.service_name || packageItem.package_name || 'Event Package'}
                </h4>
                <span className="text-[10px] font-black bg-[#6F4E37]/10 text-[#6F4E37] border border-[#DDB892]/60 px-2 py-0.5 rounded-full uppercase tracking-wider">Package</span>
              </div>
              {packageItem.description && (
                <p className="text-xs text-stone-500 font-medium mt-0.5">{packageItem.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Inclusion rows */}
        {displayInclusions.map((inc, idx) => {
          const tierKey = String(inc.tierName || inc.tierLevel || '').toUpperCase();
          const colors = getTierColors(tierKey);
          const isPerGuest = String(inc.pricingType || '').toUpperCase() === 'PER_GUEST';
          const computedAmount = isPerGuest
            ? (inc.unitPrice * Number(guestCount)).toFixed(2)
            : inc.amount > 0 ? inc.amount.toFixed(2) : (inc.unitPrice * inc.quantity).toFixed(2);

          return (
            <div key={inc.tierId || idx} className={`p-4 rounded-2xl border ${colors.bg} ${colors.border} flex items-start gap-4`}>
              <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 font-black text-sm ${colors.bg} ${colors.border} ${colors.text}`}>
                {tierKey ? tierKey.charAt(0) : '★'}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-[#2C1810] text-sm">{inc.name}</h4>
                  {tierKey && (
                    <span className={`text-[10px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.pill}`}>
                      {tierKey}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md uppercase">
                    {inc.pricingType}
                  </span>
                </div>
                {inc.description && (
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">{inc.description}</p>
                )}
                <div className="text-xs font-bold text-stone-600 flex items-center gap-2 pt-1">
                  <span>Unit Price: <strong className="text-[#2C1810]">₹{inc.unitPrice.toFixed(2)}</strong></span>
                  {isPerGuest && (
                    <span className="text-stone-400">× <strong>{guestCount} guests</strong></span>
                  )}
                  <span className="text-[#6F4E37] font-black ml-auto text-sm">= ₹{computedAmount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
