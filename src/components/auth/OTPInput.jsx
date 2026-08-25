'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function OTPInput({ length = 6, onComplete, error }) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Trigger onComplete
    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length && onComplete) {
      onComplete(combinedOtp);
    }

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length).split('');
    if (pastedData.some(isNaN)) return;
    
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
    
    if (pastedData.length === length && onComplete) {
      onComplete(newOtp.join(''));
    }
    
    if (inputRefs.current[pastedData.length - 1]) {
      inputRefs.current[pastedData.length - 1].focus();
    } else if (inputRefs.current[length - 1]) {
      inputRefs.current[length - 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex gap-2 justify-center w-full" onPaste={handlePaste}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={data}
            ref={(ref) => inputRefs.current[index] = ref}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-black rounded-2xl border bg-[#FFFBF7] text-[#2C1810] focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all shadow-2xs ${
              error ? 'border-red-500 bg-red-50/50' : 'border-[#E8DED5]'
            }`}
          />
        ))}
      </div>
      {error && <span className="text-xs font-bold text-red-500 mt-1">{error}</span>}
    </div>
  );
}
