'use client';

import { Bell, CreditCard, MessageCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsCard({ bookings = [] }) {
  // Generate mock notifications based on bookings
  const notifications = (Array.isArray(bookings) ? bookings : [])
    .slice(0, 3)
    .map((b) => {
      const status = (b.status || '').toUpperCase();
      let icon = MessageCircle;
      let title = 'New Request';
      let bg = 'bg-blue-100';
      let color = 'text-blue-700';
      
      if (status === 'COMPLETED') {
        icon = CreditCard;
        title = 'Payment Received';
        bg = 'bg-green-100';
        color = 'text-green-700';
      } else if (status === 'CANCELLED') {
        icon = AlertTriangle;
        title = 'Booking Cancelled';
        bg = 'bg-red-100';
        color = 'text-red-700';
      } else if (status === 'CONFIRMED') {
        icon = Bell;
        title = 'Booking Confirmed';
        bg = 'bg-primary/10';
        color = 'text-primary';
      }

      return {
        icon,
        title,
        time: new Date(b.createdAt || b.created_at || b.date || b.booking_date).toLocaleDateString(),
        desc: `Booking ${b.booking_number || b.id?.substring(0, 8)} - ${b.customerName || b.customer_name || 'Customer'}`,
        bg,
        color
      };
    });

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-text flex items-center gap-2">
          Notifications
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">3 New</span>
        </h3>
        <Link href="/event/notifications" className="text-sm font-semibold text-primary hover:text-secondary">
          View All
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-text/50 py-8">
            <Bell className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No new notifications</p>
          </div>
        ) : (
          notifications.map((notif, idx) => {
            const Icon = notif.icon;
            return (
              <div key={idx} className="flex gap-4 items-start p-3 rounded-xl hover:bg-background transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-sm font-bold text-text">{notif.title}</h4>
                    <span className="text-xs font-medium text-text/50 whitespace-nowrap ml-2">{notif.time}</span>
                  </div>
                  <p className="text-sm text-text/70 line-clamp-1">{notif.desc}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
