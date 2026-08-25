import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { Loader2, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';

export default function RevenueSummaryCard() {
  const { data: dashboardData, isLoading } = useDashboardQueries();

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[160px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate pending clearance from bookings
  const pendingClearance = dashboardData?.rawBookings?.reduce((total, booking) => {
    if ((booking.status || '').toUpperCase() === 'PENDING') {
      const amount = Number(booking.amount || booking.total_amount || booking.cafe_amount || booking.event_service_amount || booking.subtotal || 0);
      return total + amount;
    }
    return total;
  }, 0) || 0;

  const data = {
    totalRevenue: dashboardData?.stats?.totalRevenue || 0,
    monthlyRevenue: dashboardData?.stats?.monthlyRevenue || 0,
    monthlyGrowth: 0, // Mocked growth for now as we don't have last month's data calculation setup
    pendingClearance,
  };

  const isPositiveGrowth = data.monthlyGrowth >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-primary border border-primary-dark rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <IndianRupee className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">Total Balance</p>
          <h2 className="text-4xl font-bold mb-4">₹{data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="text-sm font-semibold flex items-center gap-2">
            Available for payout
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-text/50 uppercase tracking-wider mb-2">Monthly Revenue</p>
        <h2 className="text-3xl font-bold text-text mb-4">₹{data.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        <div className={`text-sm font-bold flex items-center gap-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-500'}`}>
          {isPositiveGrowth ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(data.monthlyGrowth)}% vs last month
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-text/50 uppercase tracking-wider mb-2">Pending Clearance</p>
        <h2 className="text-3xl font-bold text-text mb-4">₹{data.pendingClearance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        <div className="text-sm font-semibold text-text/50">
          Processing via bank transfers
        </div>
      </div>
    </div>
  );
}
