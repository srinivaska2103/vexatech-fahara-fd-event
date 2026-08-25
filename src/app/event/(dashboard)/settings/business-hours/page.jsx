'use client';

import React, { useState } from 'react';
import { Clock, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BusinessHoursPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [schedule, setSchedule] = useState([
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '20:00' },
  ]);

  const handleToggleDay = (index) => {
    const updated = [...schedule];
    updated[index].isOpen = !updated[index].isOpen;
    setSchedule(updated);
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Business hours saved successfully!');
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" /> Business Hours & Operating Schedule
            </h1>
            <p className="text-sm text-text/60 mt-1">
              Set availability hours for automated event booking slots & customer inquiries
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
          {schedule.map((item, index) => (
            <div
              key={item.day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border/80"
            >
              <div className="flex items-center gap-3 w-40">
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={() => handleToggleDay(index)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className={`font-bold text-sm ${item.isOpen ? 'text-text' : 'text-text/40'}`}>
                  {item.day}
                </span>
              </div>

              {item.isOpen ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text/50">Open:</span>
                    <input
                      type="time"
                      value={item.openTime}
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm font-bold text-text focus:outline-none focus:border-primary"
                    />
                  </div>

                  <span className="text-text/30 font-bold">-</span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text/50">Close:</span>
                    <input
                      type="time"
                      value={item.closeTime}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm font-bold text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider bg-red-500/10 px-3 py-1 rounded-full">
                  Closed / Unavailable
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
