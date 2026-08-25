import { useState } from 'react';
import { useCalendarHolidays } from '@/hooks/calendar/useCalendarQueries';
import { useManageHolidayMutation } from '@/hooks/calendar/useCalendarMutations';
import { CalendarIcon, Loader2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function HolidayManager() {
  const { data: holidays, isLoading } = useCalendarHolidays();
  const manageHoliday = useManageHolidayMutation();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddHoliday = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const date = formData.get('date');
    const name = formData.get('name');
    
    if (date && name) {
      manageHoliday.mutate({ date, name, action: 'create' }, {
        onSuccess: () => setIsAdding(false)
      });
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">Holiday Management</h3>
            <p className="text-xs text-text/50">Configure company-wide holidays and special days</p>
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
        <form onSubmit={handleAddHoliday} className="mb-6 p-4 bg-background border border-border rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text mb-1">Holiday Name</label>
              <input type="text" name="name" required className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="e.g. Christmas" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text mb-1">Date</label>
              <input type="date" name="date" required className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-text hover:bg-surface rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={manageHoliday.isPending} className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {manageHoliday.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Save Holiday
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8 text-text/50">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : holidays.length === 0 ? (
        <div className="text-center py-8 bg-background rounded-xl border border-border border-dashed text-text/50">
          <p className="text-sm font-semibold">No holidays configured.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {holidays.map((holiday, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl hover:border-primary/30 transition-colors">
              <div>
                <h4 className="text-sm font-bold text-text">{holiday.name}</h4>
                <p className="text-xs text-text/60">{format(new Date(holiday.date), 'MMMM d, yyyy')}</p>
              </div>
              <button 
                onClick={() => manageHoliday.mutate({ id: holiday.id, action: 'delete' })}
                className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
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
