'use client';

import { useState } from 'react';
import CalendarToolbar from '@/components/calendar/CalendarToolbar';
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar';
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';
import DailySchedule from '@/components/calendar/DailySchedule';
import CalendarLegend from '@/components/calendar/CalendarLegend';
import AvailabilitySummaryCards from '@/components/calendar/AvailabilitySummaryCards';
import AvailabilityBlockModal from '@/components/calendar/AvailabilityBlockModal';
import BlockedDatesCard from '@/components/calendar/BlockedDatesCard';
import { useCalendarStore } from '@/store/useCalendarStore';
import { 
  useEventManagerAvailability, 
  useEventManagerSummary, 
  useCalendarEvents 
} from '@/hooks/calendar/useCalendarQueries';
import { 
  Loader2, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Plus, 
  Package, 
  Coffee, 
  LayoutList 
} from 'lucide-react';
import { format } from 'date-fns';

export default function CalendarPage() {
  const { view, filters, selectedDate, openCreateBlockModal } = useCalendarStore();
  
  const { data: availabilityData, isLoading: isAvailLoading, error: availError } = useEventManagerAvailability();
  const { data: summary, isLoading: isSummaryLoading } = useEventManagerSummary();
  const { data: events, isLoading: isEventsLoading } = useCalendarEvents(filters);

  const isLoading = isAvailLoading || isEventsLoading;
  const services = availabilityData?.services || [];
  const venues = availabilityData?.venues || [];

  return (
    <div className="space-y-6 sm:space-y-8 select-none pb-12">
      
      {/* Top Banner Header with fahra palette */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E50914]/15 via-[#B71C1C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF5F5] text-[#E50914] border border-[#E50914]/20 uppercase tracking-widest flex items-center gap-1 shadow-2xs">
              <CalendarIcon className="w-3 h-3" />
              Event Operations Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
            Event Manager Availability Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] font-semibold mt-1 max-w-xl">
            Schedule private events, configure buffers, manage capacity limits, coordinate with cafes & venues, and eliminate double bookings.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={() => openCreateBlockModal()}
            className="px-5 py-3 bg-[#E50914] hover:bg-[#252525] text-white text-xs font-black rounded-2xl transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Block
          </button>
        </div>
      </div>

      {/* KPI Summary Cards & Quick Action Ribbon */}
      <AvailabilitySummaryCards summary={summary} />

      {/* Legend & Filter Controls */}
      <CalendarLegend />

      {/* Toolbar Controls */}
      <CalendarToolbar />

      {/* Main View Container */}
      <div className="min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="bg-white border border-[#FEE2E2] rounded-3xl py-24 flex flex-col items-center justify-center text-[#757575] gap-3 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#E50914]" />
            <p className="text-xs font-black text-[#252525]">Loading availability calendar & bookings...</p>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col space-y-6">
            {view === 'month' && (
              <>
                <MonthlyCalendar events={events || []} />
                
                {/* On Mobile & Desktop: Selected Day Event Schedule Below Month Grid */}
                <div className="pt-2">
                  <DailySchedule events={events || []} />
                </div>
              </>
            )}

            {view === 'week' && <WeeklyCalendar events={events || []} />}
            
            {(view === 'day' || view === 'agenda') && <DailySchedule events={events || []} />}
          </div>
        )}
      </div>

      {/* Quick Blocked Dates List */}
      <BlockedDatesCard />

      {/* Modal for Creating & Editing Availability Blocks */}
      <AvailabilityBlockModal services={services} venues={venues} />

    </div>
  );
}
