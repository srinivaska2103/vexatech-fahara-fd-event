'use client';
import { useReviewStore } from '@/store/useReviewStore';
import { Filter } from 'lucide-react';

export default function ReviewFilters() {
  const { filters, setFilters, clearFilters } = useReviewStore();

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 shadow-sm flex-wrap sm:flex-nowrap">
        <Filter className="w-4 h-4 text-text/40" />
        
        <select
          value={filters.rating}
          onChange={(e) => setFilters({ rating: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <div className="w-px h-4 bg-border hidden sm:block"></div>
        
        <select
          value={filters.replyStatus}
          onChange={(e) => setFilters({ replyStatus: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none"
        >
          <option value="all">All Reviews</option>
          <option value="replied">Replied</option>
          <option value="unreplied">Needs Reply</option>
        </select>
        
        <div className="w-px h-4 bg-border hidden sm:block"></div>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>
      
      {(filters.rating !== 'all' || filters.replyStatus !== 'all' || filters.status !== 'all') && (
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
