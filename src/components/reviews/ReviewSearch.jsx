'use client';
import { useReviewStore } from '@/store/useReviewStore';
import { Search } from 'lucide-react';

export default function ReviewSearch() {
  const { searchQuery, setSearchQuery } = useReviewStore();

  return (
    <div className="relative flex-1 w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
      <input 
        type="text"
        placeholder="Search reviews by customer or service..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#252525] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/15 transition-all"
      />
    </div>
  );
}
