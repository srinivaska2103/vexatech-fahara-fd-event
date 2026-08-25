import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StaffPerformanceChart = ({ data = [], isLoading }) => {
  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center bg-gray-50 animate-pulse rounded-xl">Loading chart...</div>;
  }

  if (!data.length) {
    // Mock Data
    data = [
      { name: 'John D.', events: 12, rating: 4.8 },
      { name: 'Sarah M.', events: 19, rating: 4.9 },
      { name: 'Mike R.', events: 8, rating: 4.5 },
      { name: 'Emma W.', events: 15, rating: 5.0 },
      { name: 'David B.', events: 10, rating: 4.6 },
    ];
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="text-lg font-bold text-text mb-6">Staff Performance (Events Completed)</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="events" fill="#A67B5B" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffPerformanceChart;
