'use client';
import React from 'react';
import { Type, Mail, Sparkles, Code2 } from 'lucide-react';

export const MessageEditor = ({ register, errors, watch, setValue }) => {
  const subject = watch ? (watch('subject') || '') : '';
  const message = watch ? (watch('message') || '') : '';

  return (
    <div className="space-y-5 text-[#2C1810]">
      
      {/* Communication Channel Indicator Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFF8F0] via-[#FFF5EA] to-white border border-[#DDB892]/60 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center shadow-xs shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">Email Broadcast Channel</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-black border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              Sender: <span className="font-bold text-[#6F4E37]">noreply@vexatech.in</span>
            </p>
          </div>
        </div>
        {register && <input type="hidden" value="EMAIL" {...register('channel')} />}
      </div>

      {/* Subject Line Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-extrabold text-[#2C1810]">Subject Line *</label>
          <span className="text-[10px] text-stone-400 font-bold">{subject.length} / 100 chars</span>
        </div>
        <div className="relative">
          <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            {...(register ? register('subject') : {})}
            type="text"
            className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 shadow-2xs ${
              errors?.subject ? "border-rose-500 focus:border-rose-500" : "border-stone-200/90"
            }`}
            placeholder="e.g., Table Reservation Confirmed - Fahara Cafe..."
          />
        </div>
        {errors?.subject && <p className="mt-1.5 text-xs text-rose-600 font-bold">{errors.subject.message}</p>}
      </div>

      {/* Message Body Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-extrabold text-[#2C1810]">Message Body Paragraphs *</label>
          <span className="text-[10px] text-stone-400 font-bold">{message.length} / 2000 chars</span>
        </div>
        <textarea
          {...(register ? register('message') : {})}
          rows={7}
          className={`w-full px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 resize-none leading-relaxed shadow-2xs ${
            errors?.message ? "border-rose-500 focus:border-rose-500" : "border-stone-200/90"
          }`}
          placeholder="Write your email broadcast content here..."
        />
        {errors?.message && <p className="mt-1.5 text-xs text-rose-600 font-bold">{errors.message.message}</p>}
      </div>
    </div>
  );
};
