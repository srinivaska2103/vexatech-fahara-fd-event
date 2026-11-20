'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueTrendChart = ({ data = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#FEE2E2] shadow-xs animate-pulse h-[360px] flex items-center justify-center text-[#757575] font-bold text-xs">
        Loading Revenue Chart...
      </div>
    );
  }

  const chartData = data || [];
  const hasData = chartData.some(d => Number(d.revenue || 0) > 0);

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#FEE2E2] shadow-xs select-none space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#252525] tracking-tight">Revenue Trend</h3>
        <span className="text-[10px] font-black text-[#757575] bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#E50914]/20 uppercase tracking-wider">
          Monthly INR
        </span>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E50914" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#E50914" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#757575', fontWeight: 700 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#757575', fontWeight: 700 }} 
              tickFormatter={(value) => value >= 1000 ? `₹${(value / 1000).toFixed(0)}k` : `₹${value}`} 
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EAE1" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#252525', 
                borderRadius: '16px', 
                border: 'none', 
                color: '#fff',
                fontWeight: 800,
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' 
              }}
              itemStyle={{ color: '#FFF5F5' }}
              formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#E50914" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
