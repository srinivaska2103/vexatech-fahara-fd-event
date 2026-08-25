import ReviewStatusBadge from './ReviewStatusBadge';
import StarRating from './StarRating';
import { format } from 'date-fns';
import { Calendar, User, ShoppingBag } from 'lucide-react';

export default function ReviewDetailsCard({ review }) {
  if (!review) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xl text-primary shrink-0">
            {review.customer_name?.charAt(0) || 'C'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text flex items-center gap-2">
              {review.customer_name || 'Anonymous Customer'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-text/50 mt-1">
              <User className="w-4 h-4" /> ID: #{review.customer_id || 'Unknown'}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ReviewStatusBadge status={review.status || 'PUBLISHED'} />
          <div className="text-xs font-bold text-text/50">
            {review.created_at ? format(new Date(review.created_at), 'MMMM d, yyyy') : 'Recent'}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <StarRating rating={review.rating} size="w-6 h-6" />
          <span className="text-lg font-bold text-text">{review.rating}.0</span>
        </div>
        <p className="text-base text-text leading-relaxed whitespace-pre-wrap">
          {review.content || 'No text content provided in this review.'}
        </p>
      </div>

      <div className="bg-background border border-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text/50 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/40 uppercase">Service Booked</div>
            <div className="text-sm font-semibold text-text">{review.service_name || 'Event Service'}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text/50 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/40 uppercase">Booking ID</div>
            <div className="text-sm font-semibold text-text">#{review.booking_id || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
