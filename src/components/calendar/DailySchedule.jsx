'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import { format, isSameDay } from 'date-fns';
import { 
  ShieldAlert, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Calendar as CalendarIcon, 
  Edit2 
} from 'lucide-react';

export default function DailySchedule({ events = [] }) {
  const { selectedDate, openCreateBlockModal, openEditBlockModal, filters } = useCalendarStore();
  const dateToDisplay = selectedDate || new Date();
  const dayDateStr = format(dateToDisplay, 'yyyy-MM-dd');

  const filteredEvents = events.filter(e => {
    let isMatchingDay = false;
    if (e.date && e.endDate) {
      isMatchingDay = dayDateStr >= e.date && dayDateStr <= e.endDate;
    } else if (e.date) {
      isMatchingDay = e.date === dayDateStr;
    } else if (e.startTime) {
      const sStr = format(new Date(e.startTime), 'yyyy-MM-dd');
      const eStr = e.endTime ? format(new Date(e.endTime), 'yyyy-MM-dd') : sStr;
      isMatchingDay = dayDateStr >= sStr && dayDateStr <= eStr;
    }
    if (!isMatchingDay) return false;

    if (!filters.status || filters.status === 'all') return true;
    const filterUpper = filters.status.toUpperCase();
    if (filterUpper === 'BLOCKED') return e.type === 'BLOCK';
    if (filterUpper === 'CONFIRMED') return e.type === 'BOOKING' && (e.status === 'CONFIRMED' || e.status === 'ACCEPTED');
    if (filterUpper === 'PENDING') return e.type === 'BOOKING' && e.status === 'PENDING';
    if (filterUpper === 'PRIVATE') return e.type === 'BLOCK' && e.reason === 'PRIVATE_EVENT';
    if (filterUpper === 'CANCELLED') return e.status === 'CANCELLED';
    return true;
  });

  const blocks = filteredEvents.filter(e => e.type === 'BLOCK');
  const bookings = filteredEvents.filter(e => e.type === 'BOOKING');

  return (
    <div className="flex-1 flex flex-col w-full bg-white border border-[#FEE2E2] rounded-3xl overflow-hidden shadow-xs p-5 sm:p-7">
      
      {/* Day Schedule Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#FEE2E2] gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF5F5] text-[#E50914] border border-[#E50914]/20 uppercase tracking-widest flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              Day Timeline
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Schedule for {format(dateToDisplay, 'EEEE, MMMM d, yyyy')}
          </h3>
          <p className="text-xs text-[#757575] font-semibold mt-0.5">
            {filteredEvents.length} total event(s) and block(s) scheduled for this day
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateBlockModal(dateToDisplay)}
          className="px-4 py-2.5 bg-[#E50914] hover:bg-[#252525] text-white text-xs font-black rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          Add Block for Today
        </button>
      </div>

      {/* Main Schedule Content */}
      {filteredEvents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center bg-[#FFFDF9] border border-[#FEE2E2] border-dashed rounded-3xl p-6">
          <div className="w-14 h-14 rounded-3xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mb-3 border border-[#E50914]/15">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-[#252525]">No Events or Blocks Scheduled</h4>
          <p className="text-xs text-[#757575] font-semibold mt-1 max-w-sm">
            This date is fully open for customer bookings and venue coordination.
          </p>
          <button
            type="button"
            onClick={() => openCreateBlockModal(dateToDisplay)}
            className="mt-4 px-4 py-2 bg-[#FFF5F5] text-[#E50914] border border-[#E50914]/25 hover:bg-[#E50914] hover:text-white rounded-2xl text-xs font-black transition-all"
          >
            Lock Out Time Slot
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Availability Blocks */}
          {blocks.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#757575] mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Active Availability Blocks ({blocks.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {blocks.map((blockEvt, i) => {
                  const b = blockEvt.block;
                  return (
                    <div 
                      key={i} 
                      className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl hover:border-rose-300 transition-all shadow-2xs group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                            <h5 className="text-sm font-black text-[#252525]">{blockEvt.title}</h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEditBlockModal(b)}
                            className="p-1.5 text-[#757575] hover:text-[#E50914] hover:bg-white rounded-xl transition-colors"
                            title="Edit Block"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#757575] font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {blockEvt.isAllDay ? 'All-Day Block' : `${format(new Date(blockEvt.startTime), 'hh:mm a')} – ${format(new Date(blockEvt.endTime), 'hh:mm a')}`}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-rose-200 text-[10px] font-black text-rose-800">
                            {blockEvt.reason || 'UNAVAILABLE'}
                          </span>
                          {blockEvt.venueName && (
                            <span className="flex items-center gap-1 text-[#252525]">
                              <MapPin className="w-3 h-3 text-[#E50914]" />
                              {blockEvt.venueName}
                            </span>
                          )}
                        </div>
                        {b?.notes && (
                          <p className="text-xs text-[#252525]/70 mt-2 bg-white/70 p-2 rounded-xl border border-rose-100 font-medium">
                            {b.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scheduled Customer Bookings */}
          {bookings.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#757575] mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Scheduled Customer Bookings ({bookings.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {bookings.map((bookingEvt, i) => {
                  const b = bookingEvt.booking;
                  const isConfirmed = bookingEvt.status === 'CONFIRMED' || bookingEvt.status === 'ACCEPTED';
                  return (
                    <div 
                      key={i} 
                      className={`p-4 rounded-2xl border transition-all shadow-2xs ${
                        isConfirmed 
                          ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300' 
                          : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConfirmed ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                            <h5 className="text-sm font-black text-[#252525]">{bookingEvt.title}</h5>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border mt-1 inline-block ${
                            isConfirmed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {bookingEvt.status}
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#E50914]">
                          {bookingEvt.totalPersons} Guests
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-[#757575] font-bold mt-2">
                        {bookingEvt.customerName && (
                          <div className="flex items-center gap-1.5 text-[#252525]">
                            <User className="w-3.5 h-3.5 text-[#E50914]" />
                            <span>{bookingEvt.customerName}</span>
                            {bookingEvt.customerPhone && (
                              <span className="text-[#757575]">({bookingEvt.customerPhone})</span>
                            )}
                          </div>
                        )}
                        {bookingEvt.venueName && (
                          <div className="flex items-center gap-1.5 text-[#252525]">
                            <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                            <span>Venue: {bookingEvt.venueName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
