"use client";
import React from 'react';
import { useNotifications, useMarkAllAsRead } from '@/hooks/notifications/useNotificationQueries';
import { useNotificationStore } from '@/store/useNotificationStore';
import NotificationCard from './NotificationCard';
import EmptyNotification from './EmptyNotification';
import { Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationList = () => {
  const filters = useNotificationStore(state => state.notificationFilters);
  const { data: notificationsData, isLoading } = useNotifications(filters);
  const markAllAsRead = useMarkAllAsRead();

  // Mock Data if API empty
  const mockNotifications = [];
  
  const notifications = notificationsData?.length > 0 ? notificationsData : mockNotifications;

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read")
    });
  };

  const hasUnread = notifications.some(n => !n.is_read);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyNotification type="notifications" />;
  }

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end mb-2">
          <button 
            onClick={handleMarkAllRead}
            disabled={markAllAsRead.isPending}
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5"
          >
            {markAllAsRead.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Mark all as read
          </button>
        </div>
      )}
      
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <NotificationCard 
            key={notification.id} 
            notification={notification} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
