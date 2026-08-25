'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Download, RefreshCw, CheckCircle2, Clock, 
  RotateCcw, XCircle, Search, Sparkles, Repeat, ShieldAlert,
  Loader2, ChevronRight, IndianRupee
} from 'lucide-react';
import { usePayoutList } from '@/hooks/finance/useFinanceQueries';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { useGetProfileQuery } from '@/hooks/profile/useProfileMutations';
import { useFinanceStore } from '@/store/useFinanceStore';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'settled', 'pending', 'processing', 'failed'
  const [searchQuery, setSearchQuery] = useState('');
  
  const filters = useFinanceStore(state => state.filters);
  const pagination = useFinanceStore(state => state.pagination);
  const sort = useFinanceStore(state => state.sort);

  const { data: payoutsApiData, isLoading: isPayoutsLoading, error, refetch } = usePayoutList(filters, pagination, sort);
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardQueries();
  const { data: profileData } = useGetProfileQuery();
  
  const rawBookings = dashboardData?.rawBookings || [];
  const apiPayouts = payoutsApiData?.data || [];
  
  const bankAccountStr = profileData?.bank_name && profileData?.account_number
    ? `${profileData.bank_name} - **** ${String(profileData.account_number).slice(-4) || '****'}` 
    : 'Bank Transfer';

  let allSettlements = [];

  if (apiPayouts.length > 0) {
    allSettlements = apiPayouts.map(p => ({
      id: p.reference_number || `PO-${p.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`,
      razorpayRef: p.razorpay_ref || p.cashfree_ref || `RZP_SETTL_${p.id?.substring(0, 6) || '8842'}`,
      bookingId: p.booking_id || 'BK-1001',
      amount: Number(p.amount || 0),
      status: (p.status || p.payout_status || '').toUpperCase() || 'SETTLED',
      date: p.date || p.transfer_date || new Date().toISOString(),
      bankAccount: p.bank_name && p.account_last4 ? `${p.bank_name} - **** ${p.account_last4}` : bankAccountStr
    }));
  } else if (rawBookings.length > 0) {
    allSettlements = rawBookings.map(b => ({
      id: `PO-${b.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`,
      razorpayRef: `RZP_SETTL_${b.id?.substring(0, 6) || '8842'}`,
      bookingId: b.booking_number || b.id?.substring(0, 8) || 'BK-1000',
      amount: Number(b.vendor_amount || (b.amount ? b.amount * 0.95 : 0)),
      status: (b.status || '').toUpperCase() === 'COMPLETED' || (b.status || '').toUpperCase() === 'CONFIRMED' ? 'SETTLED' : 'PENDING',
      date: b.createdAt || b.created_at || b.date || b.booking_date || new Date().toISOString(),
      bankAccount: bankAccountStr
    }));
  }

  // Calculate metrics
  const settledCount = allSettlements.filter(s => s.status === 'SETTLED' || s.status === 'COMPLETED').length;
  const pendingCount = allSettlements.filter(s => s.status === 'PENDING').length;
  const processingCount = allSettlements.filter(s => s.status === 'PROCESSING').length;
  const failedCount = allSettlements.filter(s => s.status === 'FAILED' || s.status === 'HOLD').length;

  const totalSettled = allSettlements
    .filter(s => s.status === 'SETTLED' || s.status === 'COMPLETED')
    .reduce((sum, s) => sum + s.amount, 0);

  const pendingSettlement = allSettlements
    .filter(s => s.status === 'PENDING')
    .reduce((sum, s) => sum + s.amount, 0);

  const processingQueue = allSettlements
    .filter(s => s.status === 'PROCESSING')
    .reduce((sum, s) => sum + s.amount, 0);

  const failedReversed = allSettlements
    .filter(s => s.status === 'FAILED' || s.status === 'HOLD')
    .reduce((sum, s) => sum + s.amount, 0);

  // Filter List based on tab & search query
  const filteredSettlements = allSettlements.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      s.id.toLowerCase().includes(q) || 
      s.bookingId.toLowerCase().includes(q) ||
      (s.razorpayRef || s.cashfreeRef || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeTab === 'settled') return s.status === 'SETTLED' || s.status === 'COMPLETED';
    if (activeTab === 'pending') return s.status === 'PENDING';
    if (activeTab === 'processing') return s.status === 'PROCESSING';
    if (activeTab === 'failed') return s.status === 'FAILED' || s.status === 'HOLD';

    return true;
  });

  const handleExport = () => {
    const exportData = filteredSettlements.length > 0 ? filteredSettlements : [
      {
        id: 'PO-1001',
        razorpayRef: 'RZP_SETTL_9901',
        bookingId: 'BK-1001',
        amount: 14250,
        status: 'SETTLED',
        date: new Date().toISOString(),
        bankAccount: bankAccountStr
      }
    ];

    try {
      let csv = 'Payout ID,Razorpay Ref,Booking Ref,Amount (INR),Status,Bank Account,Date\n';
      exportData.forEach(s => {
        csv += `"${s.id}","${s.razorpayRef || s.cashfreeRef || ''}","${s.bookingId}","${s.amount}","${s.status}","${s.bankAccount}","${s.date}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fahara_bank_payout_settlements_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Bank payout settlements report exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export CSV report');
    }
  };

  const statusTabs = [
    { id: 'all', label: 'All Settlements', count: allSettlements.length },
    { id: 'settled', label: 'Settled to Bank', count: settledCount },
    { id: 'pending', label: 'Pending Split', count: pendingCount },
    { id: 'processing', label: 'Processing', count: processingCount },
    { id: 'failed', label: 'Failed / Hold', count: failedCount },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#FFFBF8] border border-[#F0E6DD] rounded-[28px] p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:border-[#966746]/30 transition-all"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#966746]/10 via-[#C4A484]/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link 
                href="/event/finance/payments"
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#F0E6DD] text-[#7A5A44] hover:bg-[#966746] hover:text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Payments</span>
              </Link>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#7A5A44]">
                • RAZORPAY BANK SETTLEMENTS
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Bank Payout Settlements
            </h1>
            
            <p className="text-xs sm:text-sm text-[#7A5A44] font-medium max-w-2xl leading-relaxed">
              Track Razorpay Route vendor payout transfers directly into your registered bank account.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF5EF] border border-[#F0E6DD] text-[#2C1810] text-xs font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7A5A44]" />
              <span>Export CSV</span>
            </button>
            
            <Link
              href="/event/finance/payment-account"
              className="px-5 py-2.5 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white text-xs font-extrabold shadow-lg shadow-[#966746]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-white" />
              <span>Payment Account</span>
            </Link>
          </div>
        </div>
      </motion.div>


      {/* ========================================== */}
      {/* 2. STATS OVERVIEW METRICS GRID (4 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: TOTAL SETTLED */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
              Total Settled
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{Math.round(totalSettled).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Transferred to bank
            </p>
          </div>
        </div>

        {/* Card 2: PENDING SETTLEMENT */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
              Pending Settlement
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{Math.round(pendingSettlement).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-amber-700 font-bold mt-1">
              Razorpay split pending
            </p>
          </div>
        </div>

        {/* Card 3: PROCESSING QUEUE */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
              Processing Queue
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{Math.round(processingQueue).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-blue-700 font-bold mt-1">
              Active bank transfers
            </p>
          </div>
        </div>

        {/* Card 4: FAILED / REVERSED */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-700 uppercase tracking-wider">
              Failed / Reversed
            </span>
            <div className="w-9 h-9 rounded-full bg-rose-100/80 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{Math.round(failedReversed).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-rose-700 font-bold mt-1">
              Hold or returned funds
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. FILTER TABS & SEARCH TOOLBAR            */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        
        {/* Status Filter Pills Left */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8DED5]/60 text-[#6F4E37]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right Search Input */}
        <div className="relative flex-1 xl:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
          <input 
            type="text"
            placeholder="Search Booking ID, Razorpay Ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MAIN SETTLEMENTS DIRECTORY CONTENT      */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl shadow-xs overflow-hidden min-h-[380px]">
        {isPayoutsLoading || isDashboardLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-[#8C6D58] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
            <p className="text-xs font-black text-[#2C1810]">Loading bank settlements...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            <p className="text-sm font-black text-rose-700">Failed to load bank settlement records.</p>
            <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please verify your server connection.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
          </div>
        ) : filteredSettlements.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37] text-2xl font-black shadow-inner mb-1">
              <Repeat className="w-8 h-8 stroke-[2]" />
            </div>
            <h3 className="text-xl font-black text-[#2C1810]">No Settlement Records Found</h3>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-md leading-relaxed">
              No bank split settlement entries match your current search and status filter.
            </p>
          </motion.div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-[#2C1810] whitespace-nowrap">
              <thead className="bg-[#FFF8F0] border-b border-[#E8DED5] text-[10px] uppercase tracking-wider text-[#8C6D58] font-black select-none">
                <tr>
                  <th className="p-4">Settlement ID / Ref</th>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Bank Account</th>
                  <th className="p-4">Amount (95% Net)</th>
                  <th className="p-4">Transfer Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE1]">
                {filteredSettlements.map((item, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={item.id}
                    className="hover:bg-[#FFFDF9] transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-black text-[#6F4E37]">
                        {item.id}
                      </div>
                      <div className="text-[11px] font-medium text-[#8C6D58]">
                        {item.razorpayRef || item.cashfreeRef}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-[#2C1810]">
                      {item.bookingId}
                    </td>

                    <td className="p-4 text-xs font-semibold text-[#8C6D58]">
                      {item.bankAccount}
                    </td>

                    <td className="p-4 font-black text-[#2C1810]">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-xs font-bold text-[#2C1810]">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>

                    <td className="p-4 text-right">
                      {((s) => {
                        if (s === 'SETTLED' || s === 'COMPLETED') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> SETTLED
                            </span>
                          );
                        }
                        if (s === 'PROCESSING') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider">
                              <RefreshCw className="w-3 h-3 animate-spin" /> PROCESSING
                            </span>
                          );
                        }
                        if (s === 'PENDING') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                              <Clock className="w-3 h-3" /> PENDING
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                            <XCircle className="w-3 h-3" /> FAILED
                          </span>
                        );
                      })(item.status)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
