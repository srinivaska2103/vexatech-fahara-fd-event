'use client';

import React from 'react';
import { 
  TrendingUp, TrendingDown, Users, CalendarDays, IndianRupee, 
  Star, Briefcase, Activity 
} from 'lucide-react';
import { motion } from 'framer-motion';

const KPICards = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#E8DED5] animate-pulse space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-[#FFF8F0] rounded-2xl" />
              <div className="w-12 h-5 bg-[#FFF8F0] rounded-full" />
            </div>
            <div className="h-3 bg-[#FFF8F0] rounded-lg w-1/2" />
            <div className="h-7 bg-[#FFF8F0] rounded-lg w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  const kpis = data || {
    totalRevenue: { value: 0, change: 12 },
    totalBookings: { value: 0, change: 8 },
    completedEvents: { value: 0, change: 5 },
    pendingBookings: { value: 0, change: 0 },
    cancelledEvents: { value: 0, change: -2 },
    averageRating: { value: 0, change: 2 },
    customerGrowth: { value: 15, change: 4 },
  };

  const formatValue = (key, value) => {
    if (key === 'totalRevenue') return `₹${Number(value || 0).toLocaleString('en-IN')}`;
    if (key === 'averageRating') return Number(value || 0).toFixed(1);
    if (key === 'customerGrowth') return `${value}%`;
    return Number(value || 0).toLocaleString('en-IN');
  };

  const cards = [
    { title: 'Total Revenue', key: 'totalRevenue', icon: <IndianRupee className="w-4 h-4 stroke-[2.5]" />, color: 'bg-emerald-100/80 text-emerald-700' },
    { title: 'Total Bookings', key: 'totalBookings', icon: <CalendarDays className="w-4 h-4 stroke-[2.5]" />, color: 'bg-blue-100/80 text-blue-700' },
    { title: 'Completed Events', key: 'completedEvents', icon: <Briefcase className="w-4 h-4 stroke-[2.5]" />, color: 'bg-purple-100/80 text-purple-700' },
    { title: 'Pending Bookings', key: 'pendingBookings', icon: <Activity className="w-4 h-4 stroke-[2.5]" />, color: 'bg-orange-100/80 text-orange-700' },
    { title: 'Cancelled Events', key: 'cancelledEvents', icon: <Activity className="w-4 h-4 stroke-[2.5]" />, color: 'bg-rose-100/80 text-rose-700' },
    { title: 'Average Rating', key: 'averageRating', icon: <Star className="w-4 h-4 fill-amber-500 text-amber-500" />, color: 'bg-amber-100/80 text-amber-600' },
    { title: 'Customer Growth', key: 'customerGrowth', icon: <Users className="w-4 h-4 stroke-[2.5]" />, color: 'bg-teal-100/80 text-teal-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
      {cards.map((card, idx) => {
        const metric = kpis[card.key] || { value: 0, change: 0 };
        const isPositive = metric.change >= 0;
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={card.key}
            className="bg-white rounded-3xl border border-[#E8DED5] p-5 sm:p-6 shadow-xs hover:border-[#6F4E37]/30 transition-all duration-300 select-none flex flex-col justify-between space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-2xs ${card.color}`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                isPositive 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3 stroke-[3]" /> : <TrendingDown className="w-3 h-3 stroke-[3]" />}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-[11px] font-black text-[#8C6D58] uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
                {formatValue(card.key, metric.value)}
              </h3>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default KPICards;
