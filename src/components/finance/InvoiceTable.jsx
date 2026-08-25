import React from 'react';
import { Eye, Download, Share2, FileText } from 'lucide-react';

const InvoiceTable = ({ invoices = [], isLoading, onPreview, onDownload }) => {
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading invoices...</div>;
  if (!invoices.length) return <div className="p-8 text-center text-gray-500">No invoices found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-sm text-gray-500 bg-gray-50/50">
            <th className="py-4 px-4 font-medium">Invoice Number</th>
            <th className="py-4 px-4 font-medium">Customer</th>
            <th className="py-4 px-4 font-medium">Date</th>
            <th className="py-4 px-4 font-medium">Amount</th>
            <th className="py-4 px-4 font-medium">Status</th>
            <th className="py-4 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-border hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm font-medium text-text flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                {invoice.number || invoice.id}
              </td>
              <td className="py-4 px-4 text-sm text-text">{invoice.customer?.name || 'Unknown'}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{new Date(invoice.date || invoice.created_at).toLocaleDateString()}</td>
              <td className="py-4 px-4 text-sm font-bold text-text">₹{invoice.amount?.toFixed(2)}</td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 
                  invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <button 
                  onClick={() => onDownload && onDownload(invoice)} 
                  className="p-1 text-gray-400 hover:text-primary transition-colors" 
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
