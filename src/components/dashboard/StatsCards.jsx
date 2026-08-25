'use client';

import { motion } from 'framer-motion';
import { 
  CalendarCheck, IndianRupee, Clock, Layers, Users, TrendingUp, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, delay, accentColor = 'emerald' }) => {
  // Theme color maps for unique card accents as in image 1
  const colorStyles = {
    emerald: {
      glow: 'from-emerald-500/15 via-emerald-400/5 to-transparent',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
      badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    indigo: {
      glow: 'from-indigo-500/15 via-indigo-400/5 to-transparent',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white',
      badgeBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    amber: {
      glow: 'from-amber-500/15 via-amber-400/5 to-transparent',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-600 group-hover:text-white',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    rose: {
      glow: 'from-rose-500/15 via-rose-400/5 to-transparent',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white',
      badgeBg: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  };

  const currentStyle = colorStyles[accentColor] || colorStyles.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-white/95 backdrop-blur-md border border-[#E8DED5] rounded-3xl p-6 flex flex-col justify-between hover:border-[#6F4E37]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.15)] transition-all duration-300 group cursor-pointer select-none"
    >
      {/* Top-Right Soft Quarter-Circle Glow (Matching Image 1) */}
      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${currentStyle.glow} rounded-bl-full transition-transform duration-500 group-hover:scale-125 pointer-events-none`} />

      {/* Top Row: Icon Badge (Left) & Trend Pill (Right) */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-110 ${currentStyle.iconBg}`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>

        {trend !== undefined && (
          <div className={`text-[12px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border shadow-2xs transition-all duration-300 group-hover:scale-105 ${
            trend < 0 
              ? 'bg-rose-50 text-rose-600 border-rose-100' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            {trend < 0 ? (
              <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>{trend > 0 ? `+${trend}%` : `${trend}%`}</span>
          </div>
        )}
      </div>

      {/* Middle Section: Title & Value */}
      <div className="relative z-10 mb-4">
        <h3 className="text-[#8C6D58] font-black text-[11px] uppercase tracking-wider mb-1 group-hover:text-[#6F4E37] transition-colors">
          {title}
        </h3>
        <p className="text-3xl font-black text-[#2C1810] tracking-tight group-hover:scale-[1.01] origin-left transition-transform">
          {value}
        </p>
      </div>

      {/* Bottom Section: Divider Line & Trend Subtext with Micro Icon (Exact to Image 1) */}
      <div className="relative z-10 pt-3 border-t border-[#F2EAE1] flex items-center justify-between">
        <span className="text-[11px] text-[#2C1810]/50 font-semibold tracking-tight">
          {trendLabel || 'vs last month'}
        </span>
        <TrendingUp className="w-3.5 h-3.5 text-[#2C1810]/35 group-hover:text-[#6F4E37] transition-colors" />
      </div>
    </motion.div>
  );
};

export default function StatsCards({ stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.monthlyRevenue),
      icon: IndianRupee,
      trend: stats?.revenueTrend ?? 0,
      trendLabel: 'vs last month',
      accentColor: 'emerald',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      trend: stats?.customerTrend ?? 0,
      trendLabel: 'vs last month',
      accentColor: 'indigo',
    },
    {
      title: 'Active Bookings',
      value: stats?.totalBookings || 0,
      icon: CalendarCheck,
      trend: stats?.bookingTrend ?? 0,
      trendLabel: 'vs last month',
      accentColor: 'amber',
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating || 0,
      icon: TrendingUp,
      trend: stats?.ratingTrend ?? 0,
      trendLabel: 'vs last month',
      accentColor: 'rose',
    }
  ];

  return (
    <div 
      data-tour="stats-cards" 
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} delay={idx * 0.05} />
      ))}
    </div>
  );
}
