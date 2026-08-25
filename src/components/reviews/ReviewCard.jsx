import ReviewStatusBadge from './ReviewStatusBadge';
import StarRating from './StarRating';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden h-[240px]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
            {review.customer_name?.charAt(0) || 'C'}
          </div>
          <div>
            <h3 className="font-bold text-text text-sm leading-tight group-hover:text-primary transition-colors truncate max-w-[150px]">
              <Link href={`/event/reviews/${review.id}`} className="after:absolute after:inset-0">
                {review.customer_name || 'Anonymous'}
              </Link>
            </h3>
            <p className="text-xs text-text/50 mt-0.5 truncate max-w-[150px]">
              {review.service_name || 'Event Service'}
            </p>
          </div>
        </div>
        <ReviewStatusBadge status={review.status || 'PUBLISHED'} />
      </div>

      <div className="mb-2">
        <StarRating rating={review.rating} />
      </div>
      
      <p className="text-sm text-text/70 line-clamp-3 mb-4 leading-relaxed">
        "{review.content || 'No review text provided.'}"
      </p>

      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between z-10">
        <div className="text-xs font-bold text-text/50 uppercase tracking-wider flex items-center gap-2">
          {review.created_at ? format(new Date(review.created_at), 'MMM d, yyyy') : 'Recent'}
          
          {review.reply_text && (
            <>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span className="text-green-600 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> Replied
              </span>
            </>
          )}
        </div>
        <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transform">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
