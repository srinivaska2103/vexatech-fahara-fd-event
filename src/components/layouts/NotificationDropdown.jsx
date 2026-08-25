"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notifications/useNotificationQueries';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  const { data: notifications = [] } = useNotifications({ status: 'all' });
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  
  const unreadCount = notifications.filter(n => n.status !== 'read').length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push('/event/notifications');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={handleToggle}
        className="w-9 h-9 rounded-full border border-[#E8DED5] bg-[#FFFBF7] hover:bg-[#FFF8F0] hover:border-[#6F4E37]/40 text-[#6F4E37] flex items-center justify-center transition-all relative shadow-2xs cursor-pointer active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[#6F4E37]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-black leading-none shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-border z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
              <h3 className="font-bold text-text">Notifications</h3>
              {unreadCount === 0 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map(notif => (
                  <div key={notif.id} className="p-4 border-b border-border hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-text font-medium">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : 'Just now'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No notifications yet.
                </div>
              )}
            </div>
            
            <button 
              onClick={handleViewAll}
              className="w-full p-3 text-sm text-primary font-semibold hover:bg-primary/5 transition-colors"
            >
              View All Notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
