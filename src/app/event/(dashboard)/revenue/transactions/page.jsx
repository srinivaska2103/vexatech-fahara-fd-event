"use client";

import React, { useState } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import TransactionTable from '@/components/finance/TransactionTable';
import TransactionDetailsDrawer from '@/components/finance/TransactionDetailsDrawer';
import ExportReportModal from '@/components/finance/ExportReportModal';
import FinancialFilters from '@/components/finance/FinancialFilters';
import FinancialSearch from '@/components/finance/FinancialSearch';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { useFinanceStore } from '@/store/useFinanceStore';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

export default function TransactionsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const filters = useFinanceStore(state => state.filters);
  const pagination = useFinanceStore(state => state.pagination);
  const sort = useFinanceStore(state => state.sort);
  const searchQuery = useFinanceStore(state => state.searchQuery);
  const setSearchQuery = useFinanceStore(state => state.setSearchQuery);
  const setPagination = useFinanceStore(state => state.setPagination);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: dashboardData, isLoading } = useDashboardQueries();
  const rawBookings = dashboardData?.rawBookings || [];

  // Map bookings to transactions format
  let processed = rawBookings.map(b => ({
    id: b.id,
    booking_id: b.booking_number || b.id?.substring(0, 8),
    customer_name: b.customerName || b.customer_name || 'Anonymous',
    payment_method: 'razorpay',
    amount: Number(b.amount || b.total_amount || b.cafe_amount || b.event_service_amount || b.subtotal || 0),
    status: b.status || 'UNKNOWN',
    created_at: b.createdAt || b.created_at || b.date || b.booking_date
  }));

  // Apply Search
  if (debouncedSearch) {
    const q = debouncedSearch.toLowerCase();
    processed = processed.filter(t => 
      t.id?.toLowerCase().includes(q) || 
      t.booking_id?.toLowerCase().includes(q) || 
      t.customer_name?.toLowerCase().includes(q)
    );
  }

  // Apply Status Filter
  if (filters.status && filters.status !== 'all') {
    processed = processed.filter(t => t.status.toLowerCase() === filters.status.toLowerCase());
  }

  // Apply Sorting
  processed.sort((a, b) => {
    let valA = a[sort.field];
    let valB = b[sort.field];
    
    if (sort.field === 'created_at' || sort.field === 'date') {
      valA = new Date(valA || 0).getTime();
      valB = new Date(valB || 0).getTime();
    }
    
    if (valA < valB) return sort.order === 'asc' ? -1 : 1;
    if (valA > valB) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });

  const totalTransactions = processed.length;
  const startIndex = (pagination.page - 1) * pagination.limit;
  const transactions = processed.slice(startIndex, startIndex + pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all your payment transactions.</p>
        </div>
        <button 
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border mb-6">
        <Link href="/event/revenue" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Overview</Link>
        <Link href="/event/revenue/transactions" className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">Transactions</Link>
        <Link href="/event/revenue/payouts" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Payouts</Link>
        <Link href="/event/revenue/invoices" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Invoices & Receipts</Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-96">
          <FinancialSearch 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search by Transaction ID, Customer, or Booking..." 
          />
        </div>
        <FinancialFilters />
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <TransactionTable 
          transactions={transactions} 
          isLoading={isLoading && !transactions.length} 
          onViewDetails={setSelectedTransaction}
        />
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + pagination.limit, totalTransactions)} of {totalTransactions} transactions
          </span>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 border border-border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={pagination.page === 1}
              onClick={() => setPagination(pagination.page - 1)}
            >
              Previous
            </button>
            <button 
              className="px-3 py-1 border border-border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={startIndex + pagination.limit >= totalTransactions}
              onClick={() => setPagination(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <ExportReportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} defaultTab="transactions" />
      <TransactionDetailsDrawer 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        transaction={selectedTransaction} 
      />
    </div>
  );
}
