import { User, Phone, Mail } from 'lucide-react';

export default function CustomerInformationCard({ booking }) {
  if (!booking) return null;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -z-10" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight">Customer Information</h2>
          <p className="text-sm text-text/60 mt-0.5">Contact details and identity</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1">Full Name</p>
          <p className="font-bold text-text bg-background/50 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
            {booking.customer_name || booking.users?.name || 'Guest User'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</p>
            <p className="font-semibold text-text/80 bg-background/50 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
              {booking.customer_phone || booking.users?.phone_number || booking.users?.phone || 'Not Provided'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-text/50 uppercase tracking-wider mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</p>
            <p className="font-semibold text-text/80 bg-background/50 px-4 py-2.5 rounded-xl border border-white/5 backdrop-blur-sm break-all">
              {booking.customer_email || booking.users?.email || 'Not Provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
