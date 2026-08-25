'use client';

import React from 'react';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { Calendar as CalendarIcon, Filter, X, SlidersHorizontal, Layers } from 'lucide-react';

const AnalyticsFilters = ({ services = [] }) => {
  const { filters, setFilters, clearFilters } = useAnalyticsStore();

  const handleDateRangeChange = (e) => {
    setFilters({ dateRange: e.target.value });
  };

  const hasActiveFilters = filters.dateRange !== 'this_month' || filters.serviceId !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#FFFDF9] p-2 rounded-2xl border border-[#E8DED5] shadow-2xs font-sans text-xs">
      
      {/* Date Range Dropdown */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E8DED5] text-[#2C1810] font-extrabold shadow-2xs">
        <CalendarIcon className="w-3.5 h-3.5 text-[#8C6D58]" />
        <select 
          value={filters.dateRange}
          onChange={handleDateRangeChange}
          className="bg-transparent text-xs font-black text-[#2C1810] focus:outline-none cursor-pointer"
        >
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      {/* Service Selector Dropdown */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#E8DED5] text-[#2C1810] font-extrabold shadow-2xs">
        <Layers className="w-3.5 h-3.5 text-[#8C6D58]" />
        <select 
          value={filters.serviceId}
          onChange={(e) => setFilters({ serviceId: e.target.value })}
          className="bg-transparent text-xs font-black text-[#2C1810] focus:outline-none cursor-pointer"
        >
          <option value="all">All Services</option>
          {services.map(s => (
            <option key={s.id || s._id} value={s.id || s._id}>
              {s.title || s.name || s.service_name || s.package_name}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters CTA */}
      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl hover:bg-rose-100 transition-colors active:scale-95"
        >
          <X className="w-3.5 h-3.5 stroke-[3]" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default AnalyticsFilters;
