import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, Share2 } from 'lucide-react';

const InvoicePreviewModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-text">Invoice Preview</h2>
              <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              <div className="bg-white p-8 shadow-sm rounded-lg border border-border">
                <div className="flex justify-between items-start mb-8 border-b border-border pb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-1">FAHARA</h1>
                    <p className="text-sm text-gray-500">Event Management</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-semibold text-text mb-2">INVOICE</h2>
                    <p className="text-sm text-gray-500">#{invoice.number || invoice.id}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(invoice.date || invoice.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-sm font-semibold text-text mb-1">Billed To:</p>
                    <p className="text-sm text-gray-600">{invoice.customer?.name}</p>
                    <p className="text-sm text-gray-600">{invoice.customer?.email}</p>
                  </div>
                </div>

                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b border-border text-sm text-gray-500 text-left">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock Item */}
                    <tr className="border-b border-border text-sm">
                      <td className="py-4 text-text">{invoice.package?.name || 'Event Package'}</td>
                      <td className="py-4 text-right text-text">₹{invoice.amount?.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-1/2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-text">₹{(invoice.amount * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-gray-500">Tax (10%)</span>
                      <span className="text-text">₹{(invoice.amount * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span className="text-text">Total</span>
                      <span className="text-primary">₹{invoice.amount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-white flex justify-end gap-3 rounded-b-2xl">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InvoicePreviewModal;
