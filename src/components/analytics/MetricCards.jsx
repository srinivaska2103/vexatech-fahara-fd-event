import React from 'react';
import { Target, Users, Sun } from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-text mb-0.5">{value}</h4>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export const ConversionRateCard = ({ data, isLoading }) => {
  if (isLoading) return <div className="h-[100px] bg-gray-50 animate-pulse rounded-2xl"></div>;
  return (
    <MetricCard 
      title="Conversion Rate" 
      value={`${data?.value || 12.4}%`} 
      subtitle="Of total inquiries" 
      icon={<Target className="w-6 h-6 text-blue-600" />} 
      color="bg-blue-50"
    />
  );
};

export const CustomerRetentionCard = ({ data, isLoading }) => {
  if (isLoading) return <div className="h-[100px] bg-gray-50 animate-pulse rounded-2xl"></div>;
  return (
    <MetricCard 
      title="Customer Retention" 
      value={`${data?.value || 68}%`} 
      subtitle="Repeat customers" 
      icon={<Users className="w-6 h-6 text-purple-600" />} 
      color="bg-purple-50"
    />
  );
};

export const PeakSeasonCard = ({ data, isLoading }) => {
  if (isLoading) return <div className="h-[100px] bg-gray-50 animate-pulse rounded-2xl"></div>;
  return (
    <MetricCard 
      title="Peak Season" 
      value={data?.value || 'Summer'} 
      subtitle="Highest booking volume" 
      icon={<Sun className="w-6 h-6 text-orange-600" />} 
      color="bg-orange-50"
    />
  );
};
