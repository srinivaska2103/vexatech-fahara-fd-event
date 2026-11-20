'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CustomTimePicker({
  value = '09:00',
  onChange,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Parse HH:mm
  const [hours, minutes] = (value || '09:00').split(':');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHourSelect = (h) => {
    const formattedHour = String(h).padStart(2, '0');
    onChange(`${formattedHour}:${minutes || '00'}`);
  };

  const handleMinuteSelect = (m) => {
    const formattedMinute = String(m).padStart(2, '0');
    onChange(`${hours || '09'}:${formattedMinute}`);
  };

  // Generate 24 hours
  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  // Generate 15-minute intervals
  const minuteOptions = ['00', '15', '30', '45'];

  // Format 12-hour display for trigger
  const hourNum = parseInt(hours || '9', 10);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const display12Hour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  const displayTime = `${display12Hour}:${minutes || '00'} ${period} (${hours}:${minutes})`;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-[#FFFDF9] border transition-all duration-200 rounded-2xl px-3.5 py-2.5 text-left flex items-center justify-between gap-2 shadow-xs group ${
          isOpen
            ? 'border-[#E50914] ring-2 ring-[#E50914]/15 shadow-sm'
            : 'border-[#FEE2E2] hover:border-[#EF5350] hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isOpen ? 'bg-[#E50914] text-white' : 'bg-[#FFF5F5] text-[#E50914]'
          }`}>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#252525] truncate">
            {displayTime}
          </span>
        </div>
      </button>

      {/* Popover Time Wheel Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 bg-white border border-[#FEE2E2] rounded-3xl p-3.5 shadow-2xl w-64 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#757575] mb-2 px-1 flex justify-between">
            <span>Hour</span>
            <span>Minute</span>
          </div>

          <div className="grid grid-cols-2 gap-2 h-48">
            {/* Hours Column */}
            <div className="overflow-y-auto pr-1 space-y-1 custom-scrollbar border-r border-[#F0E6DE]">
              {hourOptions.map((h) => {
                const isSelected = h === hours;
                const hNum = parseInt(h, 10);
                const hPeriod = hNum >= 12 ? 'PM' : 'AM';
                const h12 = hNum % 12 === 0 ? 12 : hNum % 12;

                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourSelect(h)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#E50914] text-white shadow-xs font-black'
                        : 'text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E50914]'
                    }`}
                  >
                    <span>{h}:00</span>
                    <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#757575]'}`}>
                      {h12} {hPeriod}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Minutes Column */}
            <div className="overflow-y-auto pr-1 space-y-1 custom-scrollbar">
              {minuteOptions.map((m) => {
                const isSelected = m === minutes;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      handleMinuteSelect(m);
                      setIsOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#E50914] text-white shadow-xs font-black'
                        : 'text-[#252525] hover:bg-[#FFF5F5] hover:text-[#E50914]'
                    }`}
                  >
                    :{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick presets */}
          <div className="mt-3 pt-2 border-t border-[#F0E6DE] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onChange('09:00');
                setIsOpen(false);
              }}
              className="text-[10px] font-black text-[#E50914] hover:underline"
            >
              Morning (09:00)
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('18:00');
                setIsOpen(false);
              }}
              className="text-[10px] font-black text-[#E50914] hover:underline"
            >
              Evening (18:00)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
