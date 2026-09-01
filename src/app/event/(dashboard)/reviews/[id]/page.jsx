'use client';
import { use } from 'react';
import Link from 'next/link';
import { useReviewDetails } from '@/hooks/reviews/useReviewQueries';
import ReviewDetailsCard from '@/components/reviews/ReviewDetailsCard';
import ReviewGallery from '@/components/reviews/ReviewGallery';
import ReviewTimeline from '@/components/reviews/ReviewTimeline';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ReviewDetailsPage({ params }) {
  const { id } = use(params);
  
  const { data: review, isLoading, error } = useReviewDetails(id);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-semibold text-text/50">Loading review details...</p>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-red-500">
        <p className="font-semibold">Failed to load review details.</p>
        <Link href="/event/reviews" className="mt-4 text-primary underline">Back to Reviews</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="mb-4">
          <Link href="/event/reviews" className="inline-flex items-center gap-2 text-sm font-semibold text-text/50 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Reviews
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReviewDetailsCard review={review} />
            <ReviewGallery images={review.images || []} />
          </div>

          <div>
            <ReviewTimeline review={review} />
          </div>
        </div>
      </div>
    </div>
  );
}
