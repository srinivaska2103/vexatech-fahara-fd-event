'use client';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Search } from 'lucide-react';

export default function FinancialSearch() {
  const { searchQuery, setSearchQuery } = useFinanceStore();

  return (
    <div className="relative flex-1 w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
      <input 
        type="text"
        placeholder="Search (Transaction ID, Customer)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
      />
    </div>
  );
}
