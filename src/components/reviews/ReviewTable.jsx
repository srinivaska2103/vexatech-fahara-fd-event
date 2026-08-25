'use client';
import { useReviewStore } from '@/store/useReviewStore';
import ReviewStatusBadge from './ReviewStatusBadge';
import StarRating from './StarRating';
import { Eye, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function ReviewTable({ reviews }) {
  const { selectedReviewIds, toggleReviewSelection, selectAllReviews } = useReviewStore();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      selectAllReviews(reviews.map(r => r.id));
    } else {
      selectAllReviews([]);
    }
  };

  return (
    <div className="w-full bg-white border border-[#E8DED5] rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#2C1810] whitespace-nowrap">
          <thead className="bg-[#FFF8F0] border-b border-[#E8DED5] text-[10px] uppercase tracking-wider text-[#8C6D58] font-black select-none">
            <tr>
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-md border-[#E8DED5] text-[#6F4E37] focus:ring-[#6F4E37]"
                  checked={reviews.length > 0 && selectedReviewIds.length === reviews.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4">Customer & Service</th>
              <th className="p-4">Star Rating</th>
              <th className="p-4 hidden sm:table-cell">Review Date</th>
              <th className="p-4">Status & Response</th>
              <th className="p-4 text-right">View Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EAE1]">
            {reviews.map((review, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                key={review.id} 
                className="hover:bg-[#FFFDF9] transition-colors group cursor-pointer"
              >
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-md border-[#E8DED5] text-[#6F4E37] focus:ring-[#6F4E37]"
                    checked={selectedReviewIds.includes(review.id)}
                    onChange={() => toggleReviewSelection(review.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center font-black text-[#6F4E37] text-sm shadow-2xs shrink-0">
                      {review.customer_name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="max-w-[200px] sm:max-w-[300px]">
                      <div className="font-bold text-[#2C1810] text-sm group-hover:text-[#6F4E37] transition-colors truncate">
                        {review.customer_name || 'Guest Reviewer'}
                      </div>
                      <div className="text-xs text-[#8C6D58] font-medium truncate">{review.service_name || 'Event Booking'}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <StarRating rating={review.rating} />
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <span className="text-xs font-bold text-[#2C1810]">
                    {(() => {
                      const d = review.created_at || review.createdAt || review.date;
                      try {
                        return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recent';
                      } catch (e) {
                        return 'Recent';
                      }
                    })()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    <ReviewStatusBadge status={review.status || 'PUBLISHED'} />
                    {review.reply_text ? (
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                        <MessageCircle className="w-3 h-3" /> Replied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider">
                        Needs Reply
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/event/reviews/${review.id}`} 
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/20 transition-all shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
