'use client';

import React, { useState, useEffect } from 'react';
import { X, Landmark, ShieldCheck, Loader2, CheckCircle2, Building2, Phone, Hash } from 'lucide-react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useUpdateBankDetails } from '@/hooks/finance/useFinanceMutations';
import { usePaymentAccount } from '@/hooks/finance/useFinanceQueries';
import { useGetProfileQuery } from '@/hooks/profile/useProfileMutations';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpdateBankModal() {
  const { isUpdateBankModalOpen, setUpdateBankModalOpen } = useFinanceStore();
  const updateBankMutation = useUpdateBankDetails();
  const { data: accountData } = usePaymentAccount();
  const { data: profileData } = useGetProfileQuery();
  const { user } = useAuthStore();

  const initialHolderName = accountData?.accountHolderName || profileData?.bank_account_holder || profileData?.account_holder_name || profileData?.name || user?.name || 'Fahara Events & Services Pvt Ltd';
  const initialEmail = accountData?.email || profileData?.email || user?.email || '';
  const initialIfsc = accountData?.ifsc || profileData?.ifsc_code || profileData?.ifsc || '';

  const [formData, setFormData] = useState({
    accountHolderName: initialHolderName,
    email: initialEmail,
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: initialIfsc,
    phoneNumber: profileData?.phone || user?.phone || '',
    bankName: 'HDFC Bank',
  });

  useEffect(() => {
    if (isUpdateBankModalOpen) {
      setFormData({
        accountHolderName: accountData?.accountHolderName || profileData?.bank_account_holder || profileData?.account_holder_name || profileData?.name || user?.name || 'Fahara Events & Services Pvt Ltd',
        email: accountData?.email || profileData?.email || user?.email || '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: accountData?.ifsc || profileData?.ifsc_code || profileData?.ifsc || '',
        phoneNumber: profileData?.phone || user?.phone || '',
        bankName: 'HDFC Bank',
      });
      setErrors({});
    }
  }, [isUpdateBankModalOpen, accountData, profileData, user]);

  const [errors, setErrors] = useState({});


  if (!isUpdateBankModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.accountHolderName.trim()) errs.accountHolderName = 'Account Holder Name is required';
    if (!formData.accountNumber.trim()) errs.accountNumber = 'Account Number is required';
    else if (!/^\d{9,18}$/.test(formData.accountNumber.trim())) errs.accountNumber = 'Enter a valid 9-18 digit account number';
    
    if (!formData.confirmAccountNumber.trim()) {
      errs.confirmAccountNumber = 'Please confirm account number';
    } else if (formData.accountNumber !== formData.confirmAccountNumber) {
      errs.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!formData.ifscCode.trim()) errs.ifscCode = 'IFSC Code is required';
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode.trim())) {
      errs.ifscCode = 'Enter valid 11-character IFSC (e.g. HDFC0001234)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateBankMutation.mutate({
      accountHolderName: formData.accountHolderName,
      email: formData.email,
      accountNumber: formData.accountNumber,
      confirmAccountNumber: formData.confirmAccountNumber,
      ifscCode: formData.ifscCode,
      phoneNumber: formData.phoneNumber || '9999999999',
      bankName: formData.bankName || 'HDFC Bank',
    }, {
      onSuccess: () => {
        setUpdateBankModalOpen(false);
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#2C1810]/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white border border-[#F0E6DD] rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#F2EAE1]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#966746]/20 flex items-center justify-center text-[#966746] shrink-0 shadow-inner">
                <Landmark className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl font-extrabold text-[#2C1810]">Update Settlement Bank Account</h2>
                <p className="text-xs text-[#7A5A44] font-medium">Razorpay Route vendor payout destination</p>
              </div>
            </div>

            <button
              onClick={() => setUpdateBankModalOpen(false)}
              type="button"
              className="w-8 h-8 rounded-full bg-[#FAF5EF] hover:bg-[#F2EAE1] text-[#7A5A44] hover:text-[#2C1810] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Security Info Banner (Removed harsh yellow background & border) */}
          <div className="bg-[#FFFBF8] border border-[#F0E6DD] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#7A5A44] shadow-xs">
            <div className="w-6 h-6 rounded-full bg-[#966746]/10 text-[#966746] flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#966746]" />
            </div>
            <p className="leading-relaxed font-medium">
              <strong className="text-[#3B2519] font-extrabold">Instant Penny Verification:</strong> Razorpay will verify this bank account via Penny Drop INR 1.00 deposit before enabling daily auto-settlement.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Holder Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => {
                    setFormData({ ...formData, accountHolderName: e.target.value });
                    if (errors.accountHolderName) setErrors({ ...errors, accountHolderName: null });
                  }}
                  placeholder="Full legal name"
                  className={`w-full bg-[#FFFBF8] border rounded-2xl px-4 py-3 text-sm font-medium text-[#2C1810] placeholder:text-[#B59D8B] focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
                    errors.accountHolderName ? 'border-red-500 bg-red-50/30' : 'border-[#F0E6DD]'
                  }`}
                />
                {errors.accountHolderName && <p className="text-xs font-bold text-red-500 mt-1">{errors.accountHolderName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vendor@example.com"
                  className="w-full bg-[#FFFBF8] border border-[#F0E6DD] rounded-2xl px-4 py-3 text-sm font-medium text-[#2C1810] placeholder:text-[#B59D8B] focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all"
                />
              </div>
            </div>

            {/* Account Number & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
                  Account Number
                </label>
                <input
                  type="password"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, accountNumber: e.target.value });
                    if (errors.accountNumber) setErrors({ ...errors, accountNumber: null });
                  }}
                  placeholder="Enter bank account number"
                  className={`w-full bg-[#FFFBF8] border rounded-2xl px-4 py-3 text-sm font-mono font-bold text-[#2C1810] placeholder:text-[#B59D8B] placeholder:font-sans focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
                    errors.accountNumber ? 'border-red-500 bg-red-50/30' : 'border-[#F0E6DD]'
                  }`}
                />
                {errors.accountNumber && <p className="text-xs font-bold text-red-500 mt-1">{errors.accountNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
                  Re-Enter Account Number
                </label>
                <input
                  type="text"
                  value={formData.confirmAccountNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmAccountNumber: e.target.value });
                    if (errors.confirmAccountNumber) setErrors({ ...errors, confirmAccountNumber: null });
                  }}
                  placeholder="Re-enter to confirm"
                  className={`w-full bg-[#FFFBF8] border rounded-2xl px-4 py-3 text-sm font-mono font-bold text-[#2C1810] placeholder:text-[#B59D8B] placeholder:font-sans focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
                    errors.confirmAccountNumber ? 'border-red-500 bg-red-50/30' : 'border-[#F0E6DD]'
                  }`}
                />
                {errors.confirmAccountNumber && <p className="text-xs font-bold text-red-500 mt-1">{errors.confirmAccountNumber}</p>}
              </div>
            </div>

            {/* IFSC & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => {
                    setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() });
                    if (errors.ifscCode) setErrors({ ...errors, ifscCode: null });
                  }}
                  placeholder="HDFC0001234"
                  className={`w-full bg-[#FFFBF8] border rounded-2xl px-4 py-3 text-sm font-mono uppercase font-extrabold text-[#2C1810] placeholder:text-[#B59D8B] placeholder:font-sans focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all ${
                    errors.ifscCode ? 'border-red-500 bg-red-50/30' : 'border-[#F0E6DD]'
                  }`}
                />
                {errors.ifscCode && <p className="text-xs font-bold text-red-500 mt-1">{errors.ifscCode}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-[#4A3225] uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="10-digit phone number"
                  className="w-full bg-[#FFFBF8] border border-[#F0E6DD] rounded-2xl px-4 py-3 text-sm font-medium text-[#2C1810] placeholder:text-[#B59D8B] focus:bg-white focus:outline-none focus:border-[#966746] focus:ring-2 focus:ring-[#966746]/15 transition-all"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-5 flex items-center justify-end gap-3 border-t border-[#F2EAE1]">
              <button
                type="button"
                onClick={() => setUpdateBankModalOpen(false)}
                className="px-5 py-3 rounded-2xl border border-[#F0E6DD] bg-white text-[#7A5A44] hover:text-[#2C1810] hover:bg-[#FAF5EF] font-bold text-sm transition-all cursor-pointer active:scale-98"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateBankMutation.isPending}
                className="px-6 py-3 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white font-extrabold text-sm shadow-lg shadow-[#966746]/20 transition-all active:scale-98 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {updateBankMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Update & Verify Bank</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

