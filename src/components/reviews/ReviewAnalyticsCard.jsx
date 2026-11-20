'use client';

import { useReviewAnalytics } from '@/hooks/reviews/useReviewQueries';
import { TrendingUp, MessageCircle, Clock, Sparkles, Loader2 } from 'lucide-react';

export default function ReviewAnalyticsCard() {
  const { data: analytics, isLoading } = useReviewAnalytics();

  if (isLoading) {
    return (
      <div className="bg-white border border-[#FEE2E2] rounded-3xl p-6 shadow-xs flex items-center justify-center min-h-[220px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E50914]" />
      </div>
    );
  }

  const data = analytics || {
    responseRate: 0,
    avgResponseTime: 'N/A',
    mostRatedService: 'None yet',
    customerSentiment: 'N/A'
  };

  return (
    <div className="bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-7 shadow-xs h-full flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center text-[#E50914]">
          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
        </div>
        <h3 className="text-xs font-black text-[#252525] uppercase tracking-wider">Analytics & Response</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#757575] mb-1">
            <MessageCircle className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Response Rate</span>
          </div>
          <div className="text-2xl font-black text-[#252525]">{data.responseRate}%</div>
        </div>

        <div className="bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#757575] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Response Time</span>
          </div>
          <div className="text-lg font-black text-[#252525] truncate">{data.avgResponseTime}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F2EAE1] flex items-center justify-between text-xs">
        <span className="text-[#757575] font-bold">Most Rated Service:</span>
        <span className="font-black text-[#252525] bg-[#FFF5F5] px-2.5 py-0.5 rounded-full border border-[#E50914]/20 truncate max-w-[130px]">
          {data.mostRatedService}
        </span>
      </div>
    </div>
  );
}
