'use client';

import React, { useState } from 'react';
import { 
  Bell, BellOff, SlidersHorizontal, Send, Sparkles, 
  CalendarDays, CreditCard, Search, Filter, CheckCircle2, 
  LayoutGrid, List, Check, X, ShieldAlert, Loader2, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');

  // Sample or Real Notifications List
  const [notifications, setNotifications] = useState([
    /* Ready for live notifications */
  ]);

  // Metric Counts
  const totalAlerts = notifications.length;
  const unreadAlerts = notifications.filter(n => !n.is_read).length;
  const bookingAlerts = notifications.filter(n => n.type === 'booking').length;
  const payoutAlerts = notifications.filter(n => n.type === 'payout').length;

  const filteredNotifications = notifications.filter(n => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (n.title || '').toLowerCase().includes(q) || (n.message || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (statusFilter === 'unread' && n.is_read) return false;
    if (statusFilter === 'read' && !n.is_read) return false;
    if (priorityFilter !== 'all' && n.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;

    return true;
  });

  const handleSendCompose = (e) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeMessage.trim()) {
      toast.error('Please enter a subject and message');
      return;
    }
    toast.success('Message sent to Fahara partner support!');
    setComposeSubject('');
    setComposeMessage('');
    setIsComposeOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 sm:pb-36">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37] shrink-0 shadow-inner">
              <Bell className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
                Notification Center
              </h1>
              <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-xl leading-relaxed">
                Stay updated with incoming venue reservations, reviews, and automated payouts.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] text-xs font-bold shadow-2xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8C6D58]" />
              <span>Alert Settings</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsComposeOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs font-bold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
            >
              <Send className="w-4 h-4" />
              <span>Compose Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. STATS OVERVIEW METRICS GRID (4 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: TOTAL ALERTS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#6F4E37]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider">
              Total Alerts
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {totalAlerts}
            </div>
            <p className="text-xs text-[#8C6D58] font-bold mt-1">
              All received messages
            </p>
          </div>
        </div>

        {/* Card 2: UNREAD ALERTS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
              Unread Alerts
            </span>
            <div className="w-7 h-7 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {unreadAlerts}
            </div>
            <p className="text-xs text-amber-700 font-bold mt-1">
              Needs attention
            </p>
          </div>
        </div>

        {/* Card 3: BOOKING UPDATES */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
              Booking Updates
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {bookingAlerts}
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Reservations
            </p>
          </div>
        </div>

        {/* Card 4: PAYMENTS & PAYOUTS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider">
              Payments & Payouts
            </span>
            <div className="w-7 h-7 rounded-full bg-purple-100/80 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {payoutAlerts}
            </div>
            <p className="text-xs text-purple-700 font-bold mt-1">
              Financial alerts
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. TOOLBAR WITH SEARCH & FILTERS           */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        
        {/* Left Search Input */}
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
          <input 
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
          />
        </div>

        {/* Right Dropdowns & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-black text-[#2C1810] focus:outline-none cursor-pointer pr-8 appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-[#8C6D58] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-black text-[#2C1810] focus:outline-none cursor-pointer pr-8 appearance-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal Priority</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-[#8C6D58] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type Dropdown */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-black text-[#2C1810] focus:outline-none cursor-pointer pr-8 appearance-none"
            >
              <option value="all">All Types</option>
              <option value="booking">Bookings</option>
              <option value="payout">Payments & Payouts</option>
              <option value="system">System Alerts</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-[#8C6D58] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[#6F4E37] text-white shadow-2xs' 
                  : 'text-[#8C6D58] hover:bg-[#FFF8F0]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'list' 
                  ? 'bg-[#6F4E37] text-white shadow-2xs' 
                  : 'text-[#8C6D58] hover:bg-[#FFF8F0]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 4. MAIN NOTIFICATION DIRECTORY / EMPTY CARD */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-8 sm:p-12 shadow-xs min-h-[400px] flex items-center justify-center text-center">
        {filteredNotifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-4 max-w-md"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-[#FFF8F0] border border-[#E8DED5] flex items-center justify-center text-[#6F4E37] shadow-inner">
                <BellOff className="w-10 h-10 stroke-[1.8]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center absolute -top-1 -right-1 border-2 border-white shadow-xs">
                ✓
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] tracking-tight">
                No Notifications Found
              </h3>
              <p className="text-xs sm:text-sm text-[#8C6D58] font-medium leading-relaxed">
                You're all caught up! There are no new alerts, booking updates, or payout notifications at this time.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="w-full text-left space-y-3">
            {filteredNotifications.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl border border-[#E8DED5] bg-[#FFFDF9]">
                <h4 className="font-bold text-[#2C1810]">{n.title}</h4>
                <p className="text-xs text-[#8C6D58]">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DED5] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED5]">
              <h3 className="text-lg font-black text-[#2C1810] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#6F4E37]" />
                Compose Support Message
              </h3>
              <button onClick={() => setIsComposeOpen(false)} className="text-[#8C6D58] font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSendCompose} className="space-y-4">
              <div>
                <label className="text-xs font-black text-[#2C1810] uppercase tracking-wider block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Enter message subject..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-bold text-[#2C1810] focus:outline-none focus:border-[#6F4E37]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2C1810] uppercase tracking-wider block mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Type your message here..."
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-4 py-2.5 text-xs font-medium text-[#2C1810] focus:outline-none focus:border-[#6F4E37] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#6F4E37] text-white text-xs font-extrabold shadow-md shadow-[#6F4E37]/20"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Alert Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DED5] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED5]">
              <h3 className="text-lg font-black text-[#2C1810] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#6F4E37]" />
                Alert Preferences
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-[#8C6D58] font-bold">✕</button>
            </div>
            
            <div className="space-y-3 text-xs font-bold text-[#2C1810]">
              <div className="flex items-center justify-between p-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl">
                <span>Email Booking Alerts</span>
                <input type="checkbox" defaultChecked className="accent-[#6F4E37] w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl">
                <span>Customer Review Alerts</span>
                <input type="checkbox" defaultChecked className="accent-[#6F4E37] w-4 h-4" />
              </div>
            </div>

            <button
              onClick={() => {
                toast.success('Alert preferences saved');
                setIsSettingsOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#6F4E37] text-white text-xs font-extrabold shadow-md shadow-[#6F4E37]/20"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
