'use client';
import StaffForm from '@/components/staff/StaffForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateStaffPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/event/staff" className="inline-flex items-center gap-2 text-sm font-semibold text-text/50 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Staff
          </Link>
          <h1 className="text-2xl font-bold text-text">Add New Staff</h1>
          <p className="text-sm text-text/50">Create a new profile for your team member</p>
        </div>
        
        <StaffForm />
      </div>
    </div>
  );
}
