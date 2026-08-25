"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Download, Filter } from 'lucide-react';
import RevenueSummaryCard from '@/components/finance/RevenueSummaryCard';
import RevenueChart from '@/components/finance/RevenueChart';
import IncomeBreakdownCard from '@/components/finance/IncomeBreakdownCard';
import TransactionTable from '@/components/finance/TransactionTable';
import TransactionDetailsDrawer from '@/components/finance/TransactionDetailsDrawer';
import ExportReportModal from '@/components/finance/ExportReportModal';
import { useTransactionList } from '@/hooks/finance/useFinanceQueries';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { useFinanceStore } from '@/store/useFinanceStore';
import Link from 'next/link';

export default function FinanceDashboardPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const filters = useFinanceStore(state => state.filters);
  const pagination = useFinanceStore(state => state.pagination);
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardQueries();
  const { data: transactionsData, isLoading: isTransactionsLoading } = useTransactionList(filters, pagination);

  const rawBookings = dashboardData?.rawBookings || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Revenue & Finance</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your business revenue, transactions, and payouts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/event/revenue/transactions" className="px-4 py-2 bg-white border border-border text-text rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center">
            View All Transactions
          </Link>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border mb-6">
        <Link href="/event/revenue" className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">Overview</Link>
        <Link href="/event/revenue/transactions" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Transactions</Link>
        <Link href="/event/revenue/payouts" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Payouts</Link>
        <Link href="/event/revenue/invoices" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Invoices & Receipts</Link>
      </div>

      {/* Summary Cards */}
      <div className="mb-6">
        <RevenueSummaryCard />
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart bookings={rawBookings} title="Revenue Analytics" isLoading={isDashboardLoading} />
        </div>
        <div className="lg:col-span-1">
          <IncomeBreakdownCard bookings={rawBookings} isLoading={isDashboardLoading} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text">Recent Transactions</h2>
          <Link href="/event/revenue/transactions" className="text-sm text-primary font-medium hover:underline">View All</Link>
        </div>
        <TransactionTable 
          transactions={rawBookings.slice(0, 5).map(b => ({
            id: b.id,
            booking_id: b.booking_number || b.id?.substring(0, 8),
            customer_name: b.customerName || b.customer_name || 'Anonymous',
            payment_method: 'razorpay',
            amount: Number(b.amount || b.total_amount || b.cafe_amount || b.event_service_amount || b.subtotal || 0),
            status: b.status,
            created_at: b.createdAt || b.created_at || b.date || b.booking_date
          }))} 
          isLoading={isDashboardLoading} 
          onViewDetails={setSelectedTransaction}
        />
      </div>

      {/* Modals & Drawers */}
      <ExportReportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <TransactionDetailsDrawer 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        transaction={selectedTransaction} 
      />
    </div>
  );
}
