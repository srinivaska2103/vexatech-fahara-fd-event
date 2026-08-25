'use client';

import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react';

export default function BookingSummary({ bookings }) {
  // Aggregate stats from bookings (Assuming bookings is an array or null)
  const stats = [
    { label: 'Total Bookings', value: bookings?.length || 0, icon: BarChart3, color: 'text-[#6F4E37]', bg: 'bg-[#FFF8F0]' },
    { label: 'Pending', value: bookings?.filter(b => b.status?.toLowerCase() === 'pending').length || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Accepted', value: bookings?.filter(b => ['accepted', 'assigned', 'in_progress', 'confirmed'].includes(b.status?.toLowerCase())).length || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Cancelled', value: bookings?.filter(b => b.status?.toLowerCase() === 'cancelled').length || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: "Today's Events", value: 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text/60">{stat.label}</p>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
