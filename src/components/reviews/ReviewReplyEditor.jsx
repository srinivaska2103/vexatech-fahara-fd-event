'use client';
import { useState } from 'react';
import { useSubmitReplyMutation, useUpdateReplyMutation } from '@/hooks/reviews/useReviewMutations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, Send, Loader2, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import DeleteReplyModal from './DeleteReplyModal';

const replySchema = z.object({
  reply_text: z.string().min(10, 'Reply must be at least 10 characters long').max(1000, 'Reply is too long')
});

export default function ReviewReplyEditor({ review }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const submitMutation = useSubmitReplyMutation(review.id);
  const updateMutation = useUpdateReplyMutation(review.id);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply_text: review.reply_text || ''
    }
  });

  const onSubmit = (data) => {
    if (review.reply_text) {
      updateMutation.mutate(data, {
        onSuccess: () => setIsEditing(false)
      });
    } else {
      submitMutation.mutate(data, {
        onSuccess: () => reset() // or keep text if you prefer
      });
    }
  };

  const hasReply = !!review.reply_text;
  const showEditor = !hasReply || isEditing;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h3 className="text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" /> Manager Response
        </h3>
        {hasReply && !isEditing && (
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(true)} className="p-2 text-text/50 hover:text-primary transition-colors rounded-lg hover:bg-background">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 text-text/50 hover:text-red-500 transition-colors rounded-lg hover:bg-background">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showEditor ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <textarea
              {...register('reply_text')}
              placeholder="Write a public response to this review..."
              className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:border-primary focus:outline-none min-h-[120px]"
            />
            {errors.reply_text && (
              <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.reply_text.message}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3 justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  reset({ reply_text: review.reply_text });
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-bold text-text/50 hover:text-text transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {(submitMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isEditing ? 'Update Reply' : 'Post Reply'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 relative">
          <div className="text-xs font-bold text-primary mb-2 flex items-center justify-between">
            Response from Owner
            <span className="text-text/40 font-normal">
              {review.replied_at ? format(new Date(review.replied_at), 'MMM d, yyyy') : 'Recently'}
            </span>
          </div>
          <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
            {review.reply_text}
          </p>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteReplyModal 
          reviewId={review.id} 
          onClose={() => setIsDeleteModalOpen(false)} 
        />
      )}
    </div>
  );
}
