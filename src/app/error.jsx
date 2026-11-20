'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to console
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF5EF] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none font-sans">
      {/* Background Soft Center Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.85),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-[#FEE2E2] rounded-3xl shadow-xl shadow-[#E50914]/10 p-6 sm:p-8 relative z-10 space-y-5 text-center">
        
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200/80 flex items-center justify-center mx-auto text-rose-600 shadow-2xs">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Text Stack */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
            Something went wrong!
          </h2>
          <p className="text-xs sm:text-sm text-[#757575] font-semibold leading-relaxed">
            An unexpected error occurred while loading this page.
          </p>

          {error?.message && (
            <div className="mt-3.5 p-3.5 bg-[#FFF5F5] border border-rose-200/80 rounded-2xl text-xs font-mono text-rose-700 text-left overflow-auto max-h-36 shadow-2xs leading-relaxed">
              {error.message}
            </div>
          )}
        </div>

        {/* Action Buttons Stack */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#7A563D] via-[#E50914] to-[#593C29] text-white font-black text-sm shadow-md shadow-[#E50914]/25 hover:opacity-95 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
            <span>Try Again</span>
          </button>
          <Link
            href="/event/dashboard"
            className="flex-1 py-3 px-4 rounded-2xl bg-[#FFFBF7] border border-[#FEE2E2] text-[#252525] hover:text-[#E50914] font-black text-sm shadow-2xs hover:bg-white transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.5]" />
            <span>Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

