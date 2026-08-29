'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, PieChart as PieChartIcon, ArrowRight } from 'lucide-react';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';

import AnalyticsFilters from './AnalyticsFilters';
import KPICards from './KPICards';
import RevenueTrendChart from './RevenueTrendChart';
import BookingTrendChart from './BookingTrendChart';
import CustomerGrowthChart from './CustomerGrowthChart';
import PackagePerformanceChart from './PackagePerformanceChart';
import ExportReportModal from './ExportReportModal';

const AnalyticsDashboard = () => {
  const { filters } = useAnalyticsStore();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { data: rawDashboardData, isLoading } = useDashboardQueries();
  const rawBookings = rawDashboardData?.rawBookings || [];

  // Filter bookings based on dateRange & serviceId
  const now = new Date();
  const filteredBookings = rawBookings.filter(b => {
    const bDate = new Date(b.date || b.booking_date || b.created_at || now);
    
    // Service Filter
    if (filters.serviceId && filters.serviceId !== 'all') {
      const matchSvc = b.service_id === filters.serviceId || b.service_name === filters.serviceId || b.type === filters.serviceId;
      if (!matchSvc) return false;
    }

    // Date Range Filter
    if (filters.dateRange === 'today') {
      return bDate.toDateString() === now.toDateString();
    }
    if (filters.dateRange === 'this_week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return bDate >= oneWeekAgo;
    }
    if (filters.dateRange === 'this_month') {
      return bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
    }
    if (filters.dateRange === 'this_year') {
      return bDate.getFullYear() === now.getFullYear();
    }

    return true; // 'all_time' or default
  });

  // Calculate KPIs dynamically from real backend bookings
  const paidStatuses = ['COMPLETED', 'CONFIRMED', 'PAID', 'SUCCESS'];
  const totalRevenue = filteredBookings
    .filter(b => paidStatuses.includes((b.status || b.booking_status || b.payment_status || '').toUpperCase()))
    .reduce((sum, b) => sum + Number(b.amount || b.total_amount || b.subtotal || b.total || 0), 0);
    
  const totalBookings = filteredBookings.length;
  const completedEvents = filteredBookings.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'COMPLETED').length;
  const cancelledEvents = filteredBookings.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'CANCELLED').length;
  const pendingBookings = filteredBookings.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'PENDING').length;
  
  const customerSet = new Set(filteredBookings.map(b => b.user_id || b.customer_id || b.customerName || b.customer_name).filter(Boolean));
  const uniqueCustomersCount = customerSet.size || (totalBookings > 0 ? totalBookings : 0);

  const averageRating = rawDashboardData?.stats?.averageRating || (completedEvents > 0 ? 4.9 : 5.0); 

  // Compute monthly data for trends
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueTrendMap = {};
  const bookingTrendMap = {};
  const customerMap = {};

  // Initialize last 6 months dynamically
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = monthNames[d.getMonth()];
    revenueTrendMap[m] = 0;
    bookingTrendMap[m] = 0;
    customerMap[m] = new Set();
  }

  // Package Performance Map
  const packageMap = {};

  filteredBookings.forEach(b => {
    const d = new Date(b.date || b.booking_date || b.created_at || now);
    const m = monthNames[d.getMonth()];
    const amt = Number(b.amount || b.total_amount || b.subtotal || b.total || 0);
    const status = (b.status || b.booking_status || '').toUpperCase();

    if (revenueTrendMap[m] !== undefined) {
      bookingTrendMap[m] += 1;
      if (paidStatuses.includes(status)) {
        revenueTrendMap[m] += amt;
      }
      if (b.customerName || b.customer_name || b.user_id || b.customer_id) {
        customerMap[m].add(b.customerName || b.customer_name || b.user_id || b.customer_id);
      }
    }

    // Package parsing
    const pkgName = b.package_name || b.service_name || b.event_service_name || b.type || 'Event Service Package';
    if (!packageMap[pkgName]) packageMap[pkgName] = { bookings: 0, revenue: 0 };
    packageMap[pkgName].bookings += 1;
    if (paidStatuses.includes(status)) {
      packageMap[pkgName].revenue += amt;
    }
  });

  const revenueTrend = Object.keys(revenueTrendMap).map(k => ({ name: k, revenue: revenueTrendMap[k] }));
  const bookingTrend = Object.keys(bookingTrendMap).map(k => ({ name: k, bookings: bookingTrendMap[k] }));
  const customerGrowth = Object.keys(customerMap).map(k => ({ name: k, customers: customerMap[k].size }));
  
  const packagePerformance = Object.keys(packageMap).map(k => ({
    name: k,
    bookings: packageMap[k].bookings,
    revenue: packageMap[k].revenue
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const dashboardData = {
    kpis: {
      totalRevenue: { value: totalRevenue, change: totalRevenue > 0 ? 100 : 0 },
      totalBookings: { value: totalBookings, change: totalBookings > 0 ? 100 : 0 },
      completedEvents: { value: completedEvents, change: completedEvents > 0 ? 100 : 0 },
      cancelledEvents: { value: cancelledEvents, change: 0 },
      pendingBookings: { value: pendingBookings, change: 0 },
      averageRating: { value: averageRating, change: 0 },
      customerGrowth: { value: uniqueCustomersCount, change: uniqueCustomersCount > 0 ? 100 : 0 },
    }
  };

  const revenueData = { trend: revenueTrend };
  const bookingData = { trend: bookingTrend };
  const customerData = { growth: customerGrowth };
  const packageData = { performance: packagePerformance };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 sm:pb-36">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[#6F4E37] text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Business Intelligence Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Analytics Dashboard
            </h1>
            
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-2xl leading-relaxed">
              Monitor your business performance, revenue growth trends, booking activity, and package analytics.
            </p>
          </div>

          {/* Controls Right */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <AnalyticsFilters services={rawDashboardData?.services || []} />

            <button 
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[44px]"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. KPI METRICS CARDS GRID (7 CARDS)        */}
      {/* ========================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <KPICards data={dashboardData?.kpis} isLoading={isLoading} />
      </motion.div>

      {/* ========================================== */}
      {/* 3. REVENUE & BOOKING TREND CHARTS GRID     */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <RevenueTrendChart data={revenueData?.trend} isLoading={isLoading} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <BookingTrendChart data={bookingData?.trend} isLoading={isLoading} />
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* 4. PACKAGE & CUSTOMER GROWTH CHARTS GRID   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <PackagePerformanceChart data={packageData?.performance} isLoading={isLoading} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CustomerGrowthChart data={customerData?.growth} isLoading={isLoading} />
        </motion.div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        filters={filters}
        data={filteredBookings}
      />

    </div>
  );
};

export default AnalyticsDashboard;
