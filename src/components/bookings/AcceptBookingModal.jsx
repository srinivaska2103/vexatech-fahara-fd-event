'use client';

import { useBookingStatusStore } from '@/store/bookingStatusStore';
import { useAcceptBooking } from '@/hooks/bookings/useBookingMutations';
import { CheckCircle2, X } from 'lucide-react';

export default function AcceptBookingModal() {
  const { modals, closeModal } = useBookingStatusStore();
  const acceptMutation = useAcceptBooking();
  const { isOpen, bookingId } = modals.accept;

  if (!isOpen) return null;

  const handleAccept = () => {
    acceptMutation.mutate(bookingId, {
      onSuccess: () => closeModal('accept')
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button 
              type="button"
              onClick={() => closeModal('accept')} 
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-black text-[#252525] mb-2 tracking-tight">Accept & Confirm Reservation</h3>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Accepting this booking will update the status to <strong className="text-emerald-700">Confirmed</strong>. Instant confirmation emails will be automatically sent to the <strong>customer</strong> and the <strong>respected cafe venue</strong>.
            </p>
          </div>

          <div className="flex gap-3 w-full pt-2">
            <button 
              type="button"
              onClick={() => closeModal('accept')}
              className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-black text-xs rounded-2xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl transition-all shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {acceptMutation.isPending ? 'Confirming...' : 'Yes, Accept Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
