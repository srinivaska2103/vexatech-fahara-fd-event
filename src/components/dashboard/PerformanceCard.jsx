'use client';

import { ArrowUpRight, TrendingUp, Target, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PerformanceCard({ stats, rawBookings = [] }) {
  // Compute real metrics from rawBookings
  const totalBookings = rawBookings.length;
  const completedCount = rawBookings.filter(b => (b.status || '').toUpperCase() === 'COMPLETED').length;
  const confirmedCount = rawBookings.filter(b => (b.status || '').toUpperCase() === 'CONFIRMED').length;
  const pendingCount = rawBookings.filter(b => (b.status || '').toUpperCase() === 'PENDING').length;

  const conversionRate = totalBookings > 0 
    ? Math.round(((completedCount + confirmedCount) / totalBookings) * 100) 
    : 0;

  const completionRate = totalBookings > 0 
    ? Math.round((completedCount / totalBookings) * 100) 
    : 0;

  const displayMetrics = [
    { 
      label: 'Booking Conversion Rate', 
      value: `${conversionRate}%`, 
      trend: conversionRate > 0 ? `+${conversionRate}%` : '0%', 
      icon: Target, 
      progress: conversionRate || 0,
    },
    { 
      label: 'Event Completion Rate', 
      value: `${completionRate}%`, 
      trend: completionRate > 0 ? `${completedCount} completed` : '0 events', 
      icon: Award, 
      progress: completionRate || 0,
    },
    { 
      label: 'Pending Review Queue', 
      value: `${pendingCount}`, 
      trend: pendingCount > 0 ? `${pendingCount} pending` : 'All clear', 
      icon: Zap, 
      progress: totalBookings > 0 ? Math.round((pendingCount / totalBookings) * 100) : 0,
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="relative overflow-hidden bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group select-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Performance</h3>
          <p className="text-xs text-[#8C6D58] font-medium mt-0.5">Key operational conversion metrics</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37]">
          <TrendingUp className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-4 flex-1 relative z-10 flex flex-col justify-center">
        {displayMetrics.map((item, idx) => {
          const ItemIcon = item.icon || Target;
          return (
            <div 
              key={idx} 
              className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE1] hover:border-[#6F4E37]/30 hover:bg-white hover:shadow-md transition-all duration-300 group/item"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] border border-[#6F4E37]/15 flex items-center justify-center text-[#6F4E37] group-hover/item:bg-[#6F4E37] group-hover/item:text-white transition-colors">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#2C1810]">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#2C1810]">{item.value}</span>
                  {item.trend && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      {item.trend}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#FFF8F0] border border-[#6F4E37]/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress || 80}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
