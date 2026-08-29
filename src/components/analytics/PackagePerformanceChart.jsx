'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PackagePerformanceChart = ({ data = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-[#E8DED5] shadow-xs animate-pulse h-[360px] flex items-center justify-center text-[#8C6D58] font-bold text-xs">
        Loading Package Chart...
      </div>
    );
  }

  const chartData = data || [];

  const COLORS = ['#6F4E37', '#A67B5B', '#C8A285', '#E8DED5'];

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DED5] shadow-xs select-none space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#2C1810] tracking-tight">Package Performance</h3>
        <span className="text-[10px] font-black text-[#8C6D58] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#6F4E37]/20 uppercase tracking-wider">
          Top Packages
        </span>
      </div>

      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={6}
              dataKey="revenue"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
              formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              formatter={(value) => <span className="text-xs font-bold text-[#2C1810] ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PackagePerformanceChart;
