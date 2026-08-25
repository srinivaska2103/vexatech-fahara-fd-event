'use client';
import { use } from 'react';
import Link from 'next/link';
import { useCustomerDetails, useCustomerBookings } from '@/hooks/customers/useCustomerQueries';
import CustomerProfileCard from '@/components/customers/CustomerProfileCard';
import ContactInformationCard from '@/components/customers/ContactInformationCard';
import CustomerStatistics from '@/components/customers/CustomerStatistics';
import BookingHistoryTable from '@/components/customers/BookingHistoryTable';
import UpcomingBookingsCard from '@/components/customers/UpcomingBookingsCard';
import CancelledBookingsCard from '@/components/customers/CancelledBookingsCard';
import { ArrowLeft, Loader2, UserCheck } from 'lucide-react';

export default function CustomerProfilePage({ params }) {
  const { id } = use(params);
  
  const { data: customer, isLoading: isCustomerLoading, error } = useCustomerDetails(id);
  const { data: bookings, isLoading: isBookingsLoading } = useCustomerBookings(id);

  if (isCustomerLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-semibold text-text/50">Loading customer profile...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-red-500">
        <p className="font-semibold">Failed to load customer profile.</p>
        <Link href="/event/customers" className="mt-4 text-primary underline">Back to CRM Directory</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <Link href="/event/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-text/50 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to CRM
          </Link>
          <div className="flex items-center gap-3">
          </div>
        </div>

        {/* Top Profile Header */}
        <CustomerProfileCard customer={customer} bookings={bookings || []} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerStatistics customer={customer} bookings={bookings || []} />
            
            <div className="grid grid-cols-1 gap-6">
              <ContactInformationCard customer={customer} />
            </div>
            
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-text mb-6 pb-2 border-b border-border">Booking History</h3>
              {isBookingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-text/50" />
                </div>
              ) : (
                <BookingHistoryTable bookings={bookings || []} />
              )}
            </div>
          </div>

          {/* Right Column (Sidebar/CRM Tools) */}
          <div className="space-y-6">
            {!isBookingsLoading && <UpcomingBookingsCard bookings={bookings || []} />}
            {!isBookingsLoading && <CancelledBookingsCard bookings={bookings || []} />}
          </div>
        </div>
      </div>
    </div>
  );
}
