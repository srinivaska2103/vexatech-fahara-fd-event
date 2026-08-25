'use client';
import { useFinanceStore } from '@/store/useFinanceStore';
import { format } from 'date-fns';
import { Eye, CreditCard, Landmark, Coins } from 'lucide-react';
import Link from 'next/link';

export default function TransactionTable({ transactions }) {
  const { selectedItems, toggleItemSelection, selectAllItems } = useFinanceStore();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      selectAllItems(transactions.map(t => t.id));
    } else {
      selectAllItems([]);
    }
  };

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
      case 'card': 
      case 'razorpay':
      case 'cashfree': return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'bank_transfer': return <Landmark className="w-4 h-4 text-green-500" />;
      case 'cash': return <Coins className="w-4 h-4 text-yellow-500" />;
      default: return <CreditCard className="w-4 h-4 text-text/50" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-background/50">
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                checked={transactions.length > 0 && selectedItems.length === transactions.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Transaction ID / Booking</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Customer</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider text-right">Amount</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider hidden sm:table-cell">Date</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border hover:bg-background/30 transition-colors">
              <td className="p-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  checked={selectedItems.includes(tx.id)}
                  onChange={() => toggleItemSelection(tx.id)}
                />
              </td>
              <td className="p-4">
                <div className="font-bold text-text text-sm truncate">{tx.id || 'TXN-0000'}</div>
                <div className="text-xs text-text/50 truncate">Booking #{tx.booking_id || 'N/A'}</div>
              </td>
              <td className="p-4">
                <div className="font-bold text-text text-sm truncate">{tx.customer_name || 'Anonymous'}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-text/50 capitalize">
                  {getPaymentIcon(tx.payment_method)} {tx.payment_method?.replace('_', ' ') || 'Unknown'}
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="font-bold text-text text-sm">₹{(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(tx.status)}`}>
                  {tx.status || 'UNKNOWN'}
                </span>
              </td>
              <td className="p-4 hidden sm:table-cell">
                <div className="text-sm font-semibold text-text">
                  {tx.created_at ? format(new Date(tx.created_at), 'MMM d, yyyy') : 'Recent'}
                </div>
              </td>
              <td className="p-4 text-right">
                <button 
                  className="inline-flex items-center justify-center p-2 text-text/50 hover:text-primary hover:bg-surface rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
