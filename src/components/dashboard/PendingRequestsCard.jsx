'use client';

import { Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PendingRequestsCard({ requests = [] }) {
  const hasRequests = requests && requests.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative overflow-hidden bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group select-none"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Pending Requests</h3>
          <p className="text-xs text-[#8C6D58] font-medium mt-0.5">Booking approvals awaiting action</p>
        </div>
        <Link 
          href="/event/bookings?tab=pending" 
          className="group/link text-xs font-bold text-[#6F4E37] hover:text-[#4A3324] px-3.5 py-1.5 rounded-full bg-[#FFF8F0] border border-[#6F4E37]/20 hover:border-[#6F4E37] transition-all duration-300 flex items-center gap-1.5 shadow-2xs"
        >
          <span>Review All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Body Content */}
      {!hasRequests ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 sm:p-10 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFF8F0] to-[#F3E8DC] border border-[#6F4E37]/15 rounded-2xl flex items-center justify-center mb-4 text-[#6F4E37] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <AlertCircle className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-extrabold text-[#2C1810] mb-1">You're all caught up!</h4>
          <p className="text-xs text-[#2C1810]/60 max-w-xs leading-relaxed">No pending booking requests to review right now.</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 relative z-10">
          {requests.map((request, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE1] hover:border-[#6F4E37]/30 hover:bg-white hover:shadow-md transition-all duration-300">
              <div>
                <h4 className="font-extrabold text-sm text-[#2C1810]">{request.customer_name || 'New Customer'}</h4>
                <p className="text-xs text-[#2C1810]/60 font-medium mt-0.5">
                  Requested for {new Date(request.booking_date).toLocaleDateString()} at {request.start_time}
                </p>
                {request.special_request && (
                  <p className="text-xs mt-2 text-[#6F4E37] bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#6F4E37]/15 inline-block font-medium">
                    "{request.special_request}"
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 border border-emerald-200 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[2.5]" /> Accept
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 border border-rose-200 shadow-2xs">
                  <X className="w-4 h-4 stroke-[2.5]" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
