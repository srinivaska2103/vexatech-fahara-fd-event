'use client';

import { useState } from 'react';
import { useUpdateBookingStatus } from '@/hooks/bookings/useBookingMutations';
import { ChevronDown } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

export default function BookingStatusDropdown({ booking }) {
  const [isOpen, setIsOpen] = useState(false);
  const updateStatus = useUpdateBookingStatus();

  if (!booking) return null;

  const statuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];

  const handleStatusChange = (newStatus) => {
    if (newStatus !== booking.booking_status) {
      updateStatus.mutate({ id: booking.id, status: newStatus });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 focus:outline-none hover:opacity-80 transition-opacity"
      >
        <BookingStatusBadge status={booking.booking_status} />
        <div className="p-1 rounded-full hover:bg-background transition-colors">
          <ChevronDown className={`w-4 h-4 text-text/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl p-2 z-50 overflow-hidden">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-background transition-colors text-sm font-medium flex items-center justify-between group"
            >
              <span className="capitalize text-text">{s.replace('_', ' ')}</span>
              {booking.status === s && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
