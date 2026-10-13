'use client';

import { useBookingStatusStore } from '@/store/bookingStatusStore';
import { useRejectBooking } from '@/hooks/bookings/useBookingMutations';
import { XCircle, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (at least 10 characters).')
});

export default function RejectBookingModal() {
  const { modals, closeModal } = useBookingStatusStore();
  const rejectMutation = useRejectBooking();
  const { isOpen, bookingId } = modals.reject;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    rejectMutation.mutate({ id: bookingId, reason: data.reason }, {
      onSuccess: () => {
        closeModal('reject');
        reset();
      }
    });
  };

  const handleClose = () => {
    closeModal('reject');
    reset();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <button 
              type="button"
              onClick={handleClose} 
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-black text-[#2C1810] mb-2 tracking-tight">Decline Reservation</h3>
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Please provide a clear reason for declining this booking. A cancellation notification with this reason will be sent to the customer.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-[#6F4E37] uppercase tracking-wider mb-2">Rejection Reason</label>
              <textarea
                {...register('reason')}
                rows={3}
                className={`w-full bg-[#FFFDF9] border rounded-2xl px-4 py-3 text-xs font-semibold text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/15 transition-all resize-none
                  ${errors.reason ? 'border-rose-400 focus:border-rose-500' : 'border-stone-200 focus:border-[#6F4E37]'}
                `}
                placeholder="e.g. Schedule conflict, capacity limit, out of service radius..."
              />
              {errors.reason && <p className="text-rose-600 text-xs font-bold mt-1.5">{errors.reason.message}</p>}
            </div>

            <div className="flex gap-3 w-full pt-1">
              <button 
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-black text-xs rounded-2xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={rejectMutation.isPending}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl transition-all shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {rejectMutation.isPending ? 'Declining...' : 'Confirm Reject'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
