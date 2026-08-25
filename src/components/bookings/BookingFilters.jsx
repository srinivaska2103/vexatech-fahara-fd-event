'use client';

import { useBookingFilterStore } from '@/store/bookingFilterStore';
import { Filter, Calendar as CalendarIcon, Tag, DollarSign, X } from 'lucide-react';
import { useState } from 'react';

export default function BookingFilters() {
  const { filters, setFilters, resetFilters } = useBookingFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length - 1; // excluding priceRange default for simple count

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl font-semibold text-sm text-text hover:bg-background transition-colors"
      >
        <Filter className="w-4 h-4 text-primary" />
        Filters
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center ml-1">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-2xl shadow-xl p-5 z-20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <h3 className="font-bold text-text">Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-text/50 hover:text-text"><X className="w-4 h-4"/></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text/70 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3 h-3"/> Status
              </label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({ status: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text/70 mb-1.5 flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3"/> Date
              </label>
              <input 
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ date: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
              />
            </div>

            <button 
              onClick={resetFilters}
              className="w-full mt-2 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
