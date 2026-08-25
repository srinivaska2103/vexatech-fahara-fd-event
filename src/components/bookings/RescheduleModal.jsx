'use client';

import { useBookingStatusStore } from '@/store/bookingStatusStore';
import { useRescheduleBooking } from '@/hooks/bookings/useBookingMutations';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  newDate: z.string().min(1, 'Please select a new date.'),
  newTime: z.string().min(1, 'Please select a new time.')
});

export default function RescheduleModal() {
  const { modals, closeModal } = useBookingStatusStore();
  const rescheduleMutation = useRescheduleBooking();
  const { isOpen, bookingId } = modals.reschedule;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    rescheduleMutation.mutate({ id: bookingId, newDate: data.newDate, newTime: data.newTime }, {
      onSuccess: () => {
        closeModal('reschedule');
        reset();
      }
    });
  };

  const handleClose = () => {
    closeModal('reschedule');
    reset();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <button onClick={handleClose} className="text-text/40 hover:text-text transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-text mb-2">Reschedule Booking</h3>
          <p className="text-sm text-text/60 leading-relaxed mb-6">
            Select a new date and time for this event. The customer will be notified of these changes.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wider">New Date</label>
                <input
                  type="date"
                  {...register('newDate')}
                  className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all
                    ${errors.newDate ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'}
                  `}
                />
                {errors.newDate && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.newDate.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wider">New Time</label>
                <input
                  type="time"
                  {...register('newTime')}
                  className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all
                    ${errors.newTime ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'}
                  `}
                />
                {errors.newTime && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.newTime.message}</p>}
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 bg-background hover:bg-surface border border-border text-text font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={rescheduleMutation.isPending}
                className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
