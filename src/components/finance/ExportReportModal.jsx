'use client';
import { useExportReportMutation } from '@/hooks/finance/useFinanceMutations';
import { FileText, FileSpreadsheet, FileIcon, Loader2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const exportSchema = z.object({
  dateRange: z.enum(['last_7_days', 'last_30_days', 'this_month', 'last_month', 'this_year', 'all_time'])
});

export default function ExportReportModal({ isOpen, onClose }) {
  const exportMutation = useExportReportMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      dateRange: 'this_month'
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    exportMutation.mutate({ ...data, format: 'excel' }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold text-text">Export Financial Report</h2>
          <button onClick={onClose} className="text-text/50 hover:text-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">

            <div>
              <label className="block text-sm font-bold text-text mb-2">Date Range</label>
              <select 
                {...register('dateRange')}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
                <option value="all_time">All Time</option>
              </select>
              {errors.dateRange && <p className="text-red-500 text-xs mt-1.5">{errors.dateRange.message}</p>}
            </div>
          </div>
          
          <div className="bg-background border-t border-border p-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              disabled={exportMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-text hover:bg-surface border border-border transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={exportMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {exportMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
