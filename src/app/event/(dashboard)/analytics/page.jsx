import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

export const metadata = {
  title: 'Analytics & BI | Fahara Event Manager',
  description: 'Track business performance, revenue, bookings, and more.',
};

export default function AnalyticsPage() {
  return (
    <div className="w-full h-full p-2 lg:p-4">
      <AnalyticsDashboard />
    </div>
  );
}
