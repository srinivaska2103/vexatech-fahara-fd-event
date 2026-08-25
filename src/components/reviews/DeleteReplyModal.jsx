'use client';
import { useDeleteReplyMutation } from '@/hooks/reviews/useReviewMutations';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteReplyModal({ reviewId, onClose }) {
  const deleteMutation = useDeleteReplyMutation(reviewId);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Delete Reply?</h2>
              <p className="text-sm text-text/60 mt-1">
                Are you sure you want to delete your public response? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-background border-t border-border p-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-text hover:bg-surface border border-border transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Reply
          </button>
        </div>
      </div>
    </div>
  );
}
