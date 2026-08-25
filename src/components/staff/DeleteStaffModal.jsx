import { useDeleteStaffMutation } from '@/hooks/staff/useStaffMutations';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteStaffModal({ isOpen, onClose, staff }) {
  const deleteMutation = useDeleteStaffMutation();

  if (!isOpen || !staff) return null;

  const handleDelete = () => {
    deleteMutation.mutate(staff.id, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface rounded-2xl shadow-2xl z-50 overflow-hidden transform transition-all">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">Delete Staff Member?</h3>
          <p className="text-sm text-text/70 mb-6">
            Are you sure you want to remove <strong>{staff.name}</strong> from your team? This action cannot be undone and will remove them from all assigned events.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-background border border-border rounded-xl text-sm font-bold text-text hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 py-3 bg-red-600 rounded-xl text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
