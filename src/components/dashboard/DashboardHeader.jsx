'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { NotificationDropdown } from '@/components/layouts/NotificationDropdown';
import { 
  Home, Bell, Settings, LogOut, ChevronDown, 
  HelpCircle, Building2, Sparkles, CalendarDays, CalendarCheck2,
  Zap, Plus, CreditCard, Star, PackageCheck, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGetProfileQuery, useToggleServiceAvailabilityMutation } from '@/hooks/profile/useProfileMutations';
import SubscriptionBadge from '@/components/dashboard/SubscriptionBadge';

export default function DashboardHeader({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { data: profileData } = useGetProfileQuery();
  const { mutate: toggleAvailability, isPending: isToggling } = useToggleServiceAvailabilityMutation();
  const isAvailable = profileData?.is_active ?? true;

  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/event/login');
  };

  const userName = user?.name || user?.ownerName || 'Srinivas KA';
  const userRole = user?.role || 'VENUE PARTNER';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'SK';

  return (
    <header className="h-14 sm:h-16 bg-[#FFFDFB] border-b border-[#E8DED5] flex items-center justify-between px-1.5 xs:px-2.5 sm:px-6 z-30 shadow-2xs select-none font-sans relative">
      
      {/* Left: Fahara Logo & Brand Block (Shown on mobile/tablet, hidden on desktop lg:hidden) */}
      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-4 shrink-0 lg:hidden">
        <Link href="/event/dashboard" className="flex items-center gap-1.5 xs:gap-2 group cursor-pointer shrink-0">
          <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-xl border border-[#E8DED5] bg-[#FFF8F0] flex items-center justify-center p-0.5 shadow-2xs group-hover:border-[#6F4E37]/50 transition-all overflow-hidden shrink-0">
            <img 
              src="/fahara-logo.jpeg" 
              alt="Fahara Logo" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerText = 'F';
                e.target.parentElement.className = 'w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-xl bg-[#5D3A29] text-white font-black flex items-center justify-center text-[10px] sm:text-xs shadow-2xs';
              }}
            />
          </div>
          <div className="hidden min-[340px]:flex flex-col">
            <span className="text-[10px] xs:text-[11px] sm:text-sm font-extrabold text-[#2C1810] tracking-tight leading-none group-hover:text-[#6F4E37] transition-colors">
              Fahara
            </span>
            <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9px] font-black text-[#8C6D58] uppercase tracking-wider block mt-0.5 leading-none">
              VENUE PARTNER
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Subscription Badge, Service Status, Home, Notifications & User Profile Pill */}
      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 shrink-0 ml-auto">

        {/* Subscription Expiry Countdown Badge */}
        <SubscriptionBadge />

        {/* Service Availability Toggle Button */}
        <button
          type="button"
          onClick={() => toggleAvailability(!isAvailable)}
          disabled={isToggling}
          title={isAvailable ? "Click to Pause Services (Hide from Users)" : "Click to Make Services Available (Show to Users)"}
          className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all duration-200 shadow-2xs cursor-pointer select-none shrink-0 ${
            isAvailable 
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-800 hover:bg-emerald-100/80' 
              : 'bg-rose-50/80 border-rose-300 text-rose-800 hover:bg-rose-100/80'
          }`}
        >
          {/* Animated Status Dot */}
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
            {isAvailable && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-full w-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </span>

          <span className="text-[9px] xs:text-[9.5px] sm:text-xs font-black tracking-tight whitespace-nowrap">
            {isAvailable ? 'Live' : 'Paused'}
          </span>

          {/* Mini pill status indicator */}
          <span className={`hidden sm:inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
            isAvailable ? 'bg-emerald-200/60 text-emerald-900' : 'bg-rose-200/60 text-rose-900'
          }`}>
            {isAvailable ? 'Visible' : 'Hidden'}
          </span>
        </button>

        {/* Home Navigation Button */}
        <Link
          href="/event/dashboard"
          title="Home Dashboard"
          className={`hidden sm:flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full border transition-all shadow-2xs cursor-pointer ${
            pathname === '/event/dashboard'
              ? 'border-[#E8DED5] bg-[#FFF8F0] text-[#2C1810] shadow-xs'
              : 'border-[#EFE6DD] bg-[#FFFBF7] text-[#6F4E37] hover:bg-[#FFF8F0] hover:border-[#6F4E37]/30'
          }`}
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6F4E37]" />
        </Link>

        {/* Notification Bell Pill */}
        <NotificationDropdown />

        {/* Vertical Divider */}
        <div className="w-px h-3.5 sm:h-6 bg-[#E8DED5] mx-0.5 shrink-0 hidden min-[360px]:block" />

        {/* User Profile Pill Trigger */}
        <div className="relative shrink-0" ref={profileRef}>
          <button 
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-1 sm:gap-2.5 p-0.5 sm:px-3 sm:py-1 rounded-full border border-[#E8DED5] bg-[#FFFBF7] hover:bg-[#FFF8F0] hover:border-[#6F4E37]/40 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            {/* Text Block (Name & Role - Visible on md+ screens) */}
            <div className="hidden md:flex flex-col items-start min-w-0 text-left">
              <span className="text-xs font-extrabold text-[#2C1810] truncate max-w-[120px] sm:max-w-[140px] leading-tight">
                {userName}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-black text-[#8C6D58] uppercase tracking-wider block leading-none mt-0.5">
                {userRole}
              </span>
            </div>

            {/* Circle Avatar with Initials */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5D3A29] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
              {initials}
            </div>

            {/* Chevron Icon */}
            <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-[#8C6D58] shrink-0 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Popover */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-0 left-3 sm:left-auto mt-0 sm:mt-2 sm:w-64 max-w-[calc(100vw-1.5rem)] bg-[#FFFDFB] border border-[#E8DED5] rounded-3xl p-3 shadow-2xl z-50 space-y-2 select-none"
              >
                {/* User Info Header */}
                <div className="p-3 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider">
                      Verified Partner
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-[#2C1810] truncate">
                    {userName}
                  </h4>
                  <p className="text-[11px] text-[#8C6D58] font-medium truncate">
                    {user?.email || 'srinivaska2103@gmail.com'}
                  </p>
                </div>

                {/* Dropdown Menu Options */}
                <div className="space-y-1 pt-1">
                  <Link
                    href="/event/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-all"
                  >
                    <Building2 className="w-4 h-4 text-[#8C6D58]" />
                    <span>Company Profile</span>
                  </Link>

                  <Link
                    href="/event/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-all"
                  >
                    <Settings className="w-4 h-4 text-[#8C6D58]" />
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    href="/event/support"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37] transition-all"
                  >
                    <HelpCircle className="w-4 h-4 text-[#8C6D58]" />
                    <span>Help & Support</span>
                  </Link>
                </div>

                {/* Sign Out Option */}
                <div className="pt-2 border-t border-[#F2EAE1]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-all active:scale-98 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600 stroke-[2.2]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
}
