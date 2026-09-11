'use client';

import React from 'react';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { Calendar as CalendarIcon, Layers } from 'lucide-react';
import { CustomSelect } from '../ui/CustomSelect';

const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_year', label: 'This Year' },
  { value: 'all_time', label: 'All Time' },
];

const AnalyticsFilters = ({ services = [] }) => {
  const { filters, setFilters } = useAnalyticsStore();

  const serviceOptions = [
    { value: 'all', label: 'All Services' },
    ...services.map(s => ({
      value: s.id || s._id,
      label: s.title || s.name || s.service_name || s.package_name
    }))
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
      {/* Date Range Dropdown */}
      <CustomSelect
        options={DATE_RANGE_OPTIONS}
        value={filters.dateRange}
        onChange={(val) => setFilters({ dateRange: val })}
        icon={CalendarIcon}
        className="min-w-[150px]"
      />

      {/* Service Selector Dropdown */}
      <CustomSelect
        options={serviceOptions}
        value={filters.serviceId}
        onChange={(val) => setFilters({ serviceId: val })}
        icon={Layers}
        className="min-w-[170px]"
      />
    </div>
  );
};

export default AnalyticsFilters;
