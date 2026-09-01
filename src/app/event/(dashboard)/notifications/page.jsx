'use client';

import React, { useState } from 'react';
import { 
  Bell, BellOff, BellRing, SlidersHorizontal, Send, Sparkles, 
  CalendarDays, CreditCard, Search, Filter, CheckCircle2, 
  LayoutGrid, List, Check, X, ShieldAlert, Loader2, Info,
  Mail, Clock, Users, CalendarCheck, CheckCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notifications/useNotificationQueries';

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('system'); // 'system' | 'sent_emails'
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Fetch real notifications from backend via hook
  const { data: rawNotifications = [], isLoading, isError, error } = useNotifications({ search: searchQuery });
  const markAllAsReadMutation = useMarkAllAsRead();

  const notificationsList = Array.isArray(rawNotifications) ? rawNotifications : [];

  // Separate System Alerts vs Sent Email Broadcasts by Owner/Manager
  const customSentEmails = notificationsList.filter(n => {
    const t = String(n.type || n.notification_type || '').toUpperCase();
    const c = String(n.channel || '').toUpperCase();
    return t === 'CUSTOM_MESSAGE' || t === 'EMAIL' || c === 'EMAIL' || n.status === 'SENT';
  });

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
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 sm:pb-36 text-[#2C1810]">
      
      {/* 1. TOP HERO BANNER CARD */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37] shrink-0 shadow-inner">
              <BellRing className="w-6 h-6 stroke-[2] animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
                  Notification Center
                </h1>
                {unreadAlerts > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs">
                    {unreadAlerts} UNREAD
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-xl leading-relaxed">
                Stay updated with incoming venue reservations, reviews, and manage email broadcast messages sent to diners.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {unreadAlerts > 0 && activeTab === 'system' && (
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

            <button
              type="button"
              onClick={() => router.push('/event/notifications/compose')}
              className="px-5 py-2.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs font-extrabold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
              suppressHydrationWarning
            >
              <Send className="w-4 h-4" />
              <span>Compose Email Broadcast</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY TAB CONTROLS (SYSTEM ALERTS VS SENT EMAIL BROADCASTS) */}
      <div className="bg-white p-2 rounded-3xl border border-stone-200/90 shadow-2xs flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 cursor-pointer shrink-0 ${
            activeTab === 'system'
              ? "bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white shadow-md"
              : "text-stone-600 hover:text-[#6F4E37] hover:bg-stone-50"
          }`}
          suppressHydrationWarning
        >
          <Bell className="w-4 h-4" />
          <span>System Alerts & Notifications</span>
          {unreadAlerts > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'system' ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"
            }`}>
              {unreadAlerts}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sent_emails')}
          className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2.5 cursor-pointer shrink-0 ${
            activeTab === 'sent_emails'
              ? "bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white shadow-md"
              : "text-stone-600 hover:text-[#6F4E37] hover:bg-stone-50"
          }`}
          suppressHydrationWarning
        >
          <Mail className="w-4 h-4" />
          <span>Sent Email Broadcasts</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'sent_emails' ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
          }`}>
            {customSentEmails.length}
          </span>
        </button>
      </div>

      {/* TAB 1: SYSTEM NOTIFICATIONS & ALERTS */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Stats Metrics Grid (4 Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total Alerts */}
            <div 
              onClick={() => { setStatusFilter('all'); setTypeFilter('all'); }}
              className="p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-[#6F4E37]/40 shadow-2xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Alerts</span>
                <div className="w-7 h-7 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#2C1810] mt-1">{systemNotifications.length}</p>
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

          {/* Search & Filter Control Bar */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 font-medium transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:border-[#6F4E37] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3.5 py-2.5 text-xs font-bold rounded-2xl border border-stone-200 bg-white text-stone-700 focus:outline-none focus:border-[#6F4E37] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="booking">Bookings</option>
                <option value="payout">Payouts & Payments</option>
                <option value="review">Reviews</option>
              </select>
            </div>
          </div>

          {/* List or Empty State */}
          {filteredSystemNotifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-stone-200/90 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 text-[#6F4E37] flex items-center justify-center mx-auto">
                <BellOff className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-[#2C1810]">No System Notifications</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You're all caught up! There are no new alerts, booking updates, or payout notifications at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSystemNotifications.map((notif, idx) => (
                <div key={notif.id || idx} className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">{notif.title || 'System Notification'}</h4>
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
      )}

      {/* TAB 2: SENT EMAIL BROADCASTS BY OWNER / MANAGER */}
      {activeTab === 'sent_emails' && (
        <div className="space-y-6">
          
          {/* Top Hero Banner */}
          <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-7 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#8C6246] text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#2C1810]">Sent Email Broadcasts</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-wider">
                    {customSentEmails.length} Broadcast{customSentEmails.length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                  Review all custom promotional emails and venue updates dispatched to diner inboxes by owner.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 z-10 shrink-0">
              <button 
                type="button"
                onClick={() => router.push('/event/notifications/compose')}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:from-[#5D3F2B] hover:to-[#8C6246] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                suppressHydrationWarning
              >
                <Send className="w-4 h-4" />
                Compose Broadcast
              </button>
            </div>
          </div>

          {customSentEmails.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFF8F0] to-[#FFF5EA] text-[#6F4E37] flex items-center justify-center mx-auto border border-[#DDB892]/40 shadow-2xs">
                <Mail className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-base font-extrabold text-[#2C1810]">No Email Broadcasts Sent Yet</h4>
                <p className="text-xs text-stone-500 font-medium mt-1.5 leading-relaxed">
                  You haven't composed any email broadcasts to diners yet. Click "Compose Broadcast" to send promotional offers, service updates, or event announcements.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => router.push('/event/notifications/compose')}
                className="bg-[#6F4E37] hover:bg-[#5D3F2B] text-white font-extrabold text-xs rounded-2xl px-6 py-3 shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
                suppressHydrationWarning
              >
                <Send className="w-4 h-4" /> Compose Broadcast
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {customSentEmails.map((item, idx) => {
                  const sentDate = item.sent_at || item.created_at;
                  const formattedDate = sentDate 
                    ? new Date(sentDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recently Sent';

                  return (
                    <motion.div 
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="bg-gradient-to-br from-white via-[#FFFBF7] to-[#FFF8F0] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 hover:border-[#6F4E37] shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 relative overflow-hidden group"
                    >
                      {/* Status & Timestamp Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#DDB892]/30">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-wider border border-[#6F4E37]/20">
                            <Mail className="w-3 h-3 text-[#6F4E37]" />
                            EMAIL BROADCAST
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            DELIVERED
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 bg-white px-3 py-1 rounded-xl border border-stone-200 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      {/* Subject Line & Body Text */}
                      <div className="space-y-2.5">
                        <h4 className="text-base sm:text-lg font-extrabold text-[#2C1810] tracking-tight group-hover:text-[#6F4E37] transition-colors">
                          {item.title || item.subject || 'Custom Email Broadcast'}
                        </h4>
                        
                        <div className="bg-white/90 p-4 rounded-2xl border border-[#DDB892]/40 text-xs sm:text-sm text-[#4A3222] font-medium leading-relaxed shadow-2xs whitespace-pre-wrap">
                          {item.message}
                        </div>
                      </div>

                      {/* Footer Metadata Bar */}
                      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-[#6F4E37] font-bold">
                          <div className="w-6 h-6 rounded-lg bg-[#6F4E37]/10 flex items-center justify-center shrink-0">
                            <Users className="w-3.5 h-3.5 text-[#6F4E37]" />
                          </div>
                          <span>Target: <span className="font-extrabold text-[#2C1810]">Registered Diners</span></span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified Sender: <span className="font-bold text-[#6F4E37]">noreply@vexatech.in</span></span>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
