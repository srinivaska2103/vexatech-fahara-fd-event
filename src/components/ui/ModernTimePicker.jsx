"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const hour24 = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  const value = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  const label = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
  return { value, label };
});

export default function ModernTimePicker({ value, onChange, placeholder = "Select time" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedSlot = TIME_SLOTS.find(slot => slot.value === value) || { value: '', label: value || placeholder };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block w-full sm:w-auto min-w-[130px] select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border rounded-xl text-xs font-bold transition-all shadow-2xs ${
          isOpen 
            ? 'border-[#6F4E37] ring-2 ring-[#6F4E37]/15 text-[#2C1810]' 
            : 'border-[#E8DED5] text-[#2C1810] hover:border-[#6F4E37]/40 hover:bg-[#FFFDF9]'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <Clock className="w-3.5 h-3.5 text-[#6F4E37] shrink-0" />
          <span className="truncate">{selectedSlot.label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8C6D58] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#6F4E37]' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 sm:right-auto sm:w-44 mt-1.5 bg-white border border-[#E8DED5] rounded-2xl shadow-xl p-1.5 space-y-1 max-h-56 overflow-y-auto custom-scrollbar"
          >
            {TIME_SLOTS.map((slot) => {
              const isSelected = slot.value === value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => {
                    onChange(slot.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#6F4E37] text-white font-bold shadow-xs'
                      : 'text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                  }`}
                >
                  <span>{slot.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
