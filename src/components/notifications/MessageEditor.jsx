'use client';
import React, { useState } from 'react';
import { Type, Mail, Sparkles, Eye, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

export const MessageEditor = ({ register, errors, watch, setValue, managerName = 'Saritha Events' }) => {
  const [showPreview, setShowPreview] = useState(true);
  const subject = watch ? (watch('subject') || '') : '';
  const message = watch ? (watch('message') || '') : '';

  const displayManagerName = managerName || 'Saritha Events';

  // Format message preview with placeholders
  let previewMessage = message || 'Write your email broadcast content here...';
  previewMessage = previewMessage.replace(/\{\{\s*customerName\s*\}\}/gi, 'Customer');
  previewMessage = previewMessage.replace(/\{\{\s*customer_name\s*\}\}/gi, 'Customer');
  previewMessage = previewMessage.replace(/\{\{\s*managerName\s*\}\}/gi, displayManagerName);
  previewMessage = previewMessage.replace(/\{\{\s*manager_name\s*\}\}/gi, displayManagerName);
  previewMessage = previewMessage.replace(/\{\{\s*company_name\s*\}\}/gi, displayManagerName);

  return (
    <div className="space-y-6 text-[#252525]">
      
      {/* Communication Channel Indicator Banner with Event Manager Sender Identity */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FFF5F5] via-[#FFF5F5] to-white border border-[#EF5350]/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#B71C1C] text-white flex items-center justify-center shadow-xs shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#252525]">Email Broadcast Channel</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-black border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            
            {/* Sender Business & Verified Email Display */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-[#E50914]">
                <Building2 className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Sender: <strong className="text-[#252525] font-black">{displayManagerName} via Grab2GO</strong></span>
              </div>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-[11px] text-stone-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Sender: <strong className="text-stone-700 font-bold">noreply@vexatech.in</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#E50914] bg-white px-3 py-1.5 rounded-xl border border-[#EF5350]/60 hover:bg-[#FFF5F5] shadow-2xs transition-all cursor-pointer"
            suppressHydrationWarning
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? 'Hide Customer Preview' : 'Show Customer Preview'}</span>
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 bg-white/80 px-3 py-1.5 rounded-xl border border-[#EF5350]/40 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
            <span>HTML & Plaintext</span>
          </div>
        </div>
        {register && <input type="hidden" value="EMAIL" {...register('channel')} />}
      </div>

      {/* Subject Line Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs sm:text-sm font-extrabold text-[#252525] flex items-center gap-1.5">
            Subject Line <span className="text-rose-500">*</span>
          </label>
          <span className={`text-[10px] font-bold ${subject.length > 90 ? 'text-amber-600' : 'text-stone-400'}`}>
            {subject.length} / 100 chars
          </span>
        </div>
        <div className="relative">
          <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E50914]" />
          <input
            {...(register ? register('subject') : {})}
            type="text"
            className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all bg-white focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/15 shadow-2xs placeholder:text-stone-400 ${
              errors?.subject ? "border-rose-500 focus:border-rose-500 ring-rose-100" : "border-stone-200/90"
            }`}
            placeholder={`e.g., Special Event Offers from ${displayManagerName}...`}
          />
        </div>
        {errors?.subject && <p className="mt-1.5 text-xs text-rose-600 font-bold">{errors.subject.message}</p>}
      </div>

      {/* Message Body Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs sm:text-sm font-extrabold text-[#252525] flex items-center gap-1.5">
            Message Content <span className="text-rose-500">*</span>
          </label>
          <span className={`text-[10px] font-bold ${message.length > 1800 ? 'text-amber-600' : 'text-stone-400'}`}>
            {message.length} / 2000 chars
          </span>
        </div>
        <textarea
          {...(register ? register('message') : {})}
          rows={7}
          className={`w-full px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all bg-white focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/15 resize-none leading-relaxed shadow-2xs placeholder:text-stone-400 ${
            errors?.message ? "border-rose-500 focus:border-rose-500 ring-rose-100" : "border-stone-200/90"
          }`}
          placeholder="Write your email broadcast content here..."
        />
        {errors?.message && <p className="mt-1.5 text-xs text-rose-600 font-bold">{errors.message.message}</p>}
      </div>

      {/* Live Customer Email Preview Card */}
      {showPreview && (
        <div className="rounded-3xl border border-[#EF5350]/70 bg-gradient-to-b from-[#FFFDF9] to-[#FFF5F5] overflow-hidden shadow-xs">
          <div className="bg-[#FFF4E6] px-5 py-3 border-b border-[#EF5350]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h5 className="text-xs font-black text-[#252525] tracking-wide uppercase">
                Customer Email Preview
              </h5>
            </div>
            <span className="text-[11px] font-bold text-[#E50914]">
              Recipient View
            </span>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            
            {/* Email Meta header in client email inbox */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-stone-100">
                <span className="text-stone-400 font-semibold">From:</span>
                <span className="font-bold text-[#252525]">
                  "{displayManagerName} via Grab2GO" &lt;noreply@vexatech.in&gt;
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-stone-400 font-semibold">Subject:</span>
                <span className="font-extrabold text-[#E50914]">
                  {subject ? (subject.toLowerCase().includes(displayManagerName.toLowerCase()) ? subject : `Special Event Offers from ${displayManagerName} - ${subject}`) : `Special Event Offers from ${displayManagerName}`}
                </span>
              </div>
            </div>

            {/* Email Content Container rendered as the customer will see it */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
              
              {/* Event Partner Branding Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F5] via-[#FFF5F5] to-[#FFF5F5] border border-[#FEE2E2] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#B71C1C] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  ✨
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#757575] tracking-wider block">
                    Message From Event Partner
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#252525] leading-tight">
                    {displayManagerName}
                  </h3>
                </div>
              </div>

              {/* Greeting */}
              <div className="space-y-2 text-[#252525]">
                <p className="font-bold text-sm text-[#252525]">Hi Customer,</p>
                <p className="font-semibold text-sm text-[#252525]">
                  Greetings from <strong className="text-[#E50914]">{displayManagerName}</strong>!
                </p>
              </div>

              {/* Campaign Message Body */}
              <div className="p-4 rounded-xl bg-[#FFF5F5] border-l-4 border-[#E50914] text-xs sm:text-sm text-[#B71C1C] leading-relaxed whitespace-pre-wrap font-medium">
                {previewMessage}
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">
                Discover our event services, celebration packages and special offers through Grab2GO.
              </p>

              {/* Signature */}
              <div className="pt-4 border-t border-stone-100 space-y-1">
                <p className="text-xs font-semibold text-[#E50914]">Warm regards,</p>
                <p className="text-sm font-black text-[#252525]">{displayManagerName} Team</p>
                <p className="text-[11px] font-bold text-[#B71C1C]">Powered by Grab2GO</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};



