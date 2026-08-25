import { format } from 'date-fns';
import { CreditCard, Landmark, Coins, FileText } from 'lucide-react';

export default function TransactionCard({ transaction: tx }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card': return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'bank_transfer': return <Landmark className="w-4 h-4 text-green-500" />;
      case 'cash': return <Coins className="w-4 h-4 text-yellow-500" />;
      default: return <CreditCard className="w-4 h-4 text-text/50" />;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-text text-sm leading-tight truncate">
            {tx.customer_name || 'Anonymous'}
          </h3>
          <p className="text-xs text-text/50 mt-0.5 truncate">
            {tx.id || 'TXN-0000'}
          </p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(tx.status)}`}>
          {tx.status || 'UNKNOWN'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-text/70">
        {getPaymentIcon(tx.payment_method)}
        <span className="capitalize">{tx.payment_method?.replace('_', ' ') || 'Unknown Method'}</span>
      </div>

      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
        <div className="text-xs font-bold text-text/50 uppercase tracking-wider">
          {tx.created_at ? format(new Date(tx.created_at), 'MMM d, yyyy') : 'Recent'}
        </div>
        <div className="text-lg font-bold text-text">
          ₹{(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}
