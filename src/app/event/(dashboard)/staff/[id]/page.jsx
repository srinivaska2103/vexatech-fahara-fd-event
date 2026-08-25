'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { useStaffDetails } from '@/hooks/staff/useStaffQueries';
import StaffProfileCard from '@/components/staff/StaffProfileCard';
import AvailabilityCard from '@/components/staff/AvailabilityCard';
import PerformanceCard from '@/components/staff/PerformanceCard';
import EmergencyContactCard from '@/components/staff/EmergencyContactCard';
import AssignEventDrawer from '@/components/staff/AssignEventDrawer';
import { ArrowLeft, Edit2, CalendarPlus, Loader2 } from 'lucide-react';

export default function StaffProfilePage({ params }) {
  // Extract id from params
  const { id } = use(params);
  
  const { data: staff, isLoading, error } = useStaffDetails(id);
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-semibold text-text/50">Loading profile...</p>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-red-500">
        <p className="font-semibold">Failed to load staff profile.</p>
        <Link href="/event/staff" className="mt-4 text-primary underline">Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link href="/event/staff" className="inline-flex items-center gap-2 text-sm font-semibold text-text/50 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAssignDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border hover:bg-surface text-text rounded-xl text-sm font-bold transition-colors"
            >
              <CalendarPlus className="w-4 h-4" /> Assign Event
            </button>
            <Link 
              href={`/event/staff/${id}/edit`}
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-bold transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StaffProfileCard staff={staff} />
            <PerformanceCard staff={staff} />
          </div>
          <div className="space-y-6">
            <AvailabilityCard staff={staff} />
            <EmergencyContactCard staff={staff} />
          </div>
        </div>
      </div>

      <AssignEventDrawer 
        isOpen={isAssignDrawerOpen} 
        onClose={() => setIsAssignDrawerOpen(false)} 
        staff={staff} 
      />
    </div>
  );
}
