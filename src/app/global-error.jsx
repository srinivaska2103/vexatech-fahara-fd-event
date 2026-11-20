'use client';

import React, { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="w-full max-w-md bg-white border border-[#FEE2E2] rounded-3xl p-8 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-black text-[#252525]">Something went wrong</h2>
          <p className="text-xs text-[#757575] font-medium leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-[#E50914] hover:bg-[#5C402D] text-white rounded-2xl text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
