'use client';

import { ThumbsUp, ThumbsDown, MessageSquareText, Loader2 } from 'lucide-react';
import { useReviewAnalytics } from '@/hooks/reviews/useReviewQueries';

export default function CustomerFeedbackCard() {
  const { data: analytics, isLoading } = useReviewAnalytics();

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const feedback = analytics?.feedback || {};
  const positiveList = Array.isArray(feedback.positive) ? feedback.positive : [];
  const negativeList = Array.isArray(feedback.negative) ? feedback.negative : [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 flex items-center gap-2">
        <MessageSquareText className="w-4 h-4 text-text/50" /> Sentiment Analysis
      </h3>

      <div className="space-y-6 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-3 text-green-600">
            <ThumbsUp className="w-4 h-4" />
            <h4 className="text-sm font-bold uppercase tracking-wider">Top Praises</h4>
          </div>
          {positiveList.length > 0 ? (
            <ul className="space-y-2">
              {positiveList.map((item, idx) => (
                <li key={idx} className="text-sm text-text/70 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text/50 italic">No praise data recorded yet.</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <ThumbsDown className="w-4 h-4" />
            <h4 className="text-sm font-bold uppercase tracking-wider">Common Complaints</h4>
          </div>
          {negativeList.length > 0 ? (
            <ul className="space-y-2">
              {negativeList.map((item, idx) => (
                <li key={idx} className="text-sm text-text/70 flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text/50 italic">No significant complaints detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
