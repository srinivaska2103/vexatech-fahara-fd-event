import { useState } from 'react';
import { useAssignStaffMutation } from '@/hooks/calendar/useCalendarMutations';
import { useStaffList } from '@/hooks/calendar/useCalendarQueries';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

export default function AssignStaffDrawer({ isOpen, onClose, event }) {
  const { data: staffList, isLoading } = useStaffList();
  const assignStaff = useAssignStaffMutation();
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (!isOpen) return null;

  const handleAssign = () => {
    if (selectedStaff && event) {
      assignStaff.mutate({ eventId: event.id, staffId: selectedStaff }, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">Assign Staff</h2>
            <p className="text-sm text-text/50">{event?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text/50 hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Available Staff</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8 text-text/50">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : staffList.length === 0 ? (
            <div className="text-center py-8 bg-background border border-border border-dashed rounded-xl text-text/50">
              <p className="text-sm font-semibold">No staff available.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staffList.map(staff => (
                <div 
                  key={staff.id} 
                  onClick={() => setSelectedStaff(staff.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedStaff === staff.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-text">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-text text-sm">{staff.name}</h4>
                      <p className="text-xs text-text/50">{staff.role}</p>
                    </div>
                  </div>
                  {selectedStaff === staff.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-background flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-sm text-text hover:bg-surface rounded-xl transition-colors border border-border">
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            disabled={!selectedStaff || assignStaff.isPending}
            className="px-6 py-2 font-bold text-sm text-white bg-primary hover:bg-secondary rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {assignStaff.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Assign Selected Staff
          </button>
        </div>
      </div>
    </>
  );
}
