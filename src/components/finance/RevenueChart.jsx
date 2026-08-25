import { BarChart3, Loader2 } from 'lucide-react';

export default function RevenueChart({ bookings = [], isLoading, title = "Revenue Analytics" }) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate monthly revenue for the last 6 months
  const months = [];
  const monthlyData = [];
  
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString('default', { month: 'short' }));
    monthlyData.push({ month: d.getMonth(), year: d.getFullYear(), amount: 0 });
  }

  bookings.forEach(b => {
    if ((b.status || '').toUpperCase() === 'COMPLETED' || (b.status || '').toUpperCase() === 'CONFIRMED') {
      const amount = Number(b.amount || b.total_amount || b.cafe_amount || b.event_service_amount || b.subtotal || 0);
      const date = new Date(b.date || b.booking_date || b.createdAt || b.created_at);
      
      const targetMonth = monthlyData.find(m => m.month === date.getMonth() && m.year === date.getFullYear());
      if (targetMonth) {
        targetMonth.amount += amount;
      }
    }
  });

  const amounts = monthlyData.map(m => m.amount);
  const maxAmount = Math.max(...amounts, 10000); // Minimum scale of 10k to prevent empty charts
  const yAxisMax = Math.ceil(maxAmount / 10000) * 10000;

  // Generate 5 Y-axis ticks
  const yTicks = Array.from({ length: 5 }).map((_, i) => (yAxisMax * (4 - i)) / 4);

  const formatYAxis = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
    return `₹${num}`;
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col min-h-[350px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-text uppercase tracking-wider">{title}</h3>
        <select className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-semibold text-text focus:outline-none" defaultValue="6months">
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-2 border-b border-border pb-4 mt-8 relative">
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-text/30 border-l border-border/50 pl-2">
          {yTicks.map((tick, i) => (
            <span key={i}>{formatYAxis(tick)}</span>
          ))}
        </div>
        
        {/* Bars */}
        <div className="w-full flex justify-between items-end gap-2 pl-12 h-[200px]">
          {monthlyData.map((data, i) => {
            // Container is 200px. Text is ~20px + gap is 8px. Let's use 160px as max bar height.
            const barHeight = Math.max((data.amount / yAxisMax) * 160, 4); // Minimum 4px height
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                <div 
                  className="w-full bg-primary/40 rounded-t-sm group-hover:bg-primary transition-colors relative"
                  style={{ height: `${barHeight}px` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-border shadow-sm text-xs font-bold text-text px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                    ₹{data.amount.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-text/50 uppercase h-[15px] flex items-center">
                  {months[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
