'use client';

import { useProfileStore } from '@/store/profileStore';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BusinessVerificationCard() {
  const { profile } = useProfileStore();

  const isVerified = profile?.status === 'ACTIVE';
  const isPending = profile?.status === 'PENDING';

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="border-b border-border p-5 sm:p-6">
        <h2 className="text-lg font-bold text-text">Business Verification</h2>
        <p className="text-sm text-text/60 mt-0.5">Trust & Safety</p>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
        {isVerified ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-green-700 mb-1">Fully Verified</h3>
            <p className="text-sm text-text/60 mb-6 max-w-xs">Your business profile has been reviewed and verified by the Fahara Trust Team.</p>
            
            <div className="w-full bg-background border border-border rounded-xl p-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text/50 mb-3">Verified Documents</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-medium text-text">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Business Registration
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-text">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Identity Proof
                </li>
              </ul>
            </div>
          </motion.div>
        ) : isPending ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-yellow-50">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-yellow-700 mb-1">Verification Pending</h3>
            <p className="text-sm text-text/60 mb-6 max-w-xs">Your profile is currently under review. This usually takes 1-2 business days.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text mb-1">Action Required</h3>
            <p className="text-sm text-text/60 mb-6 max-w-xs">Complete your profile to 100% to submit it for verification and start receiving bookings.</p>
            <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors w-full">
              Begin Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
