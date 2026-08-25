import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle2, Download, Printer } from 'lucide-react';

const TransactionDetailsDrawer = ({ isOpen, onClose, transaction }) => {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text">Transaction Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Header Amount */}
              <div className="text-center pb-6 border-b border-border">
                <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-text">₹{transaction.amount?.toFixed(2)}</div>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {transaction.status || 'Completed'}
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Transaction ID</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{transaction.id}</span>
                    <button className="text-gray-400 hover:text-primary"><Copy className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Date</span>
                  <span className="text-sm font-medium">{new Date(transaction.date || transaction.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Payment Method</span>
                  <span className="text-sm font-medium capitalize">{transaction.paymentMethod || transaction.payment_method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Customer</span>
                  <span className="text-sm font-medium">{transaction.customer?.name || 'Walk-in Customer'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-gray-50 flex gap-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetailsDrawer;
