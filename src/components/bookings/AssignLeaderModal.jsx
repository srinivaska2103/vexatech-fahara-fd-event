'use client';

import { useAssignmentStore } from '@/store/assignmentStore';
import { useAssignTeamLeader } from '@/hooks/bookings/useBookingMutations';
import { UserPlus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  leaderId: z.string().min(1, 'Please select a team leader.')
});

// Mock leaders for UI since backend isn't built for it yet
const availableLeaders = [
  { id: '101', name: 'Alice Williams', experience: '5 years' },
  { id: '102', name: 'Bob Davis', experience: '3 years' },
];

export default function AssignLeaderModal() {
  const { modals, closeModal } = useAssignmentStore();
  const assignMutation = useAssignTeamLeader();
  const { isOpen, bookingId } = modals.assignLeader;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    assignMutation.mutate({ id: bookingId, leaderId: data.leaderId }, {
      onSuccess: () => {
        closeModal('assignLeader');
        reset();
      }
    });
  };

  const handleClose = () => {
    closeModal('assignLeader');
    reset();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <button onClick={handleClose} className="text-text/40 hover:text-text transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-text mb-2">Assign Team Leader</h3>
          <p className="text-sm text-text/60 leading-relaxed mb-6">
            Select a team leader to oversee this event.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-text/70 mb-2 uppercase tracking-wider">Select Leader</label>
              <select
                {...register('leaderId')}
                className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all
                  ${errors.leaderId ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-primary'}
                `}
              >
                <option value="">-- Choose a leader --</option>
                {availableLeaders.map(l => (
                  <option key={l.id} value={l.id}>{l.name} ({l.experience})</option>
                ))}
              </select>
              {errors.leaderId && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.leaderId.message}</p>}
            </div>

            <div className="flex gap-3 w-full">
              <button 
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 bg-background hover:bg-surface border border-border text-text font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={assignMutation.isPending}
                className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assignMutation.isPending ? 'Assigning...' : 'Assign Leader'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
