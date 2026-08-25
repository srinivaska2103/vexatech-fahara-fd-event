'use client';

import { useBookingStatusStore } from '@/store/bookingStatusStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useUpdateBookingStatus } from '@/hooks/bookings/useBookingMutations';
import { Check, X, Calendar, UserPlus, Users, PlayCircle, CheckCircle } from 'lucide-react';

export default function BookingActions({ booking }) {
  const statusStore = useBookingStatusStore();
  const assignmentStore = useAssignmentStore();
  const updateStatus = useUpdateBookingStatus();

  if (!booking) return null;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <h2 className="text-xl font-bold text-text tracking-tight mb-6">Booking Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
        {/* Pending Actions */}
        {booking.status === 'pending' && (
          <>
            <button 
              onClick={() => statusStore.openModal('accept', booking.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Check className="w-5 h-5" /> Accept Booking
            </button>
            <button 
              onClick={() => statusStore.openModal('reject', booking.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-all"
            >
              <X className="w-5 h-5" /> Reject Booking
            </button>
          </>
        )}

        {/* Post-Acceptance Actions */}
        {['accepted', 'assigned'].includes(booking.status) && (
          <>
            <button 
              onClick={() => assignmentStore.openModal('assignStaff', booking.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Users className="w-5 h-5" /> Assign Staff
            </button>
            <button 
              onClick={() => assignmentStore.openModal('assignLeader', booking.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all"
            >
              <UserPlus className="w-5 h-5" /> Assign Team Leader
            </button>
            <button 
              onClick={() => updateStatus.mutate({ id: booking.id, status: 'in_progress' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-2"
            >
              <PlayCircle className="w-5 h-5" /> Mark In Progress
            </button>
          </>
        )}

        {/* In Progress Actions */}
        {booking.status === 'in_progress' && (
          <button 
            onClick={() => updateStatus.mutate({ id: booking.id, status: 'completed' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <CheckCircle className="w-5 h-5" /> Mark Completed
          </button>
        )}

        {/* General Actions */}
        {!['cancelled', 'rejected', 'completed'].includes(booking.status) && (
          <>
            <hr className="my-2 border-border/50" />
            <button 
              onClick={() => statusStore.openModal('reschedule', booking.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border hover:bg-background text-text font-bold rounded-xl transition-all"
            >
              <Calendar className="w-5 h-5 text-primary" /> Reschedule
            </button>
            <button 
              onClick={() => statusStore.openModal('cancel', booking.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all"
            >
              <X className="w-5 h-5" /> Cancel Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
}
