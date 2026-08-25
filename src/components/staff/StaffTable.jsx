'use client';
import { useStaffManagementStore } from '@/store/useStaffManagementStore';
import StaffRoleBadge from './StaffRoleBadge';
import StaffStatusBadge from './StaffStatusBadge';
import { Edit2, Trash2, MoreVertical, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function StaffTable({ staffList, onDelete }) {
  const { selectedStaffIds, toggleStaffSelection, selectAllStaff } = useStaffManagementStore();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      selectAllStaff(staffList.map(s => s.id));
    } else {
      selectAllStaff([]);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-background/50">
            <th className="p-4 w-12">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                checked={staffList.length > 0 && selectedStaffIds.length === staffList.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Staff Name</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Role</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Contact</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-bold text-text/50 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id} className="border-b border-border hover:bg-background/30 transition-colors group">
              <td className="p-4">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  checked={selectedStaffIds.includes(staff.id)}
                  onChange={() => toggleStaffSelection(staff.id)}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-primary">
                    {staff.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="font-bold text-text text-sm group-hover:text-primary transition-colors">{staff.name}</div>
                    <div className="text-xs text-text/50">{staff.experience || '1 year exp'}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <StaffRoleBadge role={staff.role} />
              </td>
              <td className="p-4">
                <div className="text-sm font-semibold text-text">{staff.phone}</div>
                <div className="text-xs text-text/50">{staff.email}</div>
              </td>
              <td className="p-4">
                <StaffStatusBadge status={staff.status} />
              </td>
              <td className="p-4 text-right relative">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/event/staff/${staff.id}`} className="p-2 text-text/50 hover:text-primary hover:bg-surface rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link href={`/event/staff/${staff.id}/edit`} className="p-2 text-text/50 hover:text-primary hover:bg-surface rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => onDelete(staff)}
                    className="p-2 text-text/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
