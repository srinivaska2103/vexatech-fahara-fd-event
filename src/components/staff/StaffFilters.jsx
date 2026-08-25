'use client';
import { useStaffManagementStore } from '@/store/useStaffManagementStore';
import { Filter } from 'lucide-react';

export default function StaffFilters() {
  const { filters, setFilters, clearFilters } = useStaffManagementStore();

  const ROLES = ['Team Leader', 'Event Coordinator', 'Photographer', 'Videographer', 'Decorator', 'Catering Staff'];
  const STATUSES = ['ACTIVE', 'INACTIVE', 'ON LEAVE'];

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 shadow-sm">
        <Filter className="w-4 h-4 text-text/40" />
        <select
          value={filters.role}
          onChange={(e) => setFilters({ role: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none max-w-[120px]"
        >
          <option value="all">All Roles</option>
          {ROLES.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        
        <div className="w-px h-4 bg-border mx-2"></div>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="bg-transparent text-sm font-semibold text-text focus:outline-none max-w-[120px]"
        >
          <option value="all">All Status</option>
          {STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      
      {(filters.role !== 'all' || filters.status !== 'all') && (
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-red-500 hover:text-red-700 underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
