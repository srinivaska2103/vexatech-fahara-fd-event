import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import * as XLSX from 'xlsx';

const ExportReportModal = ({ isOpen, onClose, filters, data = [] }) => {
  const [format, setFormat] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (format === 'excel') {
        const exportData = data.map(item => ({
          'Date': new Date(item.date || item.booking_date || item.created_at).toLocaleDateString(),
          'Status': item.status || 'N/A',
          'Amount': `₹${item.amount || item.total_amount || item.subtotal || 0}`,
          'Customer': item.customerName || item.customer_name || 'N/A',
          'Package/Service': item.package_name || item.type || item.event_service_name || 'Standard Package'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Analytics Data");
        
        XLSX.writeFile(wb, `analytics_report_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success(`Report exported successfully as EXCEL`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
        >
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Export Analytics Report
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text mb-2">Format</label>
              <div className="grid grid-cols-1 gap-3">
                {['excel'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-colors ${
                      format === fmt ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <FileText className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold uppercase">{fmt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm mb-6">
              This report will be generated based on your current active filters. Data from <strong>{filters?.dateRange || 'This Month'}</strong> will be included.
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isExporting ? 'Generating...' : 'Download Report'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExportReportModal;
