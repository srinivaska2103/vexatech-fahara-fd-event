'use client';

import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Building2, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeBanner({ stats }) {
  const user = useAuthStore((state) => state.user);
  
  const now = new Date();
  const hour = now.getHours();
  
  // Dynamic time of day greeting
  let greeting = 'Good morning';
  let timeIcon = '☀️';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    timeIcon = '☀️';
  } else if (hour >= 17 || hour < 5) {
    greeting = 'Good evening';
    timeIcon = '🌙';
  }

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div 
      data-tour="welcome-banner"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#4A3222] via-[#5D4037] to-[#3D261C] border border-[#6F4E37]/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl"
    >
      {/* Background Subtle Warm Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Left Side: Status Pill, Dynamic Greeting & Subtitle */}
        <div className="space-y-3 max-w-2xl">
          {/* Top Status & Date Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm" />
            <span className="font-bold">Live Event Dashboard</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{dateFormatted}</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl min-[480px]:text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2.5 leading-tight">
            <span>{greeting}, {user?.name?.split(' ')[0] || 'Srinivas'}!</span>
            <span className="text-2xl sm:text-3xl">{timeIcon}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-xl">
            Here's an overview of your event management operations, active bookings, service requests, and recent customer activities today.
          </p>
        </div>

        {/* Right Side: Quick Action Pills & Primary CTA */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto self-stretch lg:self-auto">
          {/* Bookings Shortcut Pill */}
          <Link
            href="/event/bookings"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 flex-1 sm:flex-none justify-center"
          >
            <CalendarDays className="w-4 h-4 text-amber-300" />
            <span>Bookings</span>
          </Link>

          {/* Services Shortcut Pill */}
          <Link
            href="/event/services"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 flex-1 sm:flex-none justify-center"
          >
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>Services</span>
          </Link>

          {/* Primary Create Event CTA */}
          <Link
            href="/event/services/create"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 min-h-[42px] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Event</span>
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
