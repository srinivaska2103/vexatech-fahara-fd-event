'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, Building2, Landmark, Loader2 } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useVerifyAccount } from '@/hooks/finance/useFinanceMutations';

export default function VerificationModal() {
  const { isVerificationModalOpen, setVerificationModalOpen } = useFinanceStore();
  const verifyAccountMutation = useVerifyAccount();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: 'PRIVATE_LIMITED', // PRIVATE_LIMITED, PROPRIETORSHIP, PARTNERSHIP
    panNumber: 'AAACF9901F',
    gstin: '27AAACF9901F1Z5',
    authorizedSignatory: 'Srinivas R',
    address: '102, Commercial Street, MG Road, Bengaluru, KA',
  });

  if (!isVerificationModalOpen) return null;

  const handleComplete = () => {
    verifyAccountMutation.mutate(formData, {
      onSuccess: () => {
        setVerificationModalOpen(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Razorpay Route Onboarding</h2>
              <p className="text-xs text-text/50">KYC & Business Verification Status</p>
            </div>
          </div>

          <button
            onClick={() => setVerificationModalOpen(false)}
            className="p-1.5 rounded-lg text-text/40 hover:text-text hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Checklist */}
        <div className="space-y-3">
          <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">PAN & Business GST Verification</h4>
                <p className="text-xs text-text/50">Verified automatically via NSDL & GSTN portal</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
              Verified
            </span>
          </div>

          <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Penny Drop Bank Account Verification</h4>
                <p className="text-xs text-text/50">Instant penny drop validation completed</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
              Verified
            </span>
          </div>

          <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-text">Razorpay Vendor Sub-Account Agreement</h4>
                <p className="text-xs text-text/50">Digital split agreement signed electronically</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* Verification Footer Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-border">
          <span className="text-xs font-semibold text-text/50">
            Account Status: <span className="font-bold text-green-600">100% Fully Verified</span>
          </span>

          <button
            onClick={handleComplete}
            disabled={verifyAccountMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {verifyAccountMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
