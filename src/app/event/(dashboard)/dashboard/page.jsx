'use client';

import { Suspense } from 'react';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Components
import DashboardBreadcrumb from '@/components/dashboard/DashboardBreadcrumb';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import QuickActions from '@/components/dashboard/QuickActions';
import StatsCards from '@/components/dashboard/StatsCards';
import UpcomingEventsCard from '@/components/dashboard/UpcomingEventsCard';
import TodaysScheduleCard from '@/components/dashboard/TodaysScheduleCard';
import RecentBookingsCard from '@/components/dashboard/RecentBookingsCard';
import PendingRequestsCard from '@/components/dashboard/PendingRequestsCard';
import RevenueCard from '@/components/dashboard/RevenueCard';
import PerformanceCard from '@/components/dashboard/PerformanceCard';
import RecentActivitiesCard from '@/components/dashboard/RecentActivitiesCard';
import CalendarPreviewCard from '@/components/dashboard/CalendarPreviewCard';
import NotificationsCard from '@/components/dashboard/NotificationsCard';
import DashboardTour from '@/components/dashboard/DashboardTour';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

function DashboardContent() {
  const { data, isLoading, isError, error, refetch } = useDashboardQueries();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-white border border-red-200 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-lg min-h-[380px]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10" />
        
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight mb-2">
          Unable to load dashboard data
        </h3>
        
        <p className="text-xs sm:text-sm text-[#2C1810]/70 font-medium mb-6 max-w-md leading-relaxed">
          {error?.message || 'We encountered an issue while retrieving your latest event metrics. Please verify your connection.'}
        </p>
        
        <button 
          onClick={() => refetch()}
          className="px-6 py-3 bg-[#6F4E37] hover:bg-[#5D4037] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </motion.div>
    );
  }

  const { stats, upcomingEvents, recentBookings, pendingApprovals, rawBookings, weeklyRevenue } = data || {};

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-8"
    >
      <WelcomeBanner stats={stats} />
      <QuickActions />
      <StatsCards stats={stats} />
      
      {/* Analytics Grid: 1024px+ side by side, <1024px stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueCard stats={stats} weeklyRevenue={weeklyRevenue} />
        <PerformanceCard stats={stats} rawBookings={rawBookings} />
      </div>

      {/* Events & Daily Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingEventsCard events={upcomingEvents} />
        </div>
        <div className="lg:col-span-1">
          <TodaysScheduleCard events={upcomingEvents} />
        </div>
      </div>

      {/* Pending Requests & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingRequestsCard requests={pendingApprovals} />
        <RecentBookingsCard bookings={recentBookings} />
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-3.5 min-[360px]:p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
