import { useState } from 'react';
import { useCalendarBlockedDates } from '@/hooks/calendar/useCalendarQueries';
import { useBlockDateMutation } from '@/hooks/calendar/useCalendarMutations';
import { ShieldAlert, Loader2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BlockedDatesCard() {
  const { data: blockedDates, isLoading } = useCalendarBlockedDates();
  const blockDate = useBlockDateMutation();
  const [isAdding, setIsAdding] = useState(false);

  const handleBlockDate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const date = formData.get('date');
    const reason = formData.get('reason');
    
    if (date) {
      blockDate.mutate({ date, reason, action: 'block' }, {
        onSuccess: () => setIsAdding(false)
      });
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">Blocked Dates</h3>
            <p className="text-xs text-text/50">Prevent bookings on specific dates</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-8 h-8 rounded-full bg-background hover:bg-primary hover:text-white border border-border flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleBlockDate} className="mb-6 p-4 bg-background border border-border rounded-xl space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-text mb-1">Date to Block</label>
              <input type="date" name="date" required className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text mb-1">Reason (Optional)</label>
              <input type="text" name="reason" className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. Venue Maintenance" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-text hover:bg-surface rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={blockDate.isPending} className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {blockDate.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Block Date
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8 text-text/50">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : blockedDates.length === 0 ? (
        <div className="text-center py-8 bg-background rounded-xl border border-border border-dashed text-text/50">
          <p className="text-sm font-semibold">No dates are currently blocked.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blockedDates.map((block, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-red-50/30 border border-red-100 rounded-xl hover:border-red-300 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-red-800">{format(new Date(block.date), 'MMMM d, yyyy')}</h4>
                {block.reason && <p className="text-xs text-red-600/70">{block.reason}</p>}
              </div>
              <button 
                onClick={() => blockDate.mutate({ id: block.id, action: 'unblock' })}
                className="w-8 h-8 rounded-lg text-text/40 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
