'use client';

import Link from 'next/link';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center select-none mb-6">
      {/* Centered Large Fahara Logo Card */}
      <Link href="/" className="group cursor-pointer flex flex-col items-center mb-3">
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#FFFBF7] border border-[#E8DED5] p-2 shadow-xs flex items-center justify-center overflow-hidden transition-all group-hover:scale-105">
          <img 
            src="/fahara-logo.jpeg" 
            alt="Fahara Logo" 
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.innerText = 'F';
              e.target.parentElement.className = 'w-20 h-20 rounded-2xl bg-[#6F4E37] text-white font-black flex items-center justify-center text-3xl shadow-xs';
            }}
          />
        </div>
        <span className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight mt-2.5 leading-none">
          Fahara
        </span>
      </Link>

      {/* Pill Badge */}
      <div className="inline-flex items-center px-4 py-1 rounded-full bg-[#FAF5EF] border border-[#E8DED5] text-[10px] font-black text-[#7A5A44] uppercase tracking-wider mb-4 shadow-2xs">
        VENUE PARTNER PORTAL
      </div>

      {title && (
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] mb-2 tracking-tight text-center">
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

