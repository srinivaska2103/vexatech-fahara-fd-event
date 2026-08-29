'use client';

import Link from 'next/link';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center select-none mb-6">
      {/* Horizontal Header Pill Badge matching reference design */}
      <Link href="/" className="group cursor-pointer mb-5">
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#DDB892]/50 shadow-2xs group-hover:border-[#6F4E37]/30 transition-all">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF0E6] border border-[#DDB892]/60 p-0.5 shrink-0">
            <img 
              src="/fahara-logo.jpeg" 
              alt="Fahara Logo" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerText = 'F';
                e.target.parentElement.className = 'w-10 h-10 rounded-xl bg-[#6F4E37] text-white font-black flex items-center justify-center text-lg';
              }}
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-black text-[#2C1810] tracking-wider leading-none">FAHARA</span>
            <span className="text-[10px] font-bold text-[#6F4E37]/75 leading-none mt-1">Cafe & Event Booking</span>
          </div>
        </div>
      </Link>

      {title && (
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] mb-1.5 tracking-tight text-center">
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

