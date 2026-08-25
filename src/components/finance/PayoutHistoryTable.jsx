import React from 'react';
import { CheckCircle2, Clock, Eye, Download } from 'lucide-react';

const PayoutHistoryTable = ({ payouts = [], isLoading }) => {
  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading payouts...</div>;
  }

  if (!payouts.length) {
    return <div className="p-8 text-center text-gray-500">No payouts found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-sm text-gray-500">
            <th className="py-4 px-4 font-medium">Payout ID</th>
            <th className="py-4 px-4 font-medium">Amount</th>
            <th className="py-4 px-4 font-medium">Status</th>
            <th className="py-4 px-4 font-medium">Requested Date</th>
            <th className="py-4 px-4 font-medium">Bank Account</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id} className="border-b border-border hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm font-medium text-text">{payout.id}</td>
              <td className="py-4 px-4 text-sm font-bold text-text">₹{payout.amount?.toFixed(2)}</td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${payout.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {payout.status === 'completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {payout.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{new Date(payout.requested_date).toLocaleDateString()}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{payout.bank_account}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutHistoryTable;
