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
  PanelLeftOpen, X, ChevronRight, ChevronDown, User, LifeBuoy, Sparkles,
  ArrowLeftRight, ShieldCheck, HelpCircle, Store, CornerDownRight
} from 'lucide-react';

const NAV_GROUPS = [
  {
    group: 'MAIN MENU',
    items: [
      { name: 'Dashboard', href: '/event/dashboard', icon: LayoutGrid, color: 'text-amber-600', bg: 'bg-amber-100/70' },
      { name: 'Event Management', href: '/event/profile', icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-100/70' },
      { name: 'Services & Packages', href: '/event/services', icon: PackageCheck, color: 'text-rose-600', bg: 'bg-rose-100/70' },
      { name: 'Bookings', href: '/event/bookings', icon: CalendarCheck2, color: 'text-emerald-600', bg: 'bg-emerald-100/70' },
      { name: 'Events', href: '/event/calendar', icon: CalendarDays, color: 'text-cyan-600', bg: 'bg-cyan-100/70' },
      { name: 'Customers', href: '/event/customers', icon: Users, color: 'text-sky-600', bg: 'bg-sky-100/70' },
      { name: 'Reviews', href: '/event/reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100/70' },
    ]
  },
  {
    group: 'FINANCE',
    items: [
      { name: 'Payments', href: '/event/finance/payments', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-100/70' },
      { name: 'Settlements', href: '/event/finance/settlements', icon: ArrowLeftRight, color: 'text-violet-600', bg: 'bg-violet-100/70' },
      { name: 'Refunds', href: '/event/finance/refunds', icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-100/70' },
      { name: 'Payment Account', href: '/event/finance/payment-account', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100/70' },
    ]
  },
  {
    group: 'SYSTEM',
    items: [
      { name: 'Analytics', href: '/event/analytics', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100/70' },
      { name: 'Notifications', href: '/event/notifications', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-100/70' },
      { name: 'Settings', href: '/event/settings', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-200/80' },
      { name: 'Help & Support', href: '/event/support', icon: HelpCircle, color: 'text-teal-600', bg: 'bg-teal-100/70' },
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

  const [openGroups, setOpenGroups] = useState({
    'MAIN MENU': true,
    'FINANCE': true,
    'SYSTEM': true,
  });

  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const isItemActive = (href) => {
    if (href === '/event/dashboard') {
      return pathname === '/event/dashboard';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    NAV_GROUPS.forEach((group) => {
      const hasActiveChild = group.items.some((item) => isItemActive(item.href));
      if (hasActiveChild) {
        setOpenGroups((prev) => ({ ...prev, [group.group]: true }));
      }
    });
  }, [pathname]);

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

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP SIDEBAR (Visible ONLY on lg+ 1024px+) */}
      {/* ========================================== */}
      <aside 
        data-tour="sidebar-nav"
        aria-label="Desktop Navigation Sidebar"
        className={`
          hidden lg:flex flex-col relative shrink-0 inset-y-0 left-0 z-40 bg-[#FFFDF9] border-r border-[#E8DED5]
          transition-all duration-300 ease-in-out select-none h-screen overflow-hidden shadow-xs
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Top Header Section (Fahara VENUE PARTNER) */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#F2EAE1] bg-white shrink-0">
          <Link 
            href="/event/dashboard" 
            className="flex items-center gap-3 focus-visible:outline-none rounded-xl group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF5EF] border border-[#6F4E37]/20 p-1 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <img 
                src="/Fahara Logo.jpeg" 
                alt="Fahara Venue Partner Logo" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerText = 'F';
                  e.target.parentElement.className = 'w-10 h-10 rounded-2xl bg-[#6F4E37] text-white font-black flex items-center justify-center text-base';
                }}
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold text-[#2C1810] tracking-tight truncate leading-tight group-hover:text-[#6F4E37] transition-colors">
                  Fahara
                </span>
                <span className="text-[9px] font-black text-[#8C6D58] uppercase tracking-widest truncate">
                  VENUE PARTNER
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-2 rounded-xl text-[#8C6D58] hover:text-[#6F4E37] hover:bg-[#FFF8F0] border border-transparent hover:border-[#6F4E37]/20 active:scale-95 transition-all cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 py-3 px-3 space-y-3 overflow-hidden flex flex-col justify-between select-none">
          <div className="space-y-3 overflow-y-auto scrollbar-none pr-0.5">
            {NAV_GROUPS.map((group, groupIdx) => {
              const isGroupOpen = openGroups[group.group] !== false;
              const hasActiveChild = group.items.some((item) => isItemActive(item.href));

              return (
                <div key={groupIdx} className="space-y-1">
                  {!isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.group)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-[#FFF8F0] transition-all cursor-pointer group/header select-none"
                    >
                      <h3 className="text-[9.5px] font-black text-[#8C6D58] group-hover/header:text-[#6F4E37] uppercase tracking-widest transition-colors flex items-center gap-1.5">
                        <span>{group.group}</span>
                        {hasActiveChild && !isGroupOpen && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6F4E37] animate-pulse" />
                        )}
                      </h3>
                      <div className="w-5 h-5 rounded-lg bg-[#FAF5EF] group-hover/header:bg-[#6F4E37] group-hover/header:text-white text-[#8C6D58] flex items-center justify-center transition-all duration-300 shadow-2xs">
                        <ChevronDown 
                          className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${isGroupOpen ? 'rotate-0' : '-rotate-90'}`} 
                        />
                      </div>
                    </button>
                  ) : (
                    <div className="h-px bg-[#F2EAE1] mx-2 my-2" />
                  )}

                  {(isGroupOpen || isCollapsed) && (
                    <div className={`space-y-0.5 transition-all duration-300 ease-in-out ${!isCollapsed ? 'pl-2 border-l border-[#6F4E37]/15 ml-2.5 my-1' : ''}`}>
                      {group.items.map((item) => {
                        const active = isItemActive(item.href);
                        const Icon = item.icon;
                        const showBadge = item.name === 'Notifications' && notificationCount > 0;

                        return (
                          <div key={item.name} className="relative group/item">
                            <Link
                              href={item.href}
                              data-tour-id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className={`
                                relative flex items-center min-h-[34px] rounded-xl transition-all duration-200 ease-out cursor-pointer
                                ${isCollapsed ? 'justify-center px-0 py-1.5' : 'px-2.5 py-1.5 gap-2'}
                                ${
                                  active
                                    ? 'bg-gradient-to-r from-[#6F4E37] to-[#4A3225] text-white font-extrabold shadow-md shadow-[#6F4E37]/20 scale-[1.01]'
                                    : 'text-[#4A3225]/85 hover:bg-[#FFF8F0] hover:text-[#6F4E37] hover:translate-x-0.5 font-bold border border-transparent hover:border-[#6F4E37]/15'
                                }
                              `}
                            >
                              {/* Active Left Indicator Bar */}
                              {active && !isCollapsed && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-[#E6C5A8]" />
                              )}

                              {/* Sub-navigation Branch Arrow */}
                              {!isCollapsed && (
                                <CornerDownRight 
                                  className={`w-3 h-3 shrink-0 stroke-[2] transition-colors ${
                                    active ? 'text-white/80' : 'text-[#8C6D58]/40 group-hover/item:text-[#6F4E37]'
                                  }`} 
                                />
                              )}

                              <div 
                                className={`
                                  w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/item:scale-110
                                  ${active ? 'bg-white/20 text-white' : `${item.bg} ${item.color}`}
                                `}
                              >
                                <Icon className="w-3.5 h-3.5 stroke-[2]" />
                              </div>
                              
                              {!isCollapsed && (
                                <div className="flex items-center justify-between flex-1 min-w-0">
                                  <span className="text-[11px] font-bold tracking-tight truncate leading-none">
                                    {item.name}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {showBadge && (
                                      <span className="px-1.5 py-0.5 text-[8.5px] font-black rounded-full bg-[#6F4E37] text-white animate-pulse">
                                        {notificationCount}
                                      </span>
                                    )}
                                    <ChevronRight 
                                      className={`w-3 h-3 transition-all duration-200 ${
                                        active 
                                          ? 'text-white/80 translate-x-0.5 opacity-100' 
                                          : 'text-[#8C6D58]/50 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 group-hover/item:text-[#6F4E37]'
                                      }`} 
                                    />
                                  </div>
                                </div>
                              )}
                            </Link>

                            {/* Tooltip for Collapsed Sidebar */}
                            {isCollapsed && (
                              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#2C1810] text-white text-[10px] font-bold rounded-xl shadow-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap flex items-center gap-2">
                                <span>{item.name}</span>
                                {showBadge && (
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive User Profile & Sign Out Footer */}
        <div className="p-3 border-t border-[#F2EAE1] bg-white shrink-0 space-y-2">
          {!isCollapsed && (
            <Link
              href="/event/settings"
              className="flex items-center gap-2.5 p-2 rounded-2xl bg-[#FFFBF8] border border-[#F0E6DD] hover:border-[#6F4E37]/30 hover:bg-[#FFF8F0] transition-all group/profile cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#6F4E37] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover/profile:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-extrabold text-[#2C1810] truncate group-hover/profile:text-[#6F4E37] transition-colors">
                  {user?.name || 'Event Manager'}
                </span>
                <span className="text-[10px] font-medium text-[#8C6D58] truncate">
                  {user?.email || 'manager@fahara.com'}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C6D58] group-hover/profile:translate-x-0.5 transition-transform" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className={`
              w-full flex items-center min-h-[38px] rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 transition-all duration-200 active:scale-[0.98] font-bold cursor-pointer
              ${isCollapsed ? 'justify-center p-2' : 'justify-start px-3 py-2 gap-2.5'}
            `}
          >
            <LogOut className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.2]" />
            {!isCollapsed && <span className="text-xs font-extrabold">Sign Out</span>}
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
            {NAV_GROUPS.map((group, groupIdx) => {
              const isGroupOpen = openGroups[group.group] !== false;

              return (
                <div key={groupIdx} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.group)}
                    className="w-full flex items-center justify-between px-1 py-1 cursor-pointer group/mobileHeader"
                  >
                    <h3 className="text-[10px] font-black text-[#8C6D58] tracking-widest uppercase flex items-center gap-2">
                      <span>{group.group}</span>
                    </h3>
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <span className="h-px bg-[#E8DED5] flex-1" />
                      <div className="w-5 h-5 rounded-lg bg-[#FAF5EF] text-[#8C6D58] flex items-center justify-center transition-all duration-300">
                        <ChevronDown 
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${isGroupOpen ? 'rotate-0' : '-rotate-90'}`} 
                        />
                      </div>
                    </div>
                  </button>

                  {/* 2-Column Grid for Cards */}
                  {isGroupOpen && (
                    <div className="grid grid-cols-2 gap-2.5 transition-all duration-300">
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
                                  ${active ? 'bg-white/20 text-white' : `${item.bg} ${item.color}`}
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
                  )}
                </div>
              );
            })}

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
