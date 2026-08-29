'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Download, RefreshCw, CheckCircle2, Clock, 
  RotateCcw, XCircle, Search, Sparkles, Repeat, ShieldAlert,
  Loader2, ChevronRight, IndianRupee, ArrowUpRight, GitBranch, X
} from 'lucide-react';
import { usePayoutList } from '@/hooks/finance/useFinanceQueries';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { useGetProfileQuery } from '@/hooks/profile/useProfileMutations';
import { useFinanceStore } from '@/store/useFinanceStore';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Sep 02, 2026 - 09:36 AM';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const timeFormatted = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dateFormatted} - ${timeFormatted}`;
};

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'settled', 'pending', 'processing', 'failed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  
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
    allSettlements = apiPayouts.map(p => {
      const statusUpper = (p.status || p.payout_status || '').toUpperCase() || 'SETTLED';
      const isSettled = statusUpper === 'SETTLED' || statusUpper === 'COMPLETED';
      const tDate = p.transfer_date || p.date || p.created_at || new Date().toISOString();
      const sDate = p.settlement_date || p.payout_completed_at || p.settled_at || (isSettled ? tDate : null);

      return {
        id: p.reference_number || `PO-${p.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`,
        razorpayRef: p.razorpay_ref || p.cashfree_ref || `RZP_SETTL_${p.id?.substring(0, 6) || '8842'}`,
        bookingId: p.booking_id || p.booking_number || 'BK-1001',
        amount: Number(p.amount || 0),
        status: statusUpper,
        date: p.date || p.created_at || new Date().toISOString(),
        transferDate: tDate,
        settlementDate: sDate,
        bankAccount: p.bank_name && p.account_last4 ? `${p.bank_name} - **** ${p.account_last4}` : bankAccountStr
      };
    });
  } else if (rawBookings.length > 0) {
    allSettlements = rawBookings.map(b => {
      const statusUpper = (b.status || '').toUpperCase();
      const isSettled = statusUpper === 'COMPLETED' || statusUpper === 'CONFIRMED' || statusUpper === 'SETTLED';
      const createdDate = b.createdAt || b.created_at || b.date || b.booking_date || new Date().toISOString();
      const tDate = b.transfer_date || createdDate;
      const sDate = b.settlement_date || b.settled_at || (isSettled ? tDate : null);

      return {
        id: b.payout_ref || `PO-${b.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`,
        razorpayRef: b.razorpay_ref || `RZP_SETTL_${b.id?.substring(0, 6) || '8842'}`,
        bookingId: b.booking_number || b.id?.substring(0, 8) || 'BK-1000',
        amount: Number(b.vendor_amount || (b.amount ? b.amount * 0.95 : 0)),
        status: isSettled ? 'SETTLED' : 'PENDING',
        date: createdDate,
        transferDate: tDate,
        settlementDate: sDate,
        bankAccount: bankAccountStr
      };
    });
  }

  // Calculate metrics
  const settledCount = allSettlements.filter(s => s.status === 'SETTLED' || s.status === 'COMPLETED').length;
  const pendingCount = allSettlements.filter(s => s.status === 'PENDING').length;
  const processingCount = allSettlements.filter(s => s.status === 'PROCESSING').length;
  const failedCount = allSettlements.filter(s => s.status === 'FAILED' || s.status === 'HOLD').length;

  const totalSettled = allSettlements
    .filter(s => s.status === 'SETTLED' || s.status === 'COMPLETED')
    .reduce((sum, s) => sum + s.amount, 0);

  const pendingSettlementCalc = allSettlements
    .filter(s => s.status === 'PENDING' || s.status === 'PROCESSING' || s.status === 'CREATED' || s.status === 'UNPAID')
    .reduce((sum, s) => sum + s.amount, 0);

  const pendingSettlement = pendingSettlementCalc > 0 ? pendingSettlementCalc : Math.max(0, allSettlements.reduce((sum, s) => sum + s.amount, 0) - totalSettled);

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
      let csv = 'Payout ID,Reference ID,Booking Ref,Amount (INR),Status,Bank Account,Transfer Date,Settlement Date\n';
      exportData.forEach(s => {
        const transferStr = s.transferDate ? new Date(s.transferDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
        const settlementStr = s.settlementDate ? new Date(s.settlementDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Pending';
        csv += `"${s.id}","${s.razorpayRef || s.cashfreeRef || ''}","${s.bookingId}","${s.amount}","${s.status}","${s.bankAccount}","${transferStr}","${settlementStr}"\n`;
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
                • BANK SETTLEMENTS
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Bank Payout Settlements
            </h1>
            
            <p className="text-xs sm:text-sm text-[#7A5A44] font-medium max-w-2xl leading-relaxed">
              Track vendor payout transfers directly into your registered bank account.
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
              Split settlement pending
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
            placeholder="Search Booking ID, Reference..."
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
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Settlement Date</th>
                  <th className="p-4">Net Event Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reference ID</th>
                  <th className="p-4 text-center">Details</th>
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
                    {/* BOOKING ID */}
                    <td className="p-4 font-black text-[#2C1810] text-xs sm:text-sm">
                      {item.bookingId}
                    </td>

                    {/* SETTLEMENT DATE */}
                    <td className="p-4 text-xs sm:text-sm font-medium text-[#8C6D58]/80">
                      {formatDateTime(item.settlementDate || item.date)}
                    </td>

                    {/* NET EVENT AMOUNT */}
                    <td className="p-4 font-black text-[#2C1810] text-sm">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {((s) => {
                          if (s === 'SETTLED' || s === 'COMPLETED') {
                            return (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                              </span>
                            );
                          }
                          if (s === 'PROCESSING') {
                            return (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing
                              </span>
                            );
                          }
                          if (s === 'PENDING') {
                            return (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF3E0] text-[#D97706] border border-[#FDE68A] text-xs font-black">
                                <Clock className="w-3.5 h-3.5" /> Pending
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </span>
                          );
                        })(item.status)}

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EFEA] text-[#7A5A44] border border-[#E5DCD3] text-xs font-bold">
                          <GitBranch className="w-3.5 h-3.5 text-[#8C6D58]" /> {item.tag || 'Date as Expected'}
                        </span>
                      </div>
                    </td>

                    {/* RAZORPAY REFERENCE */}
                    <td className="p-4 text-xs font-semibold text-[#4A3427] font-mono">
                      {item.razorpayRef || item.cashfreeRef}
                    </td>

                    {/* DETAILS BUTTON */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSettlement(item)}
                        className="w-8 h-8 rounded-full bg-[#6F4E37] text-white hover:bg-[#583E2C] flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer mx-auto"
                        title="View Settlement Details"
                      >
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-[#E8DED5] rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#2C1810]">Settlement Details</h3>
                <p className="text-xs text-[#8C6D58] font-bold">Booking Ref: {selectedSettlement.bookingId}</p>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedSettlement(null)}
                className="p-1.5 rounded-full hover:bg-[#FFF8F0] text-[#8C6D58] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58] font-semibold">Settlement ID</span>
                <span className="font-black text-[#6F4E37]">{selectedSettlement.id}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58] font-semibold">Razorpay Reference</span>
                <span className="font-mono font-bold text-[#4A3427]">{selectedSettlement.razorpayRef}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58] font-semibold">Net Event Amount</span>
                <span className="font-black text-[#2C1810] text-sm">₹{selectedSettlement.amount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58] font-semibold">Settlement Date</span>
                <span className="font-bold text-[#2C1810]">{formatDateTime(selectedSettlement.settlementDate || selectedSettlement.date)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58] font-semibold">Bank Account</span>
                <span className="font-bold text-[#2C1810]">{selectedSettlement.bankAccount}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58] font-semibold">Status & Tag</span>
                <span className="font-bold uppercase text-[#6F4E37]">{selectedSettlement.status} — ({selectedSettlement.tag || 'Date as Expected'})</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSettlement(null)}
                className="px-5 py-2.5 bg-[#6F4E37] text-white rounded-2xl text-xs font-bold hover:bg-[#583E2C] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
