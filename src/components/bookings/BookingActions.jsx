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

  const currentStatus = String(booking.booking_status || booking.status || 'PENDING').toUpperCase();

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-7 shadow-xs space-y-5 text-[#252525]">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base font-black text-[#252525] tracking-tight">Booking Actions</h2>
          <p className="text-xs text-stone-500 font-medium">Manage confirmation & fulfillment</p>
        </div>
        <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
          {currentStatus}
        </span>
      </div>
      
      <div className="space-y-3">
        {/* Pending Actions */}
        {currentStatus === 'PENDING' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={() => statusStore.openModal('accept', booking.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" /> Accept Booking
            </button>
            <button 
              type="button"
              onClick={() => statusStore.openModal('reject', booking.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs rounded-2xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" /> Reject Booking
            </button>
          </div>
        )}

        {/* Post-Acceptance Actions */}
        {['CONFIRMED', 'ACCEPTED', 'ASSIGNED'].includes(currentStatus) && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-bold">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Booking is confirmed! Customer & venue have been notified.</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button 
                type="button"
                onClick={() => assignmentStore.openModal('assignStaff', booking.id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF5F5] hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#EF5350]/60 font-black text-xs rounded-2xl transition-all cursor-pointer"
              >
                <Users className="w-4 h-4" /> Assign Staff
              </button>
              <button 
                type="button"
                onClick={() => assignmentStore.openModal('assignLeader', booking.id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF5F5] hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#EF5350]/60 font-black text-xs rounded-2xl transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Assign Leader
              </button>
            </div>
            <button 
              type="button"
              onClick={() => updateStatus.mutate({ id: booking.id, status: 'IN_PROGRESS' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E50914] hover:bg-[#5C3D2E] text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" /> Mark In Progress
            </button>
          </div>
        )}

        {/* In Progress Actions */}
        {currentStatus === 'IN_PROGRESS' && (
          <button 
            type="button"
            onClick={() => updateStatus.mutate({ id: booking.id, status: 'COMPLETED' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" /> Mark Completed
          </button>
        )}

        {/* General Actions */}
        {!['CANCELLED', 'REJECTED', 'COMPLETED'].includes(currentStatus) && (
          <div className="pt-2 border-t border-stone-100 flex items-center gap-2.5">
            <button 
              type="button"
              onClick={() => statusStore.openModal('reschedule', booking.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E50914]" /> Reschedule
            </button>
            <button 
              type="button"
              onClick={() => statusStore.openModal('cancel', booking.id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
