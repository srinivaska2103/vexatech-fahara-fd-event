import { PieChart, Loader2 } from 'lucide-react';

export default function IncomeBreakdownCard({ bookings = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate actual income breakdown from bookings
  let totalIncome = 0;
  const categories = {};
  
  bookings.forEach(b => {
    if ((b.status || '').toUpperCase() === 'COMPLETED' || (b.status || '').toUpperCase() === 'CONFIRMED') {
      const amount = Number(b.amount || b.total_amount || b.cafe_amount || b.event_service_amount || b.subtotal || 0);
      totalIncome += amount;
      
      const categoryName = b.celebration_type || b.event_name || 'Cafe Booking';
      categories[categoryName] = (categories[categoryName] || 0) + amount;
    }
  });

  const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500'];
  
  const breakdown = Object.entries(categories)
    .map(([label, amount], index) => ({
      label,
      amount,
      percentage: totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0,
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4); // Show top 4 categories

  // Format the total for the center of the donut chart
  const formatTotal = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 flex items-center gap-2">
        <PieChart className="w-4 h-4 text-text/50" /> Income by Service
      </h3>
      
      <div className="flex-1 flex flex-col justify-center">
        {/* Mock donut chart representation */}
        <div className="w-40 h-40 mx-auto rounded-full border-[12px] border-primary mb-8 relative flex items-center justify-center bg-transparent">
           <div className="absolute inset-0 flex items-center justify-center flex-col">
             <span className="text-2xl font-bold text-text">{formatTotal(totalIncome)}</span>
           </div>
        </div>

        <div className="space-y-4 w-full">
          {breakdown.length === 0 ? (
            <div className="text-center text-sm font-medium text-text/50">No completed bookings yet</div>
          ) : (
            breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-semibold text-text/70 truncate mr-2">
                  <span className={`w-3 h-3 shrink-0 rounded-full ${item.color}`}></span>
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-bold text-text">₹{item.amount.toLocaleString()}</span>
                  <span className="text-xs font-bold text-text/40 w-8 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
