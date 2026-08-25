'use client';

import CalendarToolbar from '@/components/calendar/CalendarToolbar';
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar';
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar';
import DailySchedule from '@/components/calendar/DailySchedule';
import { useCalendarStore } from '@/store/useCalendarStore';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarQueries';
import { Loader2, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarPage() {
  const { view, filters } = useCalendarStore();
  const { data: events, isLoading, error } = useCalendarEvents(filters);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#6F4E37]/20 uppercase tracking-widest flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              Interactive Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">Event Calendar</h1>
          <p className="text-xs sm:text-sm text-[#8C6D58] font-semibold mt-1">Track upcoming hall bookings, vendor slots, and event dates.</p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <CalendarToolbar />

      {/* Main View Container */}
      <div className="min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="bg-white border border-[#E8DED5] rounded-3xl py-24 flex flex-col items-center justify-center text-[#8C6D58] gap-3 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
            <p className="text-xs font-black text-[#2C1810]">Loading event schedule...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-black text-rose-700">Failed to load calendar events.</p>
            <p className="text-xs text-rose-600/80 mt-1 font-semibold">Please check your server connection.</p>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col">
            {view === 'month' && <MonthlyCalendar events={events || []} />}
            {view === 'week' && <WeeklyCalendar events={events || []} />}
            {(view === 'day' || view === 'agenda') && <DailySchedule events={events || []} />}
          </div>
        )}
      </div>

    </div>
  );
}
