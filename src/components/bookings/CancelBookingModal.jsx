'use client';

import { useBookingStatusStore } from '@/store/bookingStatusStore';
import { useCancelBooking } from '@/hooks/bookings/useBookingMutations';
import { AlertTriangle, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (at least 10 characters).')
});

export default function CancelBookingModal() {
  const { modals, closeModal } = useBookingStatusStore();
  const cancelMutation = useCancelBooking();
  const { isOpen, bookingId } = modals.cancel;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    cancelMutation.mutate({ id: bookingId, reason: data.reason }, {
      onSuccess: () => {
        closeModal('cancel');
        reset();
      }
    });
  };

  const handleClose = () => {
    closeModal('cancel');
    reset();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] -z-10" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button onClick={handleClose} className="text-text/40 hover:text-text transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-text mb-2">Cancel Booking</h3>
          <p className="text-sm text-text/60 leading-relaxed mb-6">
            Are you sure you want to cancel this booking? This action cannot be undone, and the customer will be notified immediately.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wider">Cancellation Reason</label>
              <textarea
                {...register('reason')}
                rows={4}
                className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none
                  ${errors.reason ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'}
                `}
                placeholder="Reason for cancellation..."
              />
              {errors.reason && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.reason.message}</p>}
            </div>

            <div className="flex gap-3 w-full">
              <button 
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 bg-background hover:bg-surface border border-border text-text font-bold rounded-xl transition-colors"
              >
                Go Back
              </button>
              <button 
                type="submit"
                disabled={cancelMutation.isPending}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
