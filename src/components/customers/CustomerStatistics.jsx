import { useCustomerStatistics } from '@/hooks/customers/useCustomerQueries';
import { DollarSign, CalendarCheck, XCircle, TrendingUp, Loader2 } from 'lucide-react';

export default function CustomerStatistics({ customer, bookings }) {
  const completedEvents = bookings?.filter(b => b.booking_status === 'COMPLETED').length || 0;
  const cancelledEvents = bookings?.filter(b => b.booking_status === 'CANCELLED').length || 0;
  const totalRevenue = customer?.total_spend || 0;
  const averageOrderValue = bookings?.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  const statCards = [
    {
      title: 'Lifetime Revenue',
      value: `₹${(totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Completed Events',
      value: completedEvents,
      icon: CalendarCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Cancelled',
      value: cancelledEvents,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'Avg. Order Value',
      value: `₹${(averageOrderValue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <h3 className="text-xs font-bold text-text/50 uppercase tracking-wider">{stat.title}</h3>
            </div>
            <div className="text-2xl font-bold text-text">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
