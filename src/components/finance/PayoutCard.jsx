import React from 'react';
import { Building2, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const PayoutCard = ({ payout }) => {
  const isCompleted = payout.status === 'completed';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-text">₹{payout.amount?.toFixed(2)}</h3>
            <p className="text-xs text-gray-500">{payout.bank_account || 'Bank Transfer'}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {isCompleted ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
          <span className="capitalize">{payout.status}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="text-gray-500">
          <span className="block text-xs">Requested</span>
          <span className="font-medium text-text">{new Date(payout.requested_date).toLocaleDateString()}</span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-300" />
      </div>
    </motion.div>
  );
};

export default PayoutCard;
