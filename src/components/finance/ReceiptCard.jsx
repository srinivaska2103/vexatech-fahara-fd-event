import React from 'react';
import { motion } from 'framer-motion';
import { ReceiptText, Download } from 'lucide-react';

const ReceiptCard = ({ receipt, onDownload }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-border p-5 flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ReceiptText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-text">Receipt #{receipt.id}</h3>
          <p className="text-sm text-gray-500">Paid on {new Date(receipt.date || receipt.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="font-bold text-text">₹{receipt.amount?.toFixed(2)}</p>
          <p className="text-xs text-green-600 font-medium">Payment Successful</p>
        </div>
        <button 
          onClick={() => onDownload && onDownload(receipt)}
          className="p-2 text-gray-400 hover:text-primary bg-background rounded-full transition-colors" 
          title="Download Receipt"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default ReceiptCard;
