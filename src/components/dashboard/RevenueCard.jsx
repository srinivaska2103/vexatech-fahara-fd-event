'use client';

import { TrendingUp, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RevenueCard({ stats, weeklyRevenue }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  // Real chart data computed from API query response
  const chartData = (weeklyRevenue && weeklyRevenue.length > 0) ? weeklyRevenue : [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ];

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-tour="revenue-overview" 
      className="relative overflow-hidden bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between hover:border-[#E50914]/40 hover:shadow-[0_20px_40px_-15px_rgba(111,78,55,0.12)] transition-all duration-300 group select-none"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E50914]/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-black text-[#252525] tracking-tight">Revenue Overview</h3>
          <p className="text-xs text-[#757575] font-medium mt-0.5">Last 7 days performance</p>
        </div>
        <button className="p-2 hover:bg-[#FFF5F5] rounded-xl text-[#252525]/40 hover:text-[#E50914] border border-transparent hover:border-[#E50914]/20 transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-black text-[#252525] tracking-tight">
          {formatCurrency(stats?.monthlyRevenue || 0)}
        </h2>
        <span className="text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          +12.5%
        </span>
      </div>

      {/* Interactive Bar Chart */}
      <div className="flex-1 flex items-end justify-between gap-3 min-h-[140px] pt-4 relative z-10">
        {chartData.map((d, i) => {
          const heightPercent = d.value > 0 ? Math.max((d.value / maxVal) * 100, 15) : 8;
          return (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group/bar h-full justify-end cursor-pointer">
              {/* Tooltip */}
              <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 text-[10px] font-black text-white bg-[#252525] px-2 py-1 rounded-md shadow-md mb-1 pointer-events-none whitespace-nowrap">
                {formatCurrency(d.value)}
              </div>

              {/* Bar Outer Track */}
              <div className="w-full bg-[#FFF5F5] border border-[#E50914]/15 rounded-2xl relative flex items-end overflow-hidden h-full max-h-[120px] p-1">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`w-full rounded-xl transition-all duration-300 ${
                    d.value > 0 
                      ? 'bg-gradient-to-t from-[#E50914] via-[#B71C1C] to-[#EF5350] group-hover/bar:from-[#4A3324] group-hover/bar:to-[#E50914]' 
                      : 'bg-[#E50914]/15'
                  }`}
                />
              </div>
              <span className="text-[11px] font-bold text-[#252525]/50 group-hover/bar:text-[#E50914] transition-colors">{d.day}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
