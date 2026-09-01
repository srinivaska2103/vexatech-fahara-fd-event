'use client';

import { useState } from 'react';
import { useSubmitReplyMutation, useUpdateReplyMutation } from '@/hooks/reviews/useReviewMutations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, Send, Loader2, Edit2, Trash2, Sparkles, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DeleteReplyModal from './DeleteReplyModal';

const replySchema = z.object({
  reply_text: z.string().min(5, 'Reply must be at least 5 characters long').max(1000, 'Reply is too long')
});

const QUICK_TEMPLATES = [
  "Thank you for your rating! We're thrilled you enjoyed our event service.",
  "Thank you for your feedback! We are constantly working to deliver exceptional event experiences.",
  "We truly appreciate your review and look forward to managing your next celebration!",
  "Thank you for sharing your thoughts! We will take this into account for future events."
];

export default function ReviewReplyEditor({ review }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const submitMutation = useSubmitReplyMutation(review.id);
  const updateMutation = useUpdateReplyMutation(review.id);

  const existingReply = review.reply_text || review.reply || review.owner_reply || '';

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply_text: existingReply
    }
  });

  const replyTextValue = watch('reply_text', '');

  const onSubmit = (data) => {
    if (existingReply) {
      updateMutation.mutate(data, {
        onSuccess: () => setIsEditing(false)
      });
    } else {
      submitMutation.mutate(data, {
        onSuccess: () => reset()
      });
    }
  };

  const hasReply = !!existingReply;
  const showEditor = !hasReply || isEditing;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)] mb-6 font-sans relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <h3 className="text-sm font-black text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-[#6F4E37]" /> Manager Response
        </h3>
        {hasReply && !isEditing && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-2 text-stone-500 hover:text-[#6F4E37] transition-all rounded-xl hover:bg-[#FFF8F0] border border-transparent hover:border-[#DDB892]/40 cursor-pointer"
              title="Edit Response"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)} 
              className="p-2 text-stone-500 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer"
              title="Delete Response"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {showEditor ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Quick Template Chips */}
          <div className="space-y-2">
            <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Reply Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setValue('reply_text', tmpl, { shouldValidate: true })}
                  className="text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-[#FFF8F0] hover:text-[#6F4E37] border border-stone-200/80 hover:border-[#DDB892]/60 px-3 py-1.5 rounded-xl transition-all active:scale-95 text-left cursor-pointer shadow-2xs"
                >
                  &ldquo;{tmpl.slice(0, 45)}...&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              {...register('reply_text')}
              placeholder="Write a public response to this review..."
              rows={4}
              className="w-full bg-[#FFF8F0]/30 border border-stone-200/90 focus:border-[#6F4E37] rounded-2xl p-4 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/10 transition-all shadow-inner leading-relaxed"
            />
            <div className="flex justify-between items-center mt-1.5 px-1">
              {errors.reply_text ? (
                <p className="text-rose-600 text-xs font-bold">{errors.reply_text.message}</p>
              ) : (
                <span className="text-[11px] font-bold text-stone-400">Publicly visible on your event profile</span>
              )}
              <span className="text-[11px] font-mono font-bold text-stone-400">
                {replyTextValue.length} / 1000
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 justify-end pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  reset({ reply_text: existingReply });
                  setIsEditing(false);
                }}
                className="px-5 py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={submitMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4A2C11] via-[#5C3818] to-[#6F4E37] text-white rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {(submitMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Send className="w-4 h-4 text-amber-300" />
              )}
              <span>{isEditing ? 'Update Response' : 'Post Official Response'}</span>
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="bg-[#FFF8F0]/70 border border-[#DDB892]/50 rounded-2xl p-5 sm:p-6 relative shadow-2xs space-y-2">
          <div className="text-xs font-black text-[#6F4E37] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Official Response
            </span>
            <span className="text-stone-400 font-bold">
              {review.replied_at || review.reply_at ? format(new Date(review.replied_at || review.reply_at), 'MMM d, yyyy') : 'Recently'}
            </span>
          </div>
          <p className="text-sm font-semibold text-stone-800 leading-relaxed whitespace-pre-wrap pt-1">
            {existingReply}
          </p>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteReplyModal 
          reviewId={review.id} 
          onClose={() => setIsDeleteModalOpen(false)} 
        />
      )}
    </motion.div>
  );
}
