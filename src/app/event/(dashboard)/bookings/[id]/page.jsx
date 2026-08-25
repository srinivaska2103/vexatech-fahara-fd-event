'use client';

import { use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useGetBookingDetails } from '@/hooks/bookings/useBookingQueries';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CustomerInformationCard from '@/components/bookings/CustomerInformationCard';
import EventInformationCard from '@/components/bookings/EventInformationCard';
import PaymentSummaryCard from '@/components/bookings/PaymentSummaryCard';
import BookingDetailsCard from '@/components/bookings/BookingDetailsCard';
import BookingTimeline from '@/components/bookings/BookingTimeline';
import EventChecklist from '@/components/bookings/EventChecklist';
import InternalNotes from '@/components/bookings/InternalNotes';
import BookingStatusDropdown from '@/components/bookings/BookingStatusDropdown';
import BookingActions from '@/components/bookings/BookingActions';

// Note: In Next.js 15, page params is a Promise
function BookingDetailsContent({ id }) {
  const router = useRouter();
  const { data: booking, isLoading, isError } = useGetBookingDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-text/60 font-semibold animate-pulse">Loading booking details...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex flex-col items-center justify-center h-48">
        <p className="text-red-700 font-bold mb-4">Failed to load booking details.</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/event/bookings')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border hover:bg-background transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-text/70" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-text tracking-tight">Booking #{booking?.id ? String(booking.id).slice(0, 8) : ''}</h1>
            </div>
            <p className="text-text/60 mt-1">Booked on {new Date(booking.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CustomerInformationCard booking={booking} />
          <EventInformationCard booking={booking} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentSummaryCard booking={booking} />
            <BookingDetailsCard booking={booking} />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          <BookingTimeline booking={booking} />
        </div>
      </div>
    </div>
  );
}

import AcceptBookingModal from '@/components/bookings/AcceptBookingModal';
import RejectBookingModal from '@/components/bookings/RejectBookingModal';
import CancelBookingModal from '@/components/bookings/CancelBookingModal';
import RescheduleModal from '@/components/bookings/RescheduleModal';
import AssignStaffModal from '@/components/bookings/AssignStaffModal';
import AssignLeaderModal from '@/components/bookings/AssignLeaderModal';

export default function BookingDetailsPage({ params }) {
  const { id } = use(params);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full relative min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 mix-blend-multiply pointer-events-none" />
      
      <Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
        <BookingDetailsContent id={id} />
      </Suspense>

      {/* Modals mounted here */}
      <AcceptBookingModal />
      <RejectBookingModal />
      <CancelBookingModal />
      <RescheduleModal />
      <AssignStaffModal />
      <AssignLeaderModal />
    </div>
  );
}
