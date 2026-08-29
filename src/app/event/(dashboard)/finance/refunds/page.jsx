'use client';

import React, { useState } from 'react';
import { useRefundList } from '@/hooks/finance/useFinanceQueries';
import { 
  ArrowLeft, Download, RefreshCw, CheckCircle2, Clock, 
  RotateCcw, XCircle, Search, Sparkles, Info, ShieldAlert,
  Loader2, ChevronRight, IndianRupee
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'completed', 'pending', 'processing', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefund, setSelectedRefund] = useState(null);

  const { data: refundsData, isLoading, isError, error, refetch } = useRefundList();

  const refundsList = refundsData?.data || [
    {
      id: 'RFD-1092',
      bookingId: 'EVT-BK-1052',
      customerName: 'Kavita Menon',
      serviceName: 'Private Garden Photography Setup',
      originalAmount: 15000,
      refundAmount: 15000,
      reason: 'Customer cancelled booking 48 hours prior to event.',
      initiatedBy: 'Customer Request',
      status: 'COMPLETED',
      createdAt: '2026-08-14T14:20:00Z',
    },
    {
      id: 'RFD-1091',
      bookingId: 'EVT-BK-1049',
      customerName: 'Sameer Kulkarni',
      serviceName: 'Cocktail Bar Tender Package',
      originalAmount: 12000,
      refundAmount: 6000,
      reason: 'Partial cancellation - venue size changed',
      initiatedBy: 'Event Manager',
      status: 'COMPLETED',
      createdAt: '2026-08-11T10:15:00Z',
    },
    {
      id: 'RFD-1090',
      bookingId: 'EVT-BK-1045',
      customerName: 'Tanya Bansal',
      serviceName: 'Acoustic Band Live Performance',
      originalAmount: 25000,
      refundAmount: 25000,
      reason: 'Unavoidable weather disruption',
      initiatedBy: 'Mutual Agreement',
      status: 'PENDING',
      createdAt: '2026-08-16T16:00:00Z',
    }
  ];

  // Calculate metrics
  const completedRefunds = refundsList.filter(r => (r.status || '').toUpperCase() === 'COMPLETED' || (r.status || '').toUpperCase() === 'PROCESSED');
  const pendingRefunds = refundsList.filter(r => (r.status || '').toUpperCase() === 'PENDING');
  const processingRefunds = refundsList.filter(r => (r.status || '').toUpperCase() === 'PROCESSING');
  const rejectedRefunds = refundsList.filter(r => (r.status || '').toUpperCase() === 'REJECTED' || (r.status || '').toUpperCase() === 'FAILED');

  const totalRefunded = completedRefunds.reduce((acc, curr) => acc + (curr.refundAmount || curr.amount || 0), 0);
  const pendingAmount = pendingRefunds.reduce((acc, curr) => acc + (curr.refundAmount || curr.amount || 0), 0);

  // Filter list based on active tab and search query
  const filteredRefunds = refundsList.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (r.id || '').toLowerCase().includes(q) ||
      (r.bookingId || '').toLowerCase().includes(q) ||
      (r.customerName || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    const status = (r.status || '').toUpperCase();
    if (activeTab === 'completed') return status === 'COMPLETED' || status === 'PROCESSED';
    if (activeTab === 'pending') return status === 'PENDING';
    if (activeTab === 'processing') return status === 'PROCESSING';
    if (activeTab === 'rejected') return status === 'REJECTED' || status === 'FAILED';

    return true;
  });

  const handleExport = () => {
    const exportData = filteredRefunds.length > 0 ? filteredRefunds : [
      {
        id: 'RFD-1092',
        bookingId: 'EVT-BK-1052',
        customerName: 'Kavita Menon',
        refundAmount: 15000,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      }
    ];

    try {
      let csv = 'Refund ID,Booking Ref,Customer Name,Refund Amount (INR),Status,Date\n';
      exportData.forEach(r => {
        csv += `"${r.id}","${r.bookingId || ''}","${(r.customerName || 'Customer').replace(/,/g, ' ')}","${r.refundAmount || 0}","${r.status || 'COMPLETED'}","${r.createdAt || ''}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fahara_refunds_adjustments_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Customer refunds report exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export CSV report');
    }
  };

  const statusTabs = [
    { id: 'all', label: 'All Refunds', count: refundsList.length },
    { id: 'completed', label: 'Completed Refund', count: completedRefunds.length },
    { id: 'pending', label: 'Pending Request', count: pendingRefunds.length },
    { id: 'processing', label: 'Processing', count: processingRefunds.length },
    { id: 'rejected', label: 'Failed / Rejected', count: rejectedRefunds.length },
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
                • REFUNDS MANAGEMENT
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Customer Refunds & Adjustments
            </h1>
            
            <p className="text-xs sm:text-sm text-[#7A5A44] font-medium max-w-2xl leading-relaxed">
              Monitor, initiate, and audit payment gateway refunds for event booking cancellations.
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
              href="/event/finance/payments"
              className="px-5 py-2.5 rounded-2xl bg-[#966746] hover:bg-[#85593A] text-white text-xs font-extrabold shadow-lg shadow-[#966746]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>Payments Studio</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* 2. STATS OVERVIEW METRICS GRID (4 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: TOTAL REFUNDED */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-700 uppercase tracking-wider">
              Total Refunded
            </span>
            <div className="w-9 h-9 rounded-full bg-rose-100/80 text-rose-700 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{totalRefunded.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-rose-700 font-bold mt-1">
              {completedRefunds.length} Completed refunds
            </p>
          </div>
        </div>

        {/* Card 2: PENDING REQUESTS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-amber-700 font-bold mt-1">
              Awaiting processing
            </p>
          </div>
        </div>

        {/* Card 3: PROCESSED ADJUSTMENTS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
              Processed Adjustments
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {completedRefunds.length}
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Successful refunds
            </p>
          </div>
        </div>

        {/* Card 4: FAILED / REJECTED */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#6F4E37]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#8C6D58] uppercase tracking-wider">
              Failed / Rejected
            </span>
            <div className="w-9 h-9 rounded-full bg-[#F3EFEA] text-[#6F4E37] flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {rejectedRefunds.length}
            </div>
            <p className="text-xs text-[#8C6D58] font-bold mt-1">
              Rejected claims
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 4. FILTER TABS & SEARCH TOOLBAR            */}
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
            placeholder="Search Booking ID, Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 5. MAIN REFUNDS TABLE DIRECTORY            */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl shadow-xs overflow-hidden min-h-[380px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-[#8C6D58] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
            <p className="text-xs font-black text-[#2C1810]">Loading customer refund logs...</p>
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            <p className="text-sm font-black text-rose-700">Failed to load refund activity.</p>
            <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please verify your server connection.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
          </div>
        ) : filteredRefunds.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-3xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37] shadow-inner mb-1">
              <RotateCcw className="w-8 h-8 stroke-[2]" />
            </div>
            <h3 className="text-xl font-black text-[#2C1810]">No Refund Records Found</h3>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-md leading-relaxed">
              No refund requests match your current search terms or filter selection.
            </p>
          </motion.div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-[#2C1810] whitespace-nowrap">
              <thead className="bg-[#FFF8F0] border-b border-[#E8DED5] text-[10px] uppercase tracking-wider text-[#8C6D58] font-black select-none">
                <tr>
                  <th className="p-4">Refund ID / Booking</th>
                  <th className="p-4">Customer & Service</th>
                  <th className="p-4">Original Amount</th>
                  <th className="p-4">Refund Amount</th>
                  <th className="p-4">Reason / Notes</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE1]">
                {filteredRefunds.map((r, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={r.id}
                    onClick={() => setSelectedRefund(r)}
                    className="hover:bg-[#FFFDF9] transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="font-black text-[#6F4E37]">
                        {r.id}
                      </div>
                      <div className="text-[11px] font-medium text-[#8C6D58]">
                        {r.bookingId}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#2C1810]">
                        {r.customerName}
                      </div>
                      <div className="text-xs text-[#8C6D58] font-medium truncate max-w-[180px]">
                        {r.serviceName}
                      </div>
                    </td>

                    <td className="p-4 text-xs font-semibold text-[#8C6D58]">
                      ₹{Number(r.originalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 font-black text-rose-700">
                      ₹{Number(r.refundAmount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 text-xs font-medium text-[#8C6D58] truncate max-w-[200px]">
                      {r.reason}
                    </td>

                    <td className="p-4">
                      {((s) => {
                        const st = (s || 'COMPLETED').toUpperCase();
                        if (st === 'COMPLETED' || st === 'PROCESSED') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> PROCESSED
                            </span>
                          );
                        }
                        if (st === 'PENDING' || st === 'PROCESSING') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                              <Clock className="w-3 h-3 animate-spin" /> PENDING
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                            <XCircle className="w-3 h-3" /> REJECTED
                          </span>
                        );
                      })(r.status)}
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRefund(r);
                        }}
                        className="p-2 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/20 transition-all shadow-2xs"
                        title="View Details"
                      >
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 6. REFUND DETAIL BREAKDOWN MODAL           */}
      {/* ========================================== */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8DED5] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DED5]">
              <div>
                <h3 className="text-lg font-black text-[#2C1810]">Refund Adjustment Record</h3>
                <p className="text-xs text-[#8C6D58] font-medium">Ref: {selectedRefund.id}</p>
              </div>
              <button
                onClick={() => setSelectedRefund(null)}
                className="w-8 h-8 rounded-full bg-[#FFF8F0] text-[#6F4E37] font-bold flex items-center justify-center hover:bg-[#6F4E37] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-semibold">
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Booking Ref:</span>
                <span className="font-extrabold text-[#2C1810]">{selectedRefund.bookingId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Customer:</span>
                <span className="font-extrabold text-[#2C1810]">{selectedRefund.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Initiated By:</span>
                <span className="font-extrabold text-[#2C1810]">{selectedRefund.initiatedBy || 'Customer Request'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Original Booking Amount:</span>
                <span className="font-extrabold text-[#2C1810]">₹{Number(selectedRefund.originalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 bg-rose-50 border border-rose-200 px-4 rounded-2xl text-rose-800 font-black">
                <span>Refund Adjustment Amount:</span>
                <span>₹{Number(selectedRefund.refundAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-[#FFF8F0] border border-[#E8DED5] rounded-2xl text-xs text-[#8C6D58]">
                <span className="font-bold block text-[#2C1810] mb-1">Reason:</span>
                {selectedRefund.reason || 'No specific notes provided.'}
              </div>
            </div>

            <button
              onClick={() => setSelectedRefund(null)}
              className="w-full py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-[#6F4E37]/20"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
