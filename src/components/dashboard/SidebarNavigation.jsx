'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import LogoutConfirmModal from './LogoutConfirmModal';
import { 
  LayoutGrid, Building2, PackageCheck, CalendarCheck2, 
  CalendarDays, Users, Star, CreditCard, Landmark, RotateCcw, 
  Wallet, BarChart3, Bell, Settings, LogOut, PanelLeftClose, 
  PanelLeftOpen, X, ChevronRight, User, LifeBuoy, Sparkles,
  ArrowLeftRight, ShieldCheck, HelpCircle, Store
} from 'lucide-react';

const NAV_GROUPS = [
  {
    group: 'MAIN MENU',
    items: [
      { name: 'Dashboard', href: '/event/dashboard', icon: LayoutGrid },
      { name: 'Event Management', href: '/event/profile', icon: Store },
      { name: 'Services & Packages', href: '/event/services', icon: PackageCheck },
      { name: 'Bookings', href: '/event/bookings', icon: CalendarCheck2 },
      { name: 'Events', href: '/event/calendar', icon: CalendarDays },
      { name: 'Customers', href: '/event/customers', icon: Users },
      { name: 'Reviews', href: '/event/reviews', icon: Star },
    ]
  },
  {
    group: 'FINANCE',
    items: [
      { name: 'Payments', href: '/event/finance/payments', icon: CreditCard },
      { name: 'Settlements', href: '/event/finance/settlements', icon: ArrowLeftRight },
      { name: 'Refunds', href: '/event/finance/refunds', icon: RotateCcw },
      { name: 'Payment Account', href: '/event/finance/payment-account', icon: ShieldCheck },
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { name: 'Analytics', href: '/event/analytics', icon: BarChart3 },
      { name: 'Notifications', href: '/event/notifications', icon: Bell },
      { name: 'Settings', href: '/event/settings', icon: Settings },
      { name: 'Help & Support', href: '/event/support', icon: HelpCircle },
    ]
  }
];

export default function SidebarNavigation({ isOpen, isMobile, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { user } = useAuthStore();
  const { data } = useDashboardQueries();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const notificationCount = data?.rawBookings ? Math.min(data.rawBookings.length, 3) : 0;

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    router.push('/event/login');
  };

  const isItemActive = (href) => {
    if (href === '/event/dashboard') {
      return pathname === '/event/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP SIDEBAR (Visible ONLY on lg+ 1024px+) */}
      {/* ========================================== */}
      <aside 
        data-tour="sidebar-nav"
        aria-label="Desktop Navigation Sidebar"
        className={`
          hidden lg:flex flex-col relative shrink-0 inset-y-0 left-0 z-40 bg-white border-r border-[#E8DED5]
          transition-all duration-300 ease-in-out select-none h-screen overflow-hidden
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Top Header Section (Fahara VENUE PARTNER) */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#F2EAE1] shrink-0">
          <Link 
            href="/event/dashboard" 
            className="flex items-center gap-3 focus-visible:outline-none rounded-xl group"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#FAF5EF] border border-[#6F4E37]/20 p-1 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src="/Fahara Logo.jpeg" 
                alt="Fahara Venue Partner Logo" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerText = 'F';
                  e.target.parentElement.className = 'w-9 h-9 rounded-2xl bg-[#6F4E37] text-white font-black flex items-center justify-center text-base';
                }}
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold text-[#2C1810] tracking-tight truncate leading-tight">
                  Fahara
                </span>
                <span className="text-[9px] font-black text-[#8C6D58] uppercase tracking-wider truncate">
                  VENUE PARTNER
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded-xl text-[#2C1810]/50 hover:text-[#6F4E37] hover:bg-[#FFF8F0] border border-transparent hover:border-[#6F4E37]/20 transition-all"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items List (Non-Scrollable Layout) */}
        <div className="flex-1 py-2 px-2.5 space-y-2.5 overflow-hidden flex flex-col justify-between select-none">
          <div className="space-y-2.5 overflow-y-auto scrollbar-none pr-0.5">
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-0.5">
                {!isCollapsed ? (
                  <h3 className="px-2 text-[8.5px] font-extrabold text-[#8C6D58] uppercase tracking-widest mb-1">
                    {group.group}
                  </h3>
                ) : (
                  <div className="h-px bg-[#F2EAE1] mx-2 my-1.5" />
                )}

                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon;

                  return (
                    <div key={item.name} className="relative group">
                      <Link
                        href={item.href}
                        data-tour-id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`
                          relative flex items-center min-h-[34px] rounded-xl transition-all duration-200
                          ${isCollapsed ? 'justify-center px-0 py-1.5' : 'px-2.5 py-1.5 gap-2.5'}
                          ${
                            active
                              ? 'bg-gradient-to-r from-[#7B543D] to-[#5C3B29] text-white font-bold shadow-xs scale-[1.01]'
                              : 'text-[#2C1810]/85 hover:bg-[#FFF8F0] hover:text-[#6F4E37] font-bold'
                          }
                        `}
                      >
                        <Icon 
                          className={`
                            w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-105 shrink-0 stroke-[2]
                            ${active ? 'text-white' : 'text-[#8C6D58] group-hover:text-[#6F4E37]'}
                          `} 
                        />
                        
                        {!isCollapsed && (
                          <span className="text-[11px] font-bold tracking-tight truncate leading-none">{item.name}</span>
                        )}
                      </Link>

                      {/* Tooltip for Collapsed Sidebar */}
                      {isCollapsed && (
                        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-[#2C1810] text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap">
                          {item.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Sign Out (Compact Modern Bar) */}
        <div className="p-2.5 border-t border-[#F2EAE1] shrink-0">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className={`
              w-full flex items-center min-h-[36px] rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 transition-all duration-200 active:scale-[0.98] font-bold
              ${isCollapsed ? 'justify-center p-1.5' : 'justify-start px-3 py-1.5 gap-2.5'}
            `}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0 stroke-[2.2]" />
            {!isCollapsed && <span className="text-[11px] font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MOBILE & TABLET DRAWER NAVIGATION PANEL     */}
      {/* ========================================== */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#FFFDF9] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
          {/* Compact Mobile Header */}
          <div className="h-16 bg-white border-b border-[#E8DED5] px-4 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white border border-[#E8DED5] p-1 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src="/Fahara Logo.jpeg" 
                  alt="Fahara Event Logo" 
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerText = 'F';
                    e.target.parentElement.className = 'w-9 h-9 rounded-2xl bg-[#6F4E37] text-white font-extrabold flex items-center justify-center text-base';
                  }}
                />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#2C1810] block leading-tight">Fahara Event</span>
                <span className="text-[10px] text-[#8C6D58] font-bold uppercase tracking-wider block">Owner Portal</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/event/notifications"
                onClick={onClose}
                className="relative p-2 rounded-xl text-[#2C1810]/70 hover:text-[#6F4E37] hover:bg-[#FFF8F0] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6F4E37]" />
                )}
              </Link>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#2C1810]/70 hover:text-[#2C1810] hover:bg-[#E8DED5]/50 transition-colors ml-1"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Grid Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-none">
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black text-[#8C6D58] tracking-widest uppercase">
                    {group.group}
                  </h3>
                  <span className="h-px bg-[#E8DED5] flex-1 ml-3" />
                </div>

                {/* 2-Column Grid for Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {group.items.map((item) => {
                    const active = isItemActive(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        data-tour-id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={onClose}
                        className={`
                          relative min-h-[68px] p-3 rounded-2xl border transition-all duration-200
                          flex flex-col justify-between items-start active:scale-[0.97] touch-manipulation
                          ${
                            active
                              ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-md shadow-[#6F4E37]/20'
                              : 'bg-white border-[#E8DED5] text-[#2C1810] hover:border-[#6F4E37]/40 hover:bg-[#FFF8F0]'
                          }
                        `}
                      >
                        <div className="w-full flex items-center justify-between mb-1.5">
                          <div 
                            className={`
                              w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors
                              ${active ? 'bg-white/20 text-white' : 'bg-[#FFF8F0] text-[#6F4E37]'}
                            `}
                          >
                            <Icon className="w-4 h-4 stroke-[2]" />
                          </div>

                          {active && (
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-2xs" />
                          )}
                        </div>

                        <span className="text-xs font-black tracking-tight truncate w-full">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Mobile Logout Wide Card */}
            <div className="pt-2 pb-6">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full min-h-[48px] p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl flex items-center justify-center gap-2.5 font-extrabold hover:bg-rose-100 active:scale-[0.98] transition-all shadow-2xs text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout of Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
