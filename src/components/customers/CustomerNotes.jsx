'use client';
import { useState } from 'react';
import { useCustomerNotes } from '@/hooks/customers/useCustomerQueries';
import { useAddCustomerNoteMutation, useDeleteCustomerNoteMutation } from '@/hooks/customers/useCustomerMutations';
import { format } from 'date-fns';
import { MessageSquare, Trash2, Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const noteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty')
});

export default function CustomerNotes({ customerId }) {
  const { data: notes, isLoading } = useCustomerNotes(customerId);
  const addMutation = useAddCustomerNoteMutation(customerId);
  const deleteMutation = useDeleteCustomerNoteMutation(customerId);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(noteSchema)
  });

  const onSubmit = (data) => {
    addMutation.mutate(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-4 pb-4 border-b border-border flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-text/50" /> Internal Notes
      </h3>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : notes?.length === 0 ? (
          <div className="text-center py-12 text-text/50 text-sm font-semibold border border-dashed border-border rounded-xl">
            No notes added yet.
          </div>
        ) : (
          notes?.map((note) => (
            <div key={note.id} className="bg-background border border-border rounded-xl p-4 group relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-text/40">
                  {format(new Date(note.created_at || new Date()), 'MMM d, yyyy h:mm a')}
                </span>
                <button 
                  onClick={() => deleteMutation.mutate(note.id)}
                  disabled={deleteMutation.isPending}
                  className="opacity-0 group-hover:opacity-100 p-1 text-text/40 hover:text-red-500 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-text whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-auto relative">
        <textarea 
          {...register('content')}
          placeholder="Add an internal note..."
          className="w-full bg-background border border-border rounded-xl p-3 pr-12 text-sm focus:border-primary focus:outline-none resize-none h-20"
        />
        <button 
          type="submit"
          disabled={addMutation.isPending}
          className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
        {errors.content && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.content.message}</p>}
      </form>
    </div>
  );
}
