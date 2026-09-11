'use client';

import { Check, X, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUpdateBookingStatus } from '@/hooks/bookings/useBookingQueries';
import toast from 'react-hot-toast';

export default function PendingRequestsCard({ requests = [] }) {
  const updateStatusMutation = useUpdateBookingStatus();
  const hasRequests = requests && requests.length > 0;

  const handleStatusUpdate = (id, newStatus) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || `Failed to update status`);
        }
      }
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date TBD';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      if (timeStr.includes('T')) {
        return new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
      }
      const [h, m] = timeStr.split(':');
      const d = new Date();
      d.setHours(h, m);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
      return timeStr;
    }
  };

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
          {requests.map((request, idx) => {
            const customerName = request.customerName || request.customer_name || request.users?.name || request.user?.name || 'Customer Request';
            const rawDate = request.date || request.booking_date || request.createdAt;
            const rawTime = request.startTime || request.start_time;
            const timeFormatted = formatTime(rawTime);
            const dateFormatted = formatDate(rawDate);
            const note = request.event_special_request || request.special_request || request.special_requests || request.specialRequests;

            return (
              <div key={request.id || idx} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE1] hover:border-[#6F4E37]/30 hover:bg-white hover:shadow-md transition-all duration-300">
                <div>
                  <h4 className="font-extrabold text-sm text-[#2C1810]">{customerName}</h4>
                  <p className="text-xs text-[#2C1810]/60 font-medium mt-0.5 flex items-center gap-1.5">
                    <span>Requested for <strong className="text-[#6F4E37] font-bold">{dateFormatted}</strong></span>
                    {timeFormatted && (
                      <span className="flex items-center gap-1">
                        • <Clock className="w-3 h-3 text-[#6F4E37]" /> {timeFormatted}
                      </span>
                    )}
                  </p>
                  {note && (
                    <p className="text-xs mt-2 text-[#6F4E37] bg-[#FFF8F0] px-3 py-1.5 rounded-xl border border-[#6F4E37]/15 inline-block font-medium">
                      "{note}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => handleStatusUpdate(request.id, 'CONFIRMED')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 border border-emerald-200 shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" /> Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 border border-rose-200 shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" /> Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

