'use client';

import { useBookingFilterStore } from '@/store/bookingFilterStore';
import { Search } from 'lucide-react';

export default function BookingSearch() {
  const { searchQuery, setSearchQuery } = useBookingFilterStore();

  return (
    <div className="relative w-full md:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-text/40" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm transition-all"
        placeholder="Search by ID, Customer Name, Service..."
      />
    </div>
  );
}
