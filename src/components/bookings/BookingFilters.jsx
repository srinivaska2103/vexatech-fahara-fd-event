'use client';

import { useBookingFilterStore } from '@/store/bookingFilterStore';
import { Filter, Calendar as CalendarIcon, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { CustomSelect } from '../ui/CustomSelect';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BookingFilters() {
  const { filters, setFilters, resetFilters } = useBookingFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length - 1;

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DDB892] rounded-2xl font-extrabold text-xs text-[#2C1810] hover:bg-[#FFF8F0] shadow-2xs transition-all cursor-pointer"
      >
        <Filter className="w-4 h-4 text-[#6F4E37]" />
        Filters
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#6F4E37] text-white text-xs font-black flex items-center justify-center ml-1">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#DDB892] rounded-3xl shadow-2xl p-5 z-20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-extrabold text-[#2C1810] text-sm">Booking Filters</h3>
            <button type="button" onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-[#6F4E37] cursor-pointer">
              <X className="w-4 h-4"/>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-[#6F4E37] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5"/> Status
              </label>
              <CustomSelect
                options={STATUS_OPTIONS}
                value={filters.status}
                onChange={(val) => setFilters({ status: val })}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs font-black text-[#6F4E37] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                <CalendarIcon className="w-3.5 h-3.5"/> Date
              </label>
              <input 
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ date: e.target.value })}
                className="w-full h-10 px-3.5 text-xs font-bold rounded-2xl border border-[#DDB892]/80 bg-[#FFF8F0] focus:outline-none focus:border-[#6F4E37] text-[#2C1810]"
              />
            </div>

            <button 
              type="button"
              onClick={resetFilters}
              className="w-full mt-2 py-2.5 text-xs font-extrabold text-[#6F4E37] hover:bg-[#FFF5EA] rounded-2xl border border-[#DDB892]/60 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
