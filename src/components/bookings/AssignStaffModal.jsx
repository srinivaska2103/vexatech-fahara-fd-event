'use client';

import { useAssignmentStore } from '@/store/assignmentStore';
import { useAssignStaff } from '@/hooks/bookings/useBookingMutations';
import { Users, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  staffIds: z.array(z.string()).min(1, 'Please select at least one staff member.')
});

// Mock staff for UI since backend isn't built for it yet
const availableStaff = [
  { id: '1', name: 'John Doe', role: 'Decorator' },
  { id: '2', name: 'Jane Smith', role: 'Caterer' },
  { id: '3', name: 'Mike Johnson', role: 'DJ' },
];

export default function AssignStaffModal() {
  const { modals, closeModal } = useAssignmentStore();
  const assignMutation = useAssignStaff();
  const { isOpen, bookingId } = modals.assignStaff;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { staffIds: [] }
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    assignMutation.mutate({ id: bookingId, staffIds: data.staffIds }, {
      onSuccess: () => {
        closeModal('assignStaff');
        reset();
      }
    });
  };

  const handleClose = () => {
    closeModal('assignStaff');
    reset();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -z-10" />
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <button onClick={handleClose} className="text-text/40 hover:text-text transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-text mb-2">Assign Staff</h3>
          <p className="text-sm text-text/60 leading-relaxed mb-6">
            Select staff members to assign to this booking.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {availableStaff.map(staff => (
                <label key={staff.id} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-background transition-colors">
                  <input
                    type="checkbox"
                    value={staff.id}
                    {...register('staffIds')}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <div>
                    <p className="text-sm font-bold text-text">{staff.name}</p>
                    <p className="text-xs font-medium text-text/60">{staff.role}</p>
                  </div>
                </label>
              ))}
              {errors.staffIds && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.staffIds.message}</p>}
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
                {assignMutation.isPending ? 'Assigning...' : 'Assign Staff'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
