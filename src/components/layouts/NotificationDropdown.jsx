"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Sparkles, CalendarCheck, CreditCard, Star, ArrowRight } from 'lucide-react';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notifications/useNotificationQueries';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const DEFAULT_EVENT_NOTIFICATIONS = [
  {
    id: 'evt-1',
    title: 'New Event Booking #EVT-4819',
    message: 'Customer booked Corporate Catering package for 80 guests.',
    status: 'unread',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-2',
    title: 'Bank Settlement Credit',
    message: '₹22,000 net event payout transferred into your bank account.',
    status: 'unread',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-3',
    title: 'New Client Feedback',
    message: 'Client rated your photography & DJ service 5/5 stars!',
    status: 'read',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  const { data: rawData, isLoading } = useNotifications({ status: 'all' });
  const { mutate: markAllAsReadMutation } = useMarkAllAsRead();

  const [isAllRead, setIsAllRead] = useState(false);

  const apiNotifications = Array.isArray(rawData) ? rawData : [];

  const notifications = apiNotifications.map(n => ({
    ...n,
    id: n.id || n._id,
    title: n.title || n.subject || 'New Notification',
    message: n.message || n.content || n.body || '',
    is_read: isAllRead || n.status === 'read' || Boolean(n.is_read)
  }));
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = (e) => {
    if (e) e.stopPropagation();
    setIsAllRead(true);
    markAllAsReadMutation();
    toast.success('All notifications marked as read!');
  };

  const handleMarkItemRead = (e, notifId) => {
    e.stopPropagation();
    e.preventDefault();
    setReadIds(prev => new Set(prev).add(notifId));
    toast.success('Notification marked as read');
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/event/notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-2xl border border-[#E8DED5] bg-[#FFFBF7] hover:bg-[#FFF8F0] hover:border-[#6F4E37]/40 text-[#6F4E37] flex items-center justify-center transition-all relative shadow-2xs cursor-pointer active:scale-95 group"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[#6F4E37] group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-88 bg-white rounded-3xl shadow-2xl border border-[#E8DED5] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#F0E6DD] flex items-center justify-between bg-[#FFF8F0]/70">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#2C1810] text-sm">Notifications</h3>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 rounded-full">
                    ✓ Up to date
                  </span>
                )}
              </div>

              <button 
                type="button"
                onClick={handleMarkAllRead} 
                className="text-xs text-[#6F4E37] hover:text-[#2C1810] font-extrabold flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFF8F0] border border-[#DDB892]/40 transition-all cursor-pointer shadow-2xs"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark read</span>
              </button>
            </div>
            
            {/* List */}
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar divide-y divide-[#F0E6DD]/60">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map(notif => (
                  <div key={notif.id} className="p-4 hover:bg-[#FFF8F0]/60 transition-colors flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs ${!notif.is_read ? 'font-extrabold text-[#2C1810]' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                        {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm font-medium">
                  No notifications yet.
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-[#F0E6DD] bg-[#FFF8F0]/40 text-center">
              <button 
                type="button"
                onClick={handleViewAll}
                className="w-full py-1.5 px-3 text-xs text-[#6F4E37] font-extrabold hover:text-[#2C1810] rounded-xl hover:bg-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View All Notifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
