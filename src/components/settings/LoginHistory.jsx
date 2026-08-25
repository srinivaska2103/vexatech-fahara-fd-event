"use client";
import React from 'react';
import { useLoginHistory } from '@/hooks/settings/useSettingsQueries';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const LoginHistory = () => {
  const { data: history, isLoading } = useLoginHistory();

  if (isLoading) return <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:p-8">
      <div className="mb-6 border-b border-border pb-4">
        <h3 className="text-lg font-bold text-text">Recent Login History</h3>
        <p className="text-sm text-gray-500 mt-1">Review your recent logins to spot any unauthorized access.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Device & Location</th>
              <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {!history || history.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-sm text-gray-500">No login history available.</td>
              </tr>
            ) : (
              history.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {format(new Date(log.created_at), "MMM d, yyyy • h:mm a")}
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-600">{log.ip_address}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{log.browser} / {log.location || 'Unknown'}</td>
                  <td className="py-3 px-4 text-right">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3 h-3" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-md">
                        <ShieldAlert className="w-3 h-3" /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginHistory;
