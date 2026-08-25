'use client';
import { useReviewStore } from '@/store/useReviewStore';
import { Search } from 'lucide-react';

export default function ReviewSearch() {
  const { searchQuery, setSearchQuery } = useReviewStore();

  return (
    <div className="relative flex-1 w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
      <input 
        type="text"
        placeholder="Search reviews by customer or service..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
      />
    </div>
  );
}
