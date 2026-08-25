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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -z-10" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <button onClick={() => closeModal('accept')} className="text-text/40 hover:text-text transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-text mb-2">Accept Booking?</h3>
          <p className="text-sm text-text/60 leading-relaxed mb-8">
            You are about to accept this booking. This will notify the customer and move the booking to the "Accepted" status, allowing you to assign staff and prepare for the event.
          </p>

          <div className="flex gap-3 w-full">
            <button 
              onClick={() => closeModal('accept')}
              className="flex-1 py-3 bg-background hover:bg-surface border border-border text-text font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {acceptMutation.isPending ? 'Accepting...' : 'Yes, Accept'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
