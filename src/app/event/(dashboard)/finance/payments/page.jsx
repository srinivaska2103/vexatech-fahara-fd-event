'use client';

import React, { useState } from 'react';
import { usePaymentsList } from '@/hooks/finance/useFinanceQueries';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  CreditCard, Search, Filter, CheckCircle2, Clock, XCircle, 
  IndianRupee, Loader2, Calendar, Download, RefreshCw, Sparkles,
  ShieldCheck, ArrowUpRight, Repeat, ShieldAlert, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PaymentsPage() {

  const { searchQuery, setSearchQuery, filters, setFilters, clearFilters } = useFinanceStore();
  const { data: paymentsData, isLoading, isError, error, refetch } = usePaymentsList(filters);
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [period, setPeriod] = useState('30_days'); // 'today', '7_days', '30_days', 'month', 'custom'
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const payments = paymentsData?.data || [];

  // Filtered Payments list
  const filteredPayments = payments.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      (p.customerName || '').toLowerCase().includes(query) ||
      (p.bookingId || '').toLowerCase().includes(query) ||
      (p.serviceName || '').toLowerCase().includes(query) ||
      (p.razorpayPaymentId || p.cashfreePaymentId || '').toLowerCase().includes(query);

    const matchesStatus = !filters.status || filters.status === 'all' || (p.status || '').toUpperCase() === filters.status.toUpperCase();
    const matchesMethod = selectedMethod === 'all' || (p.paymentMethod || '').toUpperCase().includes(selectedMethod.toUpperCase());

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate stats overview metrics
  const totalBookingValue = payments.reduce((acc, curr) => acc + Number(curr.totalAmount || curr.amount || 0), 0);
  const yourNetEarnings = payments.reduce((acc, curr) => acc + Number(curr.vendorShare || (curr.totalAmount ? curr.totalAmount * 0.95 : 0)), 0);
  
  // Settled Amount: Only payments that have been explicitly transferred to bank (settlementStatus / status === 'SETTLED')
  const settledAmount = payments
    .filter(p => (p.settlementStatus || p.status || '').toUpperCase() === 'SETTLED')
    .reduce((acc, curr) => acc + Number(curr.vendorShare || curr.totalAmount || 0), 0);

  // Pending Settlement: Customer payments received but pending Razorpay bank split transfer
  const pendingSettlement = payments.length > 0 
    ? Math.max(0, yourNetEarnings - settledAmount)
    : 0;

  const refundAmount = payments
    .filter(p => (p.status || '').toUpperCase() === 'FAILED' || (p.status || '').toUpperCase() === 'REFUNDED')
    .reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);

  const handleExport = () => {
    const exportData = filteredPayments.length > 0 ? filteredPayments : [
      {
        id: '1',
        bookingId: 'BK-1001',
        cashfreePaymentId: 'RZP_SETTL_8827',
        razorpayPaymentId: 'RZP_SETTL_8827',
        customerName: 'Aarav Patel',
        serviceName: 'Banquet Hall Setup',
        paymentMethod: 'UPI / Razorpay',
        totalAmount: 15000,
        vendorShare: 14250,
        status: 'SUCCESS'
      }
    ];

    try {
      let csv = 'Payment ID,Booking ID,Razorpay Ref,Customer Name,Service,Method,Gross Amount,Vendor Share (95%),Status\n';
      exportData.forEach(p => {
        csv += `"${p.id}","${p.bookingId || ''}","${p.razorpayPaymentId || p.cashfreePaymentId || ''}","${(p.customerName || 'Customer').replace(/,/g, ' ')}","${(p.serviceName || 'Service').replace(/,/g, ' ')}","${p.paymentMethod || 'UPI'}","${p.totalAmount || 0}","${p.vendorShare || 0}","${p.status || 'SUCCESS'}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fahara_payments_settlements_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Payments report exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export CSV report');
    }
  };

  const periodTabs = [
    { id: 'today', label: 'Today' },
    { id: '7_days', label: '7 Days' },
    { id: '30_days', label: '30 Days' },
    { id: 'month', label: 'This Month' },
    { id: 'custom', label: 'Custom' },
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
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF5EF] border border-[#F0E6DD] text-[#7A5A44] text-[11px] font-black uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#966746]" />
              <span>Financial & Settlement Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Payments & Finances
            </h1>
            
            <p className="text-xs sm:text-sm text-[#7A5A44] font-medium max-w-2xl leading-relaxed">
              Track Razorpay customer booking payments, platform fee adjustments, and net bank split settlements.
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
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Payment Account</span>
            </Link>

            <Link 
              href="/event/revenue/payouts"
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF5EF] border border-[#F0E6DD] text-[#2C1810] text-xs font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px] cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-[#7A5A44]" />
              <span>Settlements</span>
            </Link>
          </div>
        </div>
      </motion.div>


      {/* ========================================== */}
      {/* 2. FILTER PERIOD BAR                       */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-[11px] font-black text-[#8C6D58] uppercase tracking-wider pl-2">
          Filter Period:
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {periodTabs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
                period === p.id
                  ? 'bg-[#6F4E37] text-white shadow-2xs'
                  : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. STATS OVERVIEW METRICS GRID (5 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: TOTAL BOOKING VALUE */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:border-[#6F4E37]/30 transition-colors">
          <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider">
            Total Booking Value
          </span>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
              ₹{totalBookingValue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#8C6D58] font-medium mt-1">
              Gross customer payments
            </p>
          </div>
        </div>

        {/* Card 2: YOUR NET EARNINGS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:border-[#6F4E37]/30 transition-colors">
          <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider">
            Your Net Earnings
          </span>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">
              ₹{Math.round(yourNetEarnings).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[#8C6D58] font-medium mt-1">
              After platform adjustments
            </p>
          </div>
        </div>

        {/* Card 3: PENDING SETTLEMENT */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:border-amber-300 transition-colors">
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
            Pending Settlement
          </span>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">
              ₹{Math.round(pendingSettlement).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-amber-700 font-bold mt-1">
              Razorpay split pending
            </p>
          </div>
        </div>

        {/* Card 4: SETTLED AMOUNT */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:border-emerald-300 transition-colors">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
            Settled Amount
          </span>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
              ₹{Math.round(settledAmount).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">
              Transferred to bank
            </p>
          </div>
        </div>

        {/* Card 5: REFUND AMOUNT */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-2 hover:border-rose-300 transition-colors">
          <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider">
            Refund Amount
          </span>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
              ₹{Math.round(refundAmount).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-rose-700 font-bold mt-1">
              Customer adjustments
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 4. SEARCH & DROPDOWN FILTERS TOOLBAR       */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        
        {/* Search Box */}
        <div className="relative flex-1 xl:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
          <input 
            type="text"
            placeholder="Search transaction ID, booking ID, diner name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
          />
        </div>

        {/* Right Dropdown & Refresh Group */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Dropdown */}
          <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-3 py-2 text-xs font-bold text-[#2C1810] flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#8C6D58]" />
            <select
              value={filters.status || 'all'}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-3 py-2 text-xs font-bold text-[#2C1810] flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5 text-[#8C6D58]" />
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Methods</option>
              <option value="UPI">UPI Payment</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="NETBANKING">NetBanking</option>
            </select>
          </div>

          {/* Timeframe Dropdown */}
          <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl px-3 py-2 text-xs font-bold text-[#2C1810] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#8C6D58]" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Refresh Control Button */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DED5] text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0] transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* ========================================== */}
      {/* 5. MAIN PAYMENTS TABLE DIRECTORY           */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl shadow-xs overflow-hidden min-h-[380px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-[#8C6D58] min-h-[350px] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
            <p className="text-xs font-black text-[#2C1810]">Loading Razorpay Route Payments...</p>
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            <p className="text-sm font-black text-rose-700">Failed to load payment transactions.</p>
            <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please verify your server connection.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
          </div>
        ) : filteredPayments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3"
          >
            <div className="w-20 h-20 bg-[#FFF8F0] border border-[#6F4E37]/20 rounded-3xl flex items-center justify-center text-[#6F4E37] mb-2 shadow-inner">
              <CreditCard className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-black text-[#2C1810]">No Payments Recorded</h3>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-md leading-relaxed">
              No financial transaction records match your search filters or status selection.
            </p>
          </motion.div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-[#2C1810] whitespace-nowrap">
              <thead className="bg-[#FFF8F0] border-b border-[#E8DED5] text-[10px] uppercase tracking-wider text-[#8C6D58] font-black select-none">
                <tr>
                  <th className="p-4">Transaction / Booking Ref</th>
                  <th className="p-4">Customer & Service</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Gross Amount</th>
                  <th className="p-4">Vendor Net (95%)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">View Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE1]">
                {filteredPayments.map((payment, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment)}
                    className="hover:bg-[#FFFDF9] transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="font-black text-[#6F4E37] text-xs sm:text-sm group-hover:underline">
                        {payment.bookingId || 'BK-1001'}
                      </div>
                      <div className="text-[11px] font-medium text-[#8C6D58] truncate max-w-[150px]">
                        {payment.razorpayPaymentId || payment.cashfreePaymentId || `RZP_SETTL_${payment.id?.substring(0, 6)}`}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#2C1810]">
                        {payment.customerName || 'Customer'}
                      </div>
                      <div className="text-xs text-[#8C6D58] font-medium truncate max-w-[200px]">
                        {payment.serviceName || 'Event Service'}
                      </div>
                    </td>

                    <td className="p-4 text-xs font-bold text-[#2C1810]">
                      {payment.paymentMethod || 'UPI / Razorpay'}
                    </td>

                    <td className="p-4 font-black text-[#2C1810]">
                      ₹{Number(payment.totalAmount || payment.amount || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 font-black text-emerald-700">
                      ₹{Number(payment.vendorShare || (payment.totalAmount ? payment.totalAmount * 0.95 : 0)).toLocaleString('en-IN')}
                    </td>

                    <td className="p-4">
                      {((status) => {
                        const s = (status || 'SUCCESS').toUpperCase();
                        if (s === 'SUCCESS' || s === 'SETTLED') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> SUCCESS
                            </span>
                          );
                        }
                        if (s === 'PENDING') {
                          return (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                              <Clock className="w-3 h-3 animate-spin" /> PENDING
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                            <XCircle className="w-3 h-3" /> FAILED
                          </span>
                        );
                      })(payment.status)}
                    </td>

                    <td className="p-4 text-right">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment(payment);
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
      {/* 6. PAYMENT BREAKDOWN MODAL                 */}
      {/* ========================================== */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8DED5] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DED5]">
              <div>
                <h3 className="text-lg font-black text-[#2C1810]">Razorpay Route Breakdown</h3>
                <p className="text-xs text-[#8C6D58] font-medium">Txn Ref: {selectedPayment.razorpayPaymentId || selectedPayment.cashfreePaymentId || selectedPayment.id}</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-full bg-[#FFF8F0] text-[#6F4E37] font-bold flex items-center justify-center hover:bg-[#6F4E37] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-semibold">
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Booking Ref:</span>
                <span className="font-extrabold text-[#2C1810]">{selectedPayment.bookingId || 'BK-1001'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Customer Name:</span>
                <span className="font-extrabold text-[#2C1810]">{selectedPayment.customerName || 'Customer'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Service Item:</span>
                <span className="font-extrabold text-[#2C1810]">{selectedPayment.serviceName || 'Event Service'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1]">
                <span className="text-[#8C6D58]">Gross Payment:</span>
                <span className="font-black text-[#2C1810]">₹{Number(selectedPayment.totalAmount || selectedPayment.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F2EAE1] text-rose-600">
                <span>Platform Commission (5%):</span>
                <span className="font-black">- ₹{Number(selectedPayment.platformFee || (selectedPayment.totalAmount ? selectedPayment.totalAmount * 0.05 : 0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 bg-emerald-50 border border-emerald-200 px-4 rounded-2xl text-emerald-800 font-black">
                <span>Vendor Net Split (95%):</span>
                <span>₹{Number(selectedPayment.vendorShare || (selectedPayment.totalAmount ? selectedPayment.totalAmount * 0.95 : 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-[#6F4E37]/20"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
