import React from 'react';
import { ArrowLeftRight, CheckCircle2, XCircle, Clock } from 'lucide-react';

const RefundTable = ({ refunds = [], isLoading }) => {
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading refunds...</div>;
  if (!refunds.length) return <div className="p-8 text-center text-gray-500">No refunds found.</div>;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 mr-1 text-red-600" />;
      default: return <Clock className="w-4 h-4 mr-1 text-yellow-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-sm text-gray-500 bg-gray-50/50">
            <th className="py-4 px-4 font-medium">Refund ID</th>
            <th className="py-4 px-4 font-medium">Booking / Customer</th>
            <th className="py-4 px-4 font-medium">Amount</th>
            <th className="py-4 px-4 font-medium">Reason</th>
            <th className="py-4 px-4 font-medium">Status</th>
            <th className="py-4 px-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((refund) => (
            <tr key={refund.id} className="border-b border-border hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm font-medium text-text flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                {refund.id}
              </td>
              <td className="py-4 px-4">
                <div className="text-sm font-medium text-text">{refund.customer?.name}</div>
                <div className="text-xs text-gray-500">Booking: {refund.booking_id}</div>
              </td>
              <td className="py-4 px-4 text-sm font-bold text-text">₹{refund.amount?.toFixed(2)}</td>
              <td className="py-4 px-4 text-sm text-gray-600 truncate max-w-[200px]" title={refund.reason}>{refund.reason}</td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(refund.status)}`}>
                  {getStatusIcon(refund.status)}
                  <span className="capitalize">{refund.status}</span>
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{new Date(refund.date || refund.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefundTable;
