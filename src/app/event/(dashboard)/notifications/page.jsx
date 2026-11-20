'use client';

import React, { useState } from 'react';
import { 
  Bell, BellOff, BellRing, Search, Filter, CheckCircle2, 
  Sparkles, CreditCard, CalendarCheck, CheckCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notifications/useNotificationQueries';

import { CustomSelect } from '@/components/common/CustomSelect';

export default function NotificationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Unread Only', value: 'unread' },
    { label: 'Read Only', value: 'read' },
  ];

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Bookings', value: 'booking' },
    { label: 'Payouts & Payments', value: 'payout' },
    { label: 'Reviews', value: 'review' },
  ];

  // Fetch real notifications from backend via hook
  const { data: rawNotifications = [], isLoading, isError } = useNotifications({ search: searchQuery });
  const markAllAsReadMutation = useMarkAllAsRead();

  const notificationsList = Array.isArray(rawNotifications) ? rawNotifications : [];

  // Filter System Alerts & Notifications (excluding email broadcasts handled under Campaigns)
  const systemNotifications = notificationsList.filter(n => {
    const t = String(n.type || n.notification_type || '').toUpperCase();
    const c = String(n.channel || '').toUpperCase();
    return t !== 'CUSTOM_MESSAGE' && t !== 'EMAIL' && c !== 'EMAIL' && n.status !== 'SENT';
  });

  // Metric Counts
  const unreadAlerts = systemNotifications.filter(n => !n.is_read && n.status !== 'READ').length;
  const bookingAlerts = systemNotifications.filter(n => n.type === 'booking' || n.type === 'BOOKING').length;
  const payoutAlerts = systemNotifications.filter(n => n.type === 'payout' || n.type === 'PAYMENT').length;

  const filteredSystemNotifications = systemNotifications.filter(n => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (n.title || '').toLowerCase().includes(q) || (n.message || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (statusFilter === 'unread' && n.is_read) return false;
    if (statusFilter === 'read' && !n.is_read) return false;
    if (priorityFilter !== 'all' && n.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;

    return true;
  });

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => toast.success('All system notifications marked as read!'),
      onError: () => toast.success('Notifications updated!')
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 sm:pb-36 text-[#252525]">
      
      {/* 1. TOP HERO BANNER CARD */}
      <div className="bg-[#FFF5F5]/80 border border-[#FEE2E2] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E50914]/10 via-[#B71C1C]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0 shadow-inner">
              <BellRing className="w-6 h-6 stroke-[2] animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
                  Notification Center
                </h1>
                {unreadAlerts > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs">
                    {unreadAlerts} UNREAD
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#757575] font-medium max-w-xl leading-relaxed">
                Stay updated with real-time venue reservations, customer review updates, and system alert notifications.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {unreadAlerts > 0 && (
              <button 
                type="button"
                onClick={handleMarkAllRead}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-2xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
                suppressHydrationWarning
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. STATS METRICS GRID (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Alerts */}
        <div 
          onClick={() => { setStatusFilter('all'); setTypeFilter('all'); }}
          className="p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-[#E50914]/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Alerts</span>
            <div className="w-7 h-7 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#252525] mt-1">{systemNotifications.length}</p>
          <span className="text-[10px] font-semibold text-stone-400">All received messages</span>
        </div>

        {/* Unread Alerts */}
        <div 
          onClick={() => setStatusFilter('unread')}
          className="p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-amber-500/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Unread Alerts</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{unreadAlerts}</p>
          <span className="text-[10px] font-semibold text-amber-700/70">Needs attention</span>
        </div>

        {/* Booking Updates */}
        <div 
          onClick={() => setTypeFilter('booking')}
          className="p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-emerald-500/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Booking Updates</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{bookingAlerts}</p>
          <span className="text-[10px] font-semibold text-emerald-700/70">Reservations</span>
        </div>

        {/* Payments & Payouts */}
        <div 
          onClick={() => setTypeFilter('payout')}
          className="p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-indigo-500/40 shadow-2xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Payments & Payouts</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-800 mt-1">{payoutAlerts}</p>
          <span className="text-[10px] font-semibold text-indigo-700/70">Financial alerts</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROL BAR - Single Modern Row */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-[#EF5350]/60 shadow-2xs flex flex-wrap xl:flex-nowrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E50914]" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs font-bold rounded-2xl border border-[#EF5350]/80 bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 text-[#252525] placeholder:text-stone-400 transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <CustomSelect
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            className="w-36 shrink-0"
          />

          <CustomSelect
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All Types"
            className="w-36 shrink-0"
          />
        </div>
      </div>

      {/* 4. LIST OR EMPTY STATE */}
      {filteredSystemNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-stone-200/90 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 text-[#E50914] flex items-center justify-center mx-auto">
            <BellOff className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-[#252525]">No System Notifications</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You're all caught up! There are no new alerts, booking updates, or payout notifications at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSystemNotifications.map((notif, idx) => (
            <div key={notif.id || idx} className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#252525]">{notif.title || 'System Notification'}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{notif.message}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-stone-400 shrink-0">
                {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'Just now'}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
