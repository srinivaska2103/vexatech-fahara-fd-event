'use client';

import { useReviewAnalytics } from '@/hooks/reviews/useReviewQueries';
import { TrendingUp, MessageCircle, Clock, Sparkles, Loader2 } from 'lucide-react';

export default function ReviewAnalyticsCard() {
  const { data: analytics, isLoading } = useReviewAnalytics();

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 shadow-xs flex items-center justify-center min-h-[220px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
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
    <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs h-full flex flex-col justify-between select-none relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center text-[#6F4E37]">
          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
        </div>
        <h3 className="text-xs font-black text-[#2C1810] uppercase tracking-wider">Analytics & Response</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#8C6D58] mb-1">
            <MessageCircle className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Response Rate</span>
          </div>
          <div className="text-2xl font-black text-[#2C1810]">{data.responseRate}%</div>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#8C6D58] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Response Time</span>
          </div>
          <div className="text-lg font-black text-[#2C1810] truncate">{data.avgResponseTime}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F2EAE1] flex items-center justify-between text-xs">
        <span className="text-[#8C6D58] font-bold">Most Rated Service:</span>
        <span className="font-black text-[#2C1810] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#6F4E37]/20 truncate max-w-[130px]">
          {data.mostRatedService}
        </span>
      </div>
    </div>
  );
}
