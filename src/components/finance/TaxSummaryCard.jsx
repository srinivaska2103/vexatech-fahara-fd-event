import { useTaxSummary } from '@/hooks/finance/useFinanceQueries';
import { Loader2, FileText, Receipt, Landmark } from 'lucide-react';

export default function TaxSummaryCard() {
  const { data: taxes, isLoading } = useTaxSummary();

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[160px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const data = taxes || {
    grossRevenue: 0,
    netRevenue: 0,
    totalTaxCollected: 0,
    breakdown: [
      { name: 'State Tax (GST)', amount: 0 },
      { name: 'Federal Tax', amount: 0 }
    ]
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 flex items-center gap-2">
        <Landmark className="w-4 h-4 text-text/50" /> Tax & Duties Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
        <div className="bg-background rounded-xl p-4">
          <div className="flex items-center gap-2 text-text/50 mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Gross Revenue</span>
          </div>
          <div className="text-2xl font-bold text-text">₹{data.grossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        
        <div className="bg-background rounded-xl p-4">
          <div className="flex items-center gap-2 text-text/50 mb-2">
            <Landmark className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold uppercase">Tax Collected</span>
          </div>
          <div className="text-2xl font-bold text-text">₹{data.totalTaxCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>

        <div className="bg-background rounded-xl p-4">
          <div className="flex items-center gap-2 text-text/50 mb-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold uppercase">Net Revenue</span>
          </div>
          <div className="text-2xl font-bold text-text">₹{data.netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-text/50 uppercase">Tax Breakdown</h4>
        {data.breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm p-3 bg-background rounded-lg">
            <span className="font-semibold text-text">{item.name}</span>
            <span className="font-bold text-text">₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
