'use client';

import { Activity, Edit3, UserPlus, Package } from 'lucide-react';

export default function RecentActivitiesCard({ bookings = [] }) {
  // Generate mock activities based on bookings
  const activities = (Array.isArray(bookings) ? bookings : [])
    .slice(0, 4)
    .map((b) => {
      const status = (b.status || '').toUpperCase();
      let icon = UserPlus;
      let text = `New booking from ${b.customerName || b.customer_name || 'Customer'}`;
      let color = 'bg-blue-100 text-blue-700';
      
      if (status === 'COMPLETED') {
        icon = Package;
        text = `Event completed for ${b.customerName || b.customer_name || 'Customer'}`;
        color = 'bg-green-100 text-green-700';
      } else if (status === 'CANCELLED') {
        icon = Edit3;
        text = `Booking cancelled by ${b.customerName || b.customer_name || 'Customer'}`;
        color = 'bg-red-100 text-red-700';
      } else if (status === 'CONFIRMED') {
        icon = Activity;
        text = `Booking confirmed for ${b.customerName || b.customer_name || 'Customer'}`;
        color = 'bg-primary/10 text-primary';
      }

      return {
        icon,
        text,
        time: new Date(b.createdAt || b.created_at || b.date || b.booking_date).toLocaleDateString(),
        color
      };
    });

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-text mb-6">Recent Activities</h3>
      
      <div className="space-y-4 flex-1">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-text/50 py-8">
            <Activity className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No recent activities</p>
          </div>
        ) : (
          activities.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="flex gap-4 items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{activity.text}</p>
                  <span className="text-xs text-text/50">{activity.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
