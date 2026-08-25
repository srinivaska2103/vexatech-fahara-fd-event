'use client';
import { use } from 'react';
import StaffForm from '@/components/staff/StaffForm';
import { useStaffDetails } from '@/hooks/staff/useStaffQueries';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditStaffPage({ params }) {
  const { id } = use(params);
  const { data: staff, isLoading, error } = useStaffDetails(id);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href={`/event/staff/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-text/50 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-text">Edit Staff Profile</h1>
          <p className="text-sm text-text/50">Update team member details</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12 text-text/50">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error || !staff ? (
          <div className="text-red-500 font-semibold py-12 text-center">Failed to load staff details.</div>
        ) : (
          <StaffForm initialData={staff} />
        )}
      </div>
    </div>
  );
}
