'use client';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Filter } from 'lucide-react';

export default function FinancialFilters() {
  const { filters, setFilters, clearFilters, activeTab } = useFinanceStore();

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 shadow-sm flex-wrap sm:flex-nowrap">
        <Filter className="w-4 h-4 text-text/40" />
        
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ dateRange: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
        </select>

        <div className="w-px h-4 bg-border hidden sm:block"></div>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          {activeTab === 'transactions' && <option value="refunded">Refunded</option>}
        </select>
        
        {activeTab === 'transactions' && (
          <>
            <div className="w-px h-4 bg-border hidden sm:block"></div>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({ paymentMethod: e.target.value })}
              className="bg-transparent text-sm font-semibold text-text focus:outline-none"
            >
              <option value="all">All Methods</option>
              <option value="card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </>
        )}
      </div>
      
      {(filters.dateRange !== 'all' || filters.status !== 'all' || filters.paymentMethod !== 'all') && (
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-red-500 hover:text-red-700 underline shrink-0"
        >
          Clear
        </button>
      )}
    </div>
  );
}
