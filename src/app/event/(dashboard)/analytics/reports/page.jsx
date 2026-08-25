"use client";
import React, { useState } from 'react';
import { useReports } from '@/hooks/analytics/useAnalyticsQueries';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { FileText, Download, Filter, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';


export default function ReportsPage() {
  const { filters } = useAnalyticsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('all');
  
  const { data: reportsData, isLoading } = useReports(filters, { page: 1, limit: 10 });
  
  const mockReports = [];

  const reports = reportsData?.length > 0 ? reportsData : mockReports;

  const filteredReports = reports.filter(r => 
    (reportType === 'all' || r.type === reportType) &&
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (reportName) => {
    toast.success(`Downloading ${reportName}...`);
  };

  const reportTypes = [
    { id: 'all', label: 'All Reports' },
    { id: 'revenue', label: 'Revenue' },
    { id: 'booking', label: 'Bookings' },
    { id: 'customer', label: 'Customers' },
    { id: 'package', label: 'Packages' },
  ];

  return (
    <div className="w-full h-full p-2 lg:p-4 space-y-6">
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Report Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Generate, view, and download your business reports</p>
        </div>
        
        <button 
          onClick={() => toast.success("Opening report generator...")}
          className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 hide-scrollbar">
            {reportTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  reportType === type.id 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Generated</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Format & Size</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Loading reports...</p>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">No reports found.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={report.id} 
                    className="border-b border-border hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-bold text-text">{report.name}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${report.format === 'PDF' ? 'text-red-600' : report.format === 'Excel' ? 'text-green-600' : 'text-blue-600'}`}>
                          {report.format}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{report.size}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        onClick={() => handleDownload(report.name)}
                        className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
