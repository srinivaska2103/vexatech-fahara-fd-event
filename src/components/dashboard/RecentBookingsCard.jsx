'use client';

import Link from 'next/link';
import { MoreHorizontal, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecentBookingsCard({ bookings = [] }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const hasBookings = bookings && bookings.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="relative overflow-hidden bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group select-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Recent Bookings</h3>
          <p className="text-xs text-[#8C6D58] font-medium mt-0.5">Latest transactions & reservations</p>
        </div>
        <Link 
          href="/event/bookings" 
          className="group/link text-xs font-bold text-[#6F4E37] hover:text-[#4A3324] px-3.5 py-1.5 rounded-full bg-[#FFF8F0] border border-[#6F4E37]/20 hover:border-[#6F4E37] transition-all duration-300 flex items-center gap-1.5 shadow-2xs"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Body Content */}
      {!hasBookings ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8F0] to-[#F3E8DC] border border-[#6F4E37]/15 rounded-2xl flex items-center justify-center mb-4 text-[#6F4E37] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <FileText className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-extrabold text-[#2C1810] mb-1">No recent bookings</h4>
          <p className="text-xs text-[#2C1810]/60 max-w-xs leading-relaxed">Your latest client transactions and event bookings will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto relative z-10 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F2EAE1]">
                <th className="pb-3 font-bold text-[#8C6D58] text-[11px] uppercase tracking-wider">Booking ID</th>
                <th className="pb-3 font-bold text-[#8C6D58] text-[11px] uppercase tracking-wider">Customer</th>
                <th className="pb-3 font-bold text-[#8C6D58] text-[11px] uppercase tracking-wider">Date</th>
                <th className="pb-3 font-bold text-[#8C6D58] text-[11px] uppercase tracking-wider">Amount</th>
                <th className="pb-3 font-bold text-[#8C6D58] text-[11px] uppercase tracking-wider">Status</th>
                <th className="pb-3 font-bold text-[#8C6D58] text-[11px] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#F2EAE1]">
              {bookings.map((booking, idx) => {
                const bookingAmount = booking.amount !== undefined 
                  ? Number(booking.amount) 
                  : Number(booking.food_amount || 0) + Number(booking.decoration_amount || 0) + Number(booking.extra_person_amount || 0) - Number(booking.discount || 0);
                
                const dateStr = booking.createdAt || booking.created_at || booking.date || booking.booking_date;
                const dateDisplay = dateStr ? new Date(dateStr).toLocaleDateString() : 'Invalid Date';
                
                return (
                  <tr key={idx} className="hover:bg-[#FFFDF9] transition-colors group/row">
                    <td className="py-3.5 font-mono text-xs font-bold text-[#6F4E37]">{booking.booking_number || booking.id?.substring(0, 8) || 'BKG-001'}</td>
                    <td className="py-3.5 font-extrabold text-[#2C1810]">{booking.customerName || booking.customer_name || 'Anonymous'}</td>
                    <td className="py-3.5 text-[#2C1810]/70 font-medium">{dateDisplay}</td>
                    <td className="py-3.5 font-black text-[#2C1810]">{formatCurrency(bookingAmount)}</td>
                    <td className="py-3.5">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border shadow-2xs ${
                        booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        booking.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-sky-50 text-sky-700 border-sky-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="p-1.5 text-[#2C1810]/40 hover:text-[#6F4E37] rounded-lg transition-colors opacity-0 group-hover/row:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
