'use client';

import Link from 'next/link';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center select-none mb-6">
      {/* Horizontal Header Pill Badge matching reference design */}
      <Link href="/" className="group cursor-pointer mb-5">
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#EF5350]/50 shadow-2xs group-hover:border-[#E50914]/30 transition-all">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#EF5350]/60 p-0.5 shrink-0">
            <img 
              src="/grab-it-logo.png" 
              alt="Grab2GO Logo" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerText = 'F';
                e.target.parentElement.className = 'w-10 h-10 rounded-xl bg-[#E50914] text-white font-black flex items-center justify-center text-lg';
              }}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-black text-[#252525] tracking-wider leading-none">Grab2GO</span>
            <span className="text-[10px] font-bold text-[#E50914]/75 leading-none mt-1">Cafe & Event Booking</span>
          </div>
        </div>
      </Link>

      {title && (
        <h1 className="text-2xl sm:text-3xl font-black text-[#252525] mb-1.5 tracking-tight text-center">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#7A5A44] font-medium text-center leading-relaxed max-w-xs">
          {subtitle}
        </p>
      )}
    </div>
  );
}

