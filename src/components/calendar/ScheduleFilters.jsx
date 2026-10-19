'use client';

import { useCalendarStore } from '@/store/useCalendarStore';
import CustomSelect from '@/components/ui/CustomSelect';
import { Filter } from 'lucide-react';

export default function ScheduleFilters() {
  const { filters, setFilters } = useCalendarStore();

  const filterOptions = [
    { value: 'all', label: 'All Services', sublabel: 'View all schedules' },
    { value: 'photography', label: 'Photography', sublabel: 'Photo sessions & shoots' },
    { value: 'catering', label: 'Catering', sublabel: 'Food & beverage events' },
  ];

  return (
    <div className="flex items-center gap-2">
      <CustomSelect
        value={filters.service || 'all'}
        onChange={(val) => setFilters({ service: val })}
        options={filterOptions}
        icon={Filter}
        className="w-56"
      />
    </div>
  );
}
