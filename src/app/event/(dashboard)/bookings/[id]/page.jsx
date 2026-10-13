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
import IncludedServicesCard from '@/components/bookings/IncludedServicesCard';
import BookingActions from '@/components/bookings/BookingActions';
import AcceptBookingModal from '@/components/bookings/AcceptBookingModal';
import RejectBookingModal from '@/components/bookings/RejectBookingModal';
import CancelBookingModal from '@/components/bookings/CancelBookingModal';
import RescheduleModal from '@/components/bookings/RescheduleModal';
import AssignStaffModal from '@/components/bookings/AssignStaffModal';
import AssignLeaderModal from '@/components/bookings/AssignLeaderModal';

// Note: In Next.js 15, page params is a Promise
function BookingDetailsContent({ id }) {
  const router = useRouter();
  const { data: booking, isLoading, isError } = useGetBookingDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#6F4E37] animate-spin mb-4" />
        <p className="text-stone-500 font-semibold animate-pulse text-xs">Loading booking details...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 flex flex-col items-center justify-center h-48 text-center">
        <p className="text-rose-700 font-bold mb-4 text-sm">Failed to load booking details.</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl hover:bg-rose-200 transition-colors font-bold text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  const bookingRef = booking.booking_number ? `#${booking.booking_number.toUpperCase()}` : `#${String(booking.id).slice(0, 8).toUpperCase()}`;

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 space-y-6 text-[#2C1810]">
      
      {/* Modern SaaS Header Hero Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 sm:p-8 rounded-3xl border border-[#DDB892]/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <button 
            type="button"
            onClick={() => router.push('/event/bookings')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-stone-200 text-xs font-black hover:bg-[#6F4E37] hover:text-white transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Bookings</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-extrabold">
            <span>RESERVATION STUDIO</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
                Booking {bookingRef}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {booking.booking_status || 'CONFIRMED'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
              Booked on {new Date(booking.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CustomerInformationCard booking={booking} />
          <EventInformationCard booking={booking} />
          <IncludedServicesCard booking={booking} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentSummaryCard booking={booking} />
            <BookingDetailsCard booking={booking} />
          </div>
        </div>

        {/* Sidebar Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          <BookingActions booking={booking} />
          <BookingTimeline booking={booking} />
        </div>
      </div>
    </div>
  );
}

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
