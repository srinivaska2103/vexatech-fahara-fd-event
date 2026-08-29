'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerGrowthChart = ({ data = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#E8DED5] shadow-xs animate-pulse h-[360px] flex items-center justify-center text-[#8C6D58] font-bold text-xs">
        Loading Customer Chart...
      </div>
    );
  }

  const chartData = data || [];

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DED5] shadow-xs select-none space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Customer Growth</h3>
        <span className="text-[10px] font-black text-[#8C6D58] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#6F4E37]/20 uppercase tracking-wider">
          New Clients
        </span>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#8C6D58', fontWeight: 700 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#8C6D58', fontWeight: 700 }} 
              allowDecimals={false}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EAE1" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#2C1810', 
                borderRadius: '16px', 
                border: 'none', 
                color: '#fff',
                fontWeight: 800,
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' 
              }}
              itemStyle={{ color: '#FFF8F0' }}
              formatter={(value) => [`${value} Clients`, 'Growth']}
            />
            <Line 
              type="monotone" 
              dataKey="customers" 
              stroke="#6F4E37" 
              strokeWidth={3.5} 
              dot={{ r: 4, fill: '#A67B5B', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 7, fill: '#6F4E37', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerGrowthChart;
