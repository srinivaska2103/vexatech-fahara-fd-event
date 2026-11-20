import { User, Phone, Mail, Copy, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerInformationCard({ booking }) {
  if (!booking) return null;

  const name = booking.customer_name || booking.users?.name || 'Guest Customer';
  const phone = booking.customer_phone || booking.users?.phone_number || booking.users?.phone || '';
  const email = booking.customer_email || booking.users?.email || '';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-7 shadow-xs hover:shadow-sm transition-all space-y-6 relative overflow-hidden text-[#252525]">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#B71C1C] text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#E50914]/20 shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#252525] tracking-tight">{name}</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck size={11} /> Verified Customer
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">Customer contact details & identity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5]/70 border border-[#EF5350]/40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <Mail size={12} /> Email Address
            </span>
            <p className="text-xs font-black text-[#252525] truncate">{email || 'Not Provided'}</p>
          </div>
          {email && (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(email);
                toast.success('Email copied to clipboard!');
              }}
              className="p-1.5 rounded-xl bg-white border border-stone-200 hover:bg-[#E50914] text-stone-500 hover:text-white transition-all shadow-2xs cursor-pointer shrink-0"
              title="Copy Email"
            >
              <Copy size={13} />
            </button>
          )}
        </div>

        {/* Phone */}
        <div className="p-3.5 rounded-2xl bg-[#FFF5F5]/70 border border-[#EF5350]/40 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
              <Phone size={12} /> Phone Number
            </span>
            <p className="text-xs font-black text-[#252525] truncate">{phone || 'Not Provided'}</p>
          </div>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="p-1.5 rounded-xl bg-[#E50914] text-white hover:bg-[#B71C1C] transition-all shadow-2xs cursor-pointer shrink-0"
              title="Call Customer"
            >
              <Phone size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
