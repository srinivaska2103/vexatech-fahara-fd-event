'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStaffList } from '@/hooks/staff/useStaffQueries';
import { useStaffManagementStore } from '@/store/useStaffManagementStore';
import StaffSearch from '@/components/staff/StaffSearch';
import StaffFilters from '@/components/staff/StaffFilters';
import StaffTable from '@/components/staff/StaffTable';
import StaffCard from '@/components/staff/StaffCard';
import DeleteStaffModal from '@/components/staff/DeleteStaffModal';
import { Plus, Users, Loader2, LayoutGrid, List } from 'lucide-react';

export default function StaffDirectoryPage() {
  const [view, setView] = useState('table'); // 'table' or 'grid'
  const [staffToDelete, setStaffToDelete] = useState(null);
  
  const { filters, pagination, sort, searchQuery } = useStaffManagementStore();
  const { data, isLoading, error } = useStaffList(filters, pagination, sort);
  const staffList = data?.data || [];

  // Client side search filtering (since backend doesn't exist yet)
  const filteredList = staffList.filter(s => 
    searchQuery === '' || 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Staff Management</h1>
            <p className="text-sm text-text/50">Manage your event team and roles</p>
          </div>
          <Link 
            href="/event/staff/create"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between bg-surface border border-border p-4 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <StaffSearch />
            <StaffFilters />
          </div>
          <div className="flex items-center gap-2 bg-background border border-border p-1 rounded-xl w-fit">
            <button 
              onClick={() => setView('table')}
              className={`p-2 rounded-lg transition-colors ${view === 'table' ? 'bg-surface text-primary shadow-sm' : 'text-text/50 hover:text-text'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-surface text-primary shadow-sm' : 'text-text/50 hover:text-text'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-text/50 py-12 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-semibold">Loading staff directory...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center text-red-500 py-12">
              <p className="font-semibold">Failed to load staff list.</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-text/50 py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2">
                <Users className="w-8 h-8 opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-text">No Staff Found</h3>
              <p className="text-sm">Try adjusting your filters or search query.</p>
            </div>
          ) : view === 'table' ? (
            <StaffTable staffList={filteredList} onDelete={setStaffToDelete} />
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-background">
              {filteredList.map(staff => (
                <StaffCard key={staff.id} staff={staff} onDelete={setStaffToDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <DeleteStaffModal 
        isOpen={!!staffToDelete} 
        onClose={() => setStaffToDelete(null)} 
        staff={staffToDelete} 
      />
    </div>
  );
}
