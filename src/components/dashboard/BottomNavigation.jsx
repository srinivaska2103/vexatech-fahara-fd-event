'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LogoutConfirmModal from './LogoutConfirmModal';
import { 
  LayoutGrid, CalendarCheck2, PlusCircle, Building2, Menu, X, 
  Sparkles, CreditCard, Users, Bell, Settings, LogOut, PackageCheck, 
  Clock, ChevronUp, Star, BarChart3, IndianRupee, LifeBuoy, Plus,
  ArrowLeftRight, RotateCcw, ShieldCheck, CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const mainTabs = [
    { name: 'Dashboard', href: '/event/dashboard', icon: LayoutGrid },
    { name: 'Bookings', href: '/event/bookings', icon: CalendarCheck2 },
    { name: 'Quick', isQuickAction: true },
    { name: 'Company', href: '/event/profile', icon: Building2 },
    { name: 'Menu', isMenuToggle: true, icon: Menu },
  ];

  const quickActions = [
    { name: 'New Event Service', href: '/event/services/create', icon: PackageCheck, color: 'bg-amber-500' },
    { name: 'Book Venue', href: '/event/bookings/new', icon: CalendarCheck2, color: 'bg-emerald-500' },
    { name: 'Payment Account', href: '/event/finance/payment-account', icon: ShieldCheck, color: 'bg-blue-500' },
    { name: 'Settlements', href: '/event/finance/settlements', icon: ArrowLeftRight, color: 'bg-indigo-500' },
  ];

  // Professional colorful navigation items (Complete Event Manager suite)
  const allMenuLinks = [
    { name: 'Dashboard', href: '/event/dashboard', icon: LayoutGrid, cardBg: 'bg-gradient-to-br from-[#FAF3E0] to-[#FFF8F0]', cardBorder: 'border-amber-300/60 hover:border-amber-400', textColor: 'text-[#4A2C11]', badgeStyle: 'bg-[#6F4E37] text-white shadow-xs' },
    { name: 'Company Profile', href: '/event/profile', icon: Building2, cardBg: 'bg-gradient-to-br from-[#F3E8FF] to-[#FAF5FF]', cardBorder: 'border-purple-300/60 hover:border-purple-400', textColor: 'text-purple-950', badgeStyle: 'bg-purple-600 text-white shadow-xs' },
    { name: 'Services', href: '/event/services', icon: PackageCheck, cardBg: 'bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF]', cardBorder: 'border-sky-300/60 hover:border-sky-400', textColor: 'text-sky-950', badgeStyle: 'bg-sky-600 text-white shadow-xs' },
    { name: 'Bookings', href: '/event/bookings', icon: CalendarCheck2, cardBg: 'bg-gradient-to-br from-[#D1FAE5] to-[#ECFDF5]', cardBorder: 'border-emerald-300/60 hover:border-emerald-400', textColor: 'text-emerald-950', badgeStyle: 'bg-emerald-600 text-white shadow-xs' },
    { name: 'Events Calendar', href: '/event/calendar', icon: CalendarDays, cardBg: 'bg-gradient-to-br from-[#CCFBF1] to-[#F0FDFA]', cardBorder: 'border-teal-300/60 hover:border-teal-400', textColor: 'text-teal-950', badgeStyle: 'bg-teal-600 text-white shadow-xs' },
    { name: 'Customers', href: '/event/customers', icon: Users, cardBg: 'bg-gradient-to-br from-[#FCE7F3] to-[#FDF2F8]', cardBorder: 'border-pink-300/60 hover:border-pink-400', textColor: 'text-pink-950', badgeStyle: 'bg-pink-600 text-white shadow-xs' },
    { name: 'Reviews', href: '/event/reviews', icon: Star, cardBg: 'bg-gradient-to-br from-[#FEF3C7] to-[#FFFBEB]', cardBorder: 'border-amber-300/60 hover:border-amber-400', textColor: 'text-amber-950', badgeStyle: 'bg-amber-500 text-white shadow-xs' },
    { name: 'Payments', href: '/event/finance/payments', icon: CreditCard, cardBg: 'bg-gradient-to-br from-[#FFEDD5] to-[#FFF7ED]', cardBorder: 'border-orange-300/60 hover:border-orange-400', textColor: 'text-orange-950', badgeStyle: 'bg-orange-600 text-white shadow-xs' },
    { name: 'Settlements', href: '/event/finance/settlements', icon: ArrowLeftRight, cardBg: 'bg-gradient-to-br from-[#DCFCE7] to-[#F0FDF4]', cardBorder: 'border-green-300/60 hover:border-green-400', textColor: 'text-green-950', badgeStyle: 'bg-green-600 text-white shadow-xs' },
    { name: 'Refunds', href: '/event/finance/refunds', icon: RotateCcw, cardBg: 'bg-gradient-to-br from-[#FFE4E6] to-[#FFF1F2]', cardBorder: 'border-rose-300/60 hover:border-rose-400', textColor: 'text-rose-950', badgeStyle: 'bg-rose-600 text-white shadow-xs' },
    { name: 'Payment Account', href: '/event/finance/payment-account', icon: ShieldCheck, cardBg: 'bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF]', cardBorder: 'border-blue-300/60 hover:border-blue-400', textColor: 'text-blue-950', badgeStyle: 'bg-blue-600 text-white shadow-xs' },
    { name: 'Analytics', href: '/event/analytics', icon: BarChart3, cardBg: 'bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF]', cardBorder: 'border-indigo-300/60 hover:border-indigo-400', textColor: 'text-indigo-950', badgeStyle: 'bg-indigo-600 text-white shadow-xs' },
    { name: 'Notifications', href: '/event/notifications', icon: Bell, cardBg: 'bg-gradient-to-br from-[#FEE2E2] to-[#FEF2F2]', cardBorder: 'border-red-300/60 hover:border-red-400', textColor: 'text-red-950', badgeStyle: 'bg-red-600 text-white shadow-xs' },
    { name: 'Settings', href: '/event/settings', icon: Settings, cardBg: 'bg-gradient-to-br from-[#F1F5F9] to-[#F8FAFC]', cardBorder: 'border-slate-300/60 hover:border-slate-400', textColor: 'text-slate-900', badgeStyle: 'bg-slate-800 text-white shadow-xs' },
    { name: 'Help & Support', href: '/event/support', icon: LifeBuoy, cardBg: 'bg-gradient-to-br from-[#E0F2FE] to-[#F0FDFA]', cardBorder: 'border-teal-300/60 hover:border-teal-400', textColor: 'text-teal-950', badgeStyle: 'bg-teal-700 text-white shadow-xs' },
  ];

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    setIsMenuOpen(false);
    logout();
    router.push('/event/login');
  };

  const isTabActive = (href) => {
    if (!href) return false;
    if (href === '/event/dashboard') return pathname === '/event/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* QUICK ACTIONS FLOATING DRAWER */}
      <AnimatePresence>
        {isQuickActionsOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickActionsOpen(false)}
              className="absolute inset-0 bg-[#2C1810]/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm mx-4 mb-20 bg-white border border-[#E8DED5] rounded-3xl p-5 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-black text-[#2C1810]">Quick Actions</span>
                </div>
                <button 
                  onClick={() => setIsQuickActionsOpen(false)} 
                  className="p-1.5 rounded-full text-[#8C6D58] hover:bg-[#FFF8F0]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={idx}
                      href={action.href}
                      onClick={() => setIsQuickActionsOpen(false)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FFFDF9] border border-[#E8DED5] hover:border-[#6F4E37] text-[#2C1810] font-bold text-xs transition-all active:scale-98"
                    >
                      <div className={`w-8 h-8 rounded-xl ${action.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <span>{action.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL MENU BAR DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-[#2C1810]/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full bg-white border-t border-[#E8DED5] rounded-t-3xl p-6 shadow-2xl z-10 max-h-[80vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-3">
                <div>
                  <h3 className="text-base font-black text-[#2C1810]">Full Navigation Menu</h3>
                  <p className="text-[11px] text-[#8C6D58] font-semibold">Access all event manager features</p>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl text-[#8C6D58] hover:bg-[#FFF8F0] border border-[#E8DED5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allMenuLinks.map((item, idx) => {
                  const Icon = item.icon;
                  const active = isTabActive(item.href);
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all active:scale-95 shadow-2xs ${
                        active 
                          ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-md ring-2 ring-[#6F4E37]/30' 
                          : `${item.cardBg} ${item.cardBorder} ${item.textColor} hover:shadow-xs`
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 font-bold ${
                        active ? 'bg-white/25 text-white' : item.badgeStyle
                      }`}>
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-black truncate w-full">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout Button in Menu Drawer */}
              <div className="pt-2 border-t border-[#F2EAE1]">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-black transition-all active:scale-98 shadow-2xs"
                >
                  <LogOut className="w-4 h-4 stroke-[2.5]" />
                  <span>Logout of Dashboard</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* BOTTOM NAVIGATION BAR FOR MOBILE & TABLET (<1024px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DED5] px-4 py-2 lg:hidden shadow-lg select-none">
        <div className="flex items-center justify-around max-w-lg mx-auto relative">
          {mainTabs.map((tab, idx) => {
            if (tab.isQuickAction) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsQuickActionsOpen(!isQuickActionsOpen);
                    setIsMenuOpen(false);
                  }}
                  className="relative -top-5 flex flex-col items-center group"
                >
                  <div className="w-13 h-13 rounded-full bg-gradient-to-r from-[#6F4E37] to-[#4A3324] text-white flex items-center justify-center shadow-lg shadow-[#6F4E37]/30 border-4 border-white active:scale-95 transition-transform">
                    <Plus className={`w-7 h-7 stroke-[2.5] transition-transform duration-300 ${isQuickActionsOpen ? 'rotate-45' : ''}`} />
                  </div>
                  <span className="text-[10px] font-black text-[#6F4E37] mt-0.5">Quick Action</span>
                </button>
              );
            }

            if (tab.isMenuToggle) {
              const Icon = tab.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    setIsQuickActionsOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                    isMenuOpen ? 'text-[#6F4E37]' : 'text-[#8C6D58] hover:text-[#6F4E37]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                  <span className="text-[10px] font-extrabold mt-1">Menu</span>
                </button>
              );
            }

            const Icon = tab.icon;
            const active = isTabActive(tab.href);

            return (
              <Link
                key={idx}
                href={tab.href}
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsQuickActionsOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                  active ? 'text-[#6F4E37]' : 'text-[#8C6D58] hover:text-[#6F4E37]'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${active ? 'bg-[#FFF8F0] text-[#6F4E37]' : ''}`}>
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 ${active ? 'font-black text-[#2C1810]' : 'font-semibold'}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
