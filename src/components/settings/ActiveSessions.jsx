"use client";
import React from 'react';
import { useActiveSessions, useLogoutAllDevices } from '@/hooks/settings/useSettingsQueries';
import { Loader2, Monitor, Smartphone, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ActiveSessions = () => {
  const { data: sessions, isLoading } = useActiveSessions();
  const logoutAll = useLogoutAllDevices();

  const handleLogoutAll = () => {
    logoutAll.mutate(undefined, {
      onSuccess: () => toast.success("Logged out of all other devices")
    });
  };

  if (isLoading) return <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:p-8 mb-6">
      <div className="mb-6 border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text">Active Sessions</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and log out your active sessions on other browsers and devices.</p>
        </div>
        <button 
          onClick={handleLogoutAll}
          disabled={logoutAll.isPending || sessions?.length <= 1}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          {logoutAll.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Log out other devices
        </button>
      </div>

      <div className="space-y-4">
        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">No active sessions found.</div>
        ) : (
          sessions.map((session, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 text-primary">
                {session.device_type === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-text text-sm">{session.browser} on {session.os}</h4>
                  {session.is_current && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      This Device
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">{session.ip_address} • {session.location || 'Unknown Location'}</p>
                <p className="text-xs text-gray-400">
                  Last active {formatDistanceToNow(new Date(session.last_active), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveSessions;
