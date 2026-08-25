"use client";
import React from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Search, Filter, X } from 'lucide-react';

const NotificationFilters = ({ type = 'notifications' }) => {
  const isNotification = type === 'notifications';
  
  const filters = useNotificationStore(state => 
    isNotification ? state.notificationFilters : state.activityFilters
  );
  
  const setFilters = useNotificationStore(state => 
    isNotification ? state.setNotificationFilters : state.setActivityFilters
  );

  const hasActiveFilters = isNotification 
    ? (filters.status !== 'all' || filters.searchQuery !== '')
    : (filters.dateRange !== 'this_week');

  const clearFilters = () => {
    if (isNotification) {
      setFilters({ status: 'all', searchQuery: '' });
    } else {
      setFilters({ dateRange: 'this_week' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-border shadow-sm mb-6">
      
      {isNotification && (
        <div className="relative w-full md:w-64 flex-shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2 text-sm font-semibold text-text/70 md:border-r border-border md:pr-4 flex-shrink-0">
          <Filter className="w-4 h-4" />
          Filters
        </div>

        {isNotification && (
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="text-sm bg-transparent border-none font-medium text-text focus:ring-0 cursor-pointer min-w-[100px]"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        )}


        {!isNotification && (
          <div>
             <select 
              value={filters.dateRange}
              onChange={(e) => setFilters({ dateRange: e.target.value })}
              className="text-sm bg-transparent border-none font-medium text-text focus:ring-0 cursor-pointer min-w-[130px]"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="ml-auto flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors bg-red-50 px-2.5 py-1.5 rounded-lg flex-shrink-0"
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
};

export default NotificationFilters;
