'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, Eye, XCircle, Inbox, Calendar, User, IndianRupee, ChevronRight } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

export default function BookingTable({ bookings, isLoading, onApprove, onReject }) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full bg-white border border-[#E8DED5] rounded-3xl overflow-hidden shadow-xs animate-pulse p-4 space-y-4">
        <div className="h-12 bg-[#FFF8F0] rounded-2xl"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-[#FFFDF9] border border-[#F2EAE1] rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-white border border-[#E8DED5] rounded-3xl py-16 px-6 flex flex-col items-center justify-center text-center shadow-xs"
      >
        <div className="w-20 h-20 bg-[#FFF8F0] border border-[#6F4E37]/20 rounded-3xl flex items-center justify-center text-[#6F4E37] mb-4 shadow-inner">
          <Inbox className="w-10 h-10 stroke-[1.8]" />
        </div>
        <h3 className="text-xl font-black text-[#2C1810] mb-2">No Bookings Found</h3>
        <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-md mb-2 leading-relaxed">
          There are currently no event or venue reservations matching your filter.
        </p>
        <p className="text-[11px] text-[#8C6D58]/70 font-semibold">Try clearing your search term or switching status tabs above.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full bg-white border border-[#E8DED5] rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#2C1810] whitespace-nowrap">
          <thead className="bg-[#FFF8F0] border-b border-[#E8DED5] text-[10px] uppercase tracking-wider text-[#8C6D58] font-black select-none">
            <tr>
              <th className="px-6 py-4">Booking Ref</th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">Assigned Venue</th>
              <th className="px-6 py-4">Date & Schedule</th>
              <th className="px-6 py-4">Guests</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">View Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EAE1]">
            {bookings.map((booking, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                key={booking.id}
                className="hover:bg-[#FFFDF9] transition-colors group cursor-pointer"
                onClick={() => router.push(`/event/bookings/${booking.id}`)}
              >
                <td className="px-6 py-4 font-black text-[#6F4E37] align-middle">
                  <div className="inline-flex items-center gap-1 bg-[#FFF8F0] px-2.5 py-1 rounded-xl border border-[#6F4E37]/20 group-hover:bg-[#6F4E37] group-hover:text-white transition-all">
                    <span>#{booking.booking_number?.toUpperCase() || booking.id?.substring(0, 8).toUpperCase()}</span>
                  </div>
                </td>

                <td className="px-6 py-4 align-middle">
                  <p className="font-bold text-[#2C1810]">{booking.customerName || 'Guest Customer'}</p>
                  <p className="text-xs text-[#8C6D58] font-medium">{booking.customerEmail || 'No Email'}</p>
                </td>

                <td className="px-6 py-4 align-middle">
                  <span className="font-semibold text-[#2C1810] bg-[#FFF8F0]/80 px-2.5 py-1 rounded-xl border border-[#6F4E37]/10">
                    {booking.cafeName || 'Event Hall'}
                  </span>
                </td>

                <td className="px-6 py-4 align-middle">
                  <p className="font-bold text-[#2C1810]">
                    {booking.date ? new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                  </p>
                  <p className="text-xs text-[#8C6D58] font-medium">
                    {(() => {
                        const parseT = (t) => t?.includes('T') ? t.split('T')[1].substring(0, 5) : t?.substring(0, 5);
                        const formatT = (tStr) => {
                            if (!tStr) return '';
                            try {
                                const timeParts = parseT(tStr);
                                const [h, m] = timeParts.split(':');
                                const d = new Date(); d.setHours(h, m, 0);
                                return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                            } catch(e) {
                                return tStr;
                            }
                        };
                        const s = formatT(booking.startTime);
                        const e = formatT(booking.endTime);
                        if (s && e) return `${s} - ${e}`;
                        return s || e || '';
                    })()}
                  </p>
                </td>

                <td className="px-6 py-4 align-middle">
                  <span className="font-extrabold text-[#2C1810] text-xs">
                    {booking.guests || 1} Guests
                  </span>
                </td>

                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center font-black text-sm text-[#2C1810]">
                    <IndianRupee className="w-3.5 h-3.5 text-[#6F4E37] stroke-[2.5]" />
                    <span>{Number(booking.total || booking.amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </td>

                <td className="px-6 py-4 align-middle">
                  <BookingStatusBadge status={booking.status || booking.booking_status || 'PENDING'} />
                </td>

                <td className="px-6 py-4 align-middle text-right">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/event/bookings/${booking.id}`);
                    }}
                    className="p-2 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/20 transition-all shadow-2xs"
                    title="View Details"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
