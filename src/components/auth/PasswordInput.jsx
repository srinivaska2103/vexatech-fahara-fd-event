'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef(({ label, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label className="text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`w-full px-4 py-3 rounded-2xl border bg-[#FFFBF8] text-[#2C1810] placeholder:text-[#B59D8B] text-sm font-medium focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all pr-11 ${
            error ? 'border-red-500 bg-red-50/50' : 'border-[#F0E6DD]'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A5A44] hover:text-[#2C1810] transition-colors focus:outline-none cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && <span className="text-xs font-bold text-red-500 mt-0.5">{error}</span>}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
