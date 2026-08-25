"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  CalendarDays, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Info, 
  CheckCircle2, 
  Trash2,
  Bell
} from 'lucide-react';
import { useMarkAsRead, useDeleteNotification } from '@/hooks/notifications/useNotificationQueries';
import toast from 'react-hot-toast';

const getIcon = (type) => {
  switch (type) {
    case 'booking': return <CalendarDays className="w-5 h-5 text-blue-600" />;
    case 'payment': return <DollarSign className="w-5 h-5 text-green-600" />;
    case 'review': return <Star className="w-5 h-5 text-yellow-600" />;
    case 'message': return <MessageSquare className="w-5 h-5 text-purple-600" />;
    case 'system': return <Info className="w-5 h-5 text-gray-600" />;
    default: return <Bell className="w-5 h-5 text-primary" />;
  }
};

const getBgColor = (type) => {
  switch (type) {
    case 'booking': return 'bg-blue-100';
    case 'payment': return 'bg-green-100';
    case 'review': return 'bg-yellow-100';
    case 'message': return 'bg-purple-100';
    case 'system': return 'bg-gray-100';
    default: return 'bg-primary/10';
  }
};

const NotificationCard = ({ notification, index }) => {
  const markAsRead = useMarkAsRead();
  const deleteNotif = useDeleteNotification();

  const handleMarkRead = () => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotif.mutate(notification.id, {
      onSuccess: () => toast.success("Notification deleted")
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handleMarkRead}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer group flex items-start gap-4 ${
        notification.read 
          ? 'bg-white border-border' 
          : 'bg-primary/5 border-primary/20 shadow-sm'
      }`}
    >
      {/* Icon */}
      <div className={`p-3 rounded-full flex-shrink-0 ${getBgColor(notification.type)}`}>
        {getIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className={`text-sm truncate ${notification.read ? 'font-medium text-gray-700' : 'font-bold text-text'}`}>
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className={`text-sm line-clamp-2 ${notification.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
          {notification.message}
        </p>
      </div>

      {/* Unread Indicator & Actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {!notification.read && (
          <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm mt-1"></div>
        )}
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-auto">
          {!notification.read && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleMarkRead(); }}
              className="p-1.5 text-gray-400 hover:text-primary bg-white rounded-lg border border-gray-200 shadow-sm transition-colors"
              title="Mark as read"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
