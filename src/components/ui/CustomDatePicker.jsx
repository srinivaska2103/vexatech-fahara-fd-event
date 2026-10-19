'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO, 
  isValid 
} from 'date-fns';

export default function CustomDatePicker({
  value,
  onChange,
  label = 'Select Date',
  minDate = null,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedDate = value && isValid(new Date(value)) ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(selectedDate);

  useEffect(() => {
    if (value && isValid(new Date(value))) {
      setViewDate(new Date(value));
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handleSelect = (d) => {
    onChange(format(d, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange(format(today, 'yyyy-MM-dd'));
    setViewDate(today);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-[#FFFDF9] border transition-all duration-200 rounded-2xl px-3.5 py-2.5 text-left flex items-center justify-between gap-2 shadow-xs group ${
          isOpen
            ? 'border-[#6F4E37] ring-2 ring-[#6F4E37]/15 shadow-sm'
            : 'border-[#E8DED5] hover:border-[#DDB892] hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isOpen ? 'bg-[#6F4E37] text-white' : 'bg-[#FFF8F0] text-[#6F4E37]'
          }`}>
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#2C1810] truncate">
            {value ? format(new Date(value), 'EEE, dd MMM yyyy') : label}
          </span>
        </div>
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 bg-white border border-[#E8DED5] rounded-3xl p-4 shadow-2xl w-72 animate-in fade-in zoom-in-95 duration-150">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-[#2C1810]">
              {format(viewDate, 'MMMM yyyy')}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-[#8C6D58] hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-[#8C6D58] hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <span key={d} className="text-[10px] font-black text-[#8C6D58] py-0.5">
                {d}
              </span>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, idx) => {
              const isSelected = value && isSameDay(d, new Date(value));
              const isCurrentMonth = isSameMonth(d, viewDate);
              const isToday = isSameDay(d, new Date());

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(d)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#6F4E37] text-white shadow-xs font-black scale-105'
                      : isToday
                      ? 'bg-[#FFF8F0] text-[#6F4E37] border border-[#6F4E37]/30 hover:bg-[#6F4E37] hover:text-white'
                      : isCurrentMonth
                      ? 'text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                      : 'text-[#8C6D58]/35 hover:bg-[#FFF8F0]/50'
                  }`}
                >
                  {format(d, 'd')}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="mt-3 pt-2.5 border-t border-[#F0E6DE] flex items-center justify-between">
            <button
              type="button"
              onClick={handleToday}
              className="text-[11px] font-black text-[#6F4E37] hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#8C6D58] hover:text-[#2C1810]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
