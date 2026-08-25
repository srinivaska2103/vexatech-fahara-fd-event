'use client';

import { useStaffStore } from '@/store/useStaffStore';
import { useStaffList } from '@/hooks/calendar/useCalendarQueries';
import { Loader2, Calendar as CalendarIcon, Filter, Search } from 'lucide-react';
import Link from 'next/link';

export default function StaffSchedulePage() {
  const { filters, searchQuery, setSearchQuery } = useStaffStore();
  const { data: staffList, isLoading, error } = useStaffList(filters);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-background">
      <div className="bg-surface border-b border-border p-4 lg:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-text">Staff Scheduling & Availability</h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/50" />
            <input 
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <Link 
            href="/event/calendar"
            className="flex items-center gap-2 px-4 py-2 bg-background hover:bg-surface border border-border rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Back to Calendar</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-text/50 gap-4 h-full">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-semibold">Loading staff schedules...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-500 h-full">
            <p className="font-semibold">Failed to load staff list.</p>
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-text/50 gap-4 h-full bg-surface border border-border rounded-2xl">
            <CalendarIcon className="w-16 h-16 opacity-20" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-text mb-2">No Staff Available</h3>
              <p className="text-sm">There are currently no staff members found matching your criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Staff list would render here */}
            {staffList.map(staff => (
              <div key={staff.id} className="bg-surface p-4 rounded-xl border border-border">
                {staff.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
