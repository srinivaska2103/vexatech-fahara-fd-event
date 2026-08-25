'use client';

import StarRating from './StarRating';
import { useRatingSummary } from '@/hooks/reviews/useReviewQueries';
import { Loader2, Star } from 'lucide-react';

export default function RatingSummaryCard() {
  const { data: summary, isLoading } = useRatingSummary();

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 shadow-xs flex items-center justify-center min-h-[220px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
      </div>
    );
  }

  const averageRating = Number(summary?.averageRating || 0);
  const totalReviews = Number(summary?.totalReviews || 0);
  const distribution = summary?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs h-full flex flex-col md:flex-row items-center gap-8 relative overflow-hidden select-none">
      <div className="flex flex-col items-center justify-center shrink-0">
        <div className="w-20 h-20 rounded-3xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex flex-col items-center justify-center mb-3 shadow-inner">
          <h2 className="text-3xl font-black text-[#2C1810] leading-none">{averageRating.toFixed(1)}</h2>
        </div>
        <StarRating rating={Math.round(averageRating)} size="w-4 h-4" />
        <p className="text-xs font-black text-[#8C6D58] mt-2 uppercase tracking-wider">{totalReviews} Total Reviews</p>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars] || distribution[String(stars)] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={stars} className="flex items-center gap-3 text-xs font-bold">
              <div className="w-10 font-extrabold text-[#2C1810] flex items-center gap-1 shrink-0">
                <span>{stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              </div>
              <div className="flex-1 h-2.5 bg-[#FFF8F0] border border-[#E8DED5] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    stars >= 4 ? 'bg-amber-500' : stars === 3 ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-8 text-right font-black text-[#8C6D58] shrink-0">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
