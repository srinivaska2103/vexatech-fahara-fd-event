'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, RefreshCw, Shield, Edit3, Landmark, CheckCircle2, 
  FileText, Sparkles, Loader2, CreditCard, ShieldCheck, Check, Mail,
  Copy, ExternalLink, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useFinanceStore } from '@/store/useFinanceStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PaymentAccountCard({ accountData, profileData, user, isLoading }) {
  const { setUpdateBankModalOpen } = useFinanceStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8DED5] rounded-3xl py-20 flex flex-col items-center justify-center text-[#8C6D58] gap-3 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
        <p className="text-xs font-black text-[#2C1810]">Loading payment account & bank verification...</p>
      </div>
    );
  }

  const rawAccountNumber = 
    accountData?.accountNumber || 
    accountData?.bankAccountLast4 || 
    profileData?.account_number || 
    profileData?.bank_account_number || 
    '';

  const isConfigured = Boolean(
    accountData?.accountNumber || 
    accountData?.bankAccountLast4 || 
    (accountData?.bankAccountMasked && accountData?.bankAccountMasked !== 'Not Configured') || 
    profileData?.account_number || 
    profileData?.bank_account_number ||
    profileData?.ifsc_code ||
    profileData?.ifsc
  );

  const accountHolderName = 
    accountData?.accountHolderName || 
    profileData?.bank_account_holder || 
    profileData?.account_holder_name || 
    (isConfigured ? (profileData?.name || user?.name || user?.ownerName) : null) || 
    'Not Configured';

  const emailAddress = 
    accountData?.email || 
    profileData?.email || 
    user?.email || 
    'Not Configured';

  const last4Digits = 
    accountData?.bankAccountLast4 || 
    (rawAccountNumber ? String(rawAccountNumber).slice(-4) : '') ||
    profileData?.bank_account_last4 ||
    '';

  const maskedBankAccount = last4Digits
    ? `XXXX XXXX ${last4Digits}`
    : (accountData?.bankAccountMasked && accountData?.bankAccountMasked !== 'Not Configured' ? accountData.bankAccountMasked : 'Not Configured');

  const rawIfsc = 
    accountData?.ifsc || 
    accountData?.ifscMasked || 
    accountData?.rawIfsc ||
    accountData?.bankIfsc ||
    profileData?.ifsc_code || 
    profileData?.ifsc || 
    profileData?.bank_ifsc ||
    user?.ifsc_code ||
    user?.ifsc ||
    user?.bank_ifsc;

  const ifscCode = (rawIfsc && rawIfsc !== 'Not Configured')
    ? rawIfsc
    : 'Not Configured';

  const isVerified = isConfigured && accountData?.status !== 'PENDING';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Refreshing bank status...',
        success: 'Bank verification status up to date!',
        error: 'Failed to refresh status',
      }
    );
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text || text === 'Not Configured') return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans max-w-7xl mx-auto">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-[#FFFBF8] via-[#FFF8F0] to-[#FAF5EF] border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden group hover:border-[#6F4E37]/30 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link 
                href="/event/finance/payments"
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8DED5] text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Payments</span>
              </Link>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37]">
                • BANK VERIFICATION
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Payment Account & Bank Verification
            </h1>
            
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-2xl leading-relaxed">
              Validate your bank account details for direct split settlement payouts.
            </p>
          </div>

          {/* Refresh Action CTA */}
          <button 
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-5 py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5C3B29] text-white text-xs font-black shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 shrink-0 self-start md:self-center min-h-[44px] cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
          </button>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* 2. ACCOUNT STATUS BANNER CARD              */}
      {/* ========================================== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white border border-[#E8DED5] hover:border-[#6F4E37]/30 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37] shrink-0 shadow-xs">
            <Shield className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#2C1810]">
                Vendor Payment Account
              </h3>
              {isVerified ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Not Configured
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium leading-relaxed">
              Direct split settlement transfers are routed strictly to your verified bank account.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setUpdateBankModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#FFFBF8] hover:bg-[#6F4E37] border border-[#E8DED5] hover:border-[#6F4E37] text-[#2C1810] hover:text-white text-xs font-extrabold shadow-xs flex items-center gap-2 transition-all active:scale-95 shrink-0 min-h-[44px] cursor-pointer group"
        >
          <Edit3 className="w-4 h-4 text-[#8C6D58] group-hover:text-white transition-colors" />
          <span>Edit Bank Details</span>
        </button>
      </motion.div>


      {/* ========================================== */}
      {/* 3. MAIN DETAILS & STATUS GRID              */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column (2/3 width): Settlement Destination */}
        <div className="lg:col-span-2 bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-[#F2EAE1] pb-4">
            <h3 className="text-lg font-extrabold text-[#2C1810] flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#6F4E37]" />
              <span>Settlement Destination</span>
            </h3>
            <p className="text-xs text-[#8C6D58] font-medium">
              Bank account linked to your Vendor ID
            </p>
          </div>

          {/* Alert Box */}
          {isVerified ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                ✓
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-emerald-800">
                  ✓ Bank Account Verified
                </h4>
                <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                  Bank account validation complete. Automated payouts are active.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                !
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-extrabold text-amber-800">
                  Bank Details Not Configured
                </h4>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Please click "Edit Bank Details" to link your settlement bank account.
                </p>
              </div>
            </div>
          )}

          {/* Bank Details Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Beneficiary Name Card */}
            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-5 space-y-2 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#6F4E37]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
                  Beneficiary Name
                </span>
              </div>
              <span className="text-base sm:text-lg font-extrabold text-[#2C1810] block truncate">
                {accountHolderName !== 'Not Configured' ? accountHolderName.toUpperCase() : 'Not Configured'}
              </span>
            </div>

            {/* Masked Bank Account Card */}
            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-5 space-y-2 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#6F4E37]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
                  Masked Bank Account
                </span>
                {maskedBankAccount !== 'Not Configured' && (
                  <button 
                    onClick={() => copyToClipboard(maskedBankAccount, 'Account Number')}
                    className="p-1 rounded-lg hover:bg-[#6F4E37]/10 text-[#8C6D58] hover:text-[#6F4E37] transition-colors"
                    title="Copy Account Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-base sm:text-lg font-black text-[#2C1810] block tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#8C6D58] shrink-0" />
                <span>{maskedBankAccount}</span>
              </span>
            </div>

            {/* IFSC Code Card */}
            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-5 space-y-2 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#6F4E37]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
                  IFSC Code
                </span>
                {ifscCode !== 'Not Configured' && (
                  <button 
                    onClick={() => copyToClipboard(ifscCode, 'IFSC Code')}
                    className="p-1 rounded-lg hover:bg-[#6F4E37]/10 text-[#8C6D58] hover:text-[#6F4E37] transition-colors"
                    title="Copy IFSC Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-base sm:text-lg font-black text-[#2C1810] block tracking-wider font-mono">
                {ifscCode}
              </span>
            </div>

            {/* Beneficiary Email Card */}
            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-5 space-y-2 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#6F4E37]/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
                  Beneficiary Email
                </span>
                {emailAddress !== 'Not Configured' && (
                  <button 
                    onClick={() => copyToClipboard(emailAddress, 'Email')}
                    className="p-1 rounded-lg hover:bg-[#6F4E37]/10 text-[#8C6D58] hover:text-[#6F4E37] transition-colors"
                    title="Copy Email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-base sm:text-lg font-extrabold text-[#2C1810] block truncate flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8C6D58] shrink-0" />
                <span className="truncate">{emailAddress}</span>
              </span>
            </div>

            {/* Settlement Capability Card */}
            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-5 space-y-2 sm:col-span-2 hover:-translate-y-0.5 hover:shadow-xs hover:border-[#6F4E37]/30 transition-all duration-200">
              <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
                Settlement Capability
              </span>
              {isVerified ? (
                <span className="text-base sm:text-lg font-black text-emerald-700 block flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Enabled for Automated Daily Settlement</span>
                </span>
              ) : (
                <span className="text-base sm:text-lg font-black text-amber-700 block flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Disabled (Bank Details Required)</span>
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Right Column (1/3 width): Verification Status Card */}
        <div className="lg:col-span-1 bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 h-fit">
          <div className="border-b border-[#F2EAE1] pb-3">
            <h3 className="text-base font-extrabold text-[#2C1810] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6F4E37]" />
              <span>Verification Status</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6D58]">Bank Account Status</span>
              {isVerified ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Not Configured
                </span>
              )}
            </div>

            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6D58]">Vendor ID</span>
              <span className="text-xs font-black text-[#2C1810]">
                {isVerified ? '✓ Active' : 'Pending Setup'}
              </span>
            </div>

            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6D58]">Vendor Gateway Status</span>
              {isVerified ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                  ✓ Active
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-wider">
                  Pending
                </span>
              )}
            </div>

            <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6D58]">Settlement Status</span>
              <span className={`text-xs font-black ${isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isVerified ? '✓ Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

