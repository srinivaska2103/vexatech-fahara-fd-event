'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPreviewCard({ bookings = [] }) {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  
  // Create a simple calendar for the current week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i + (weekOffset * 7));
    
    // Check if there are any bookings on this date
    const dateStr = d.toDateString();
    const hasEvents = bookings.some(b => new Date(b.date || b.booking_date).toDateString() === dateStr);
    
    return {
      dayName: weekDays[i],
      date: d.getDate(),
      isToday: d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(),
      hasEvents,
      fullDate: d,
    };
  });

  const currentMonthDisplay = dates[0].fullDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-text">Calendar</h3>
        <Link href="/event/calendar" className="p-2 hover:bg-background rounded-lg text-text/50 hover:text-primary transition-colors">
          <CalendarIcon className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-text">{currentMonthDisplay}</span>
        <div className="flex gap-2">
          <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 rounded bg-background border border-border hover:bg-primary/10 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-1 rounded bg-background border border-border hover:bg-primary/10 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dates.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold text-text/50 uppercase">{d.dayName}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold relative ${
              d.isToday ? 'bg-primary text-white shadow-md' : 'text-text hover:bg-background cursor-pointer'
            }`}>
              {d.date}
              {d.hasEvents && !d.isToday && (
                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
