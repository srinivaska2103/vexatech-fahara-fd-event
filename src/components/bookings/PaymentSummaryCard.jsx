import { IndianRupee, FileText } from 'lucide-react';

export default function PaymentSummaryCard({ booking }) {
  if (!booking) return null;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-[60px] -z-10" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center text-green-600 shrink-0 shadow-inner border border-white/10">
          <IndianRupee className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight">Payment Summary</h2>
          <p className="text-sm text-text/60 mt-0.5">Pricing and payment status</p>
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col justify-between space-y-6">
        <div className="space-y-4 bg-background/50 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-sm font-medium text-text/70">Base Package Amount</span>
            <span className="font-semibold text-text">₹{Number(booking.cafe_amount || booking.event_service_amount || booking.subtotal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-base font-bold text-text">Total Amount</span>
            <span className="text-lg font-bold text-primary">₹{Number(booking.cafe_amount || booking.event_service_amount || booking.subtotal || 0).toLocaleString()}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-2">Payment Status</p>
          {booking.payment_status?.toLowerCase() === 'paid' ? (
            <div className="flex items-center justify-center gap-2 bg-green-500/10 text-green-700 py-3 rounded-xl border border-green-500/20 font-bold">
              <CheckCircle className="w-4 h-4" /> Paid in Full
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-700 py-3 rounded-xl border border-yellow-500/20 font-bold">
              <Clock className="w-4 h-4" /> Pending Payment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ensure icons used inside conditional are imported if not at top level
import { CheckCircle, Clock } from 'lucide-react';
