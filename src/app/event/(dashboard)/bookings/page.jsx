'use client';

import { useGetBookings } from '@/hooks/bookings/useBookingQueries';
import { useBookingFilterStore } from '@/store/bookingFilterStore';
import BookingTable from '@/components/bookings/BookingTable';
import { Suspense, useState } from 'react';
import { 
  Download, Search, Sparkles, Calendar, Clock, CheckCircle2, 
  IndianRupee, RefreshCw, TicketCheck, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function BookingsDashboard() {
  const { filters, setFilters, searchQuery, setSearchQuery, sortBy } = useBookingFilterStore();
  
  // Combine all filters to pass to TanStack query
  const queryFilters = { ...filters, search: searchQuery, sort: sortBy };
  
  const { data: bookings, isLoading, isError, error, refetch } = useGetBookings(queryFilters);
  const bookingsList = Array.isArray(bookings) ? bookings : [];

  // Metrics calculation
  const totalBookings = bookingsList.length;
  const pendingCount = bookingsList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'PENDING').length;
  const confirmedCount = bookingsList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'CONFIRMED').length;
  const completedCount = bookingsList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'COMPLETED').length;
  const cancelledCount = bookingsList.filter(b => (b.status || b.booking_status || '').toUpperCase() === 'CANCELLED').length;
  
  const totalRevenue = bookingsList.reduce((sum, b) => {
    const status = (b.status || b.booking_status || '').toUpperCase();
    if (status === 'CONFIRMED' || status === 'COMPLETED') {
      return sum + Number(b.amount || b.total || b.total_price || b.total_amount || 0);
    }
    return sum;
  }, 0);

  const handleExport = () => {
    const exportData = bookingsList.length > 0 ? bookingsList : [
      {
        booking_number: 'BK-1001',
        customerName: 'Sample Customer',
        customerEmail: 'sample@example.com',
        cafeName: 'Fahara Grand Event Hall',
        date: new Date().toISOString(),
        startTime: '10:00',
        guests: 50,
        amount: 25000,
        status: 'CONFIRMED'
      }
    ];

    try {
      let csv = 'Booking ID,Customer Name,Email,Venue,Date,Time,Guests,Amount (INR),Status\n';
      exportData.forEach(b => {
        const id = b.booking_number || (b.id ? String(b.id).substring(0,8) : 'BK-1000');
        const name = (b.customerName || 'Guest User').replace(/,/g, ' ');
        const email = b.customerEmail || '';
        const venue = (b.cafeName || 'Event Hall').replace(/,/g, ' ');
        const date = b.date ? new Date(b.date).toLocaleDateString('en-IN') : '';
        const time = b.startTime || '10:00 AM';
        const guests = b.guests || 1;
        const amount = b.total || b.amount || 0;
        const status = b.status || b.booking_status || 'PENDING';
        
        csv += `"${id}","${name}","${email}","${venue}","${date}","${time}","${guests}","${amount}","${status}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fahara_event_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Bookings report exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export CSV report');
    }
  };

  const statusTabs = [
    { id: 'ALL', label: 'All Reservations', count: totalBookings },
    { id: 'PENDING', label: 'Pending', count: pendingCount },
    { id: 'CONFIRMED', label: 'Confirmed', count: confirmedCount },
    { id: 'COMPLETED', label: 'Completed', count: completedCount },
    { id: 'CANCELLED', label: 'Cancelled', count: cancelledCount },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[#6F4E37] text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reservation Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Booking Management
            </h1>
            
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-2xl leading-relaxed">
              Monitor event reservations, approve pending requests, and export financial booking records.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] text-xs font-bold shadow-2xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
            >
              <Download className="w-4 h-4 text-[#8C6D58]" />
              <span>Export CSV</span>
            </button>
            
            <Link 
              href="/event/calendar"
              className="px-5 py-2.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs font-bold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. STATS OVERVIEW METRICS GRID (4 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: TOTAL BOOKINGS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#6F4E37]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#8C6D58] uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-9 h-9 rounded-full bg-[#F3EFEA] text-[#6F4E37] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {totalBookings}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              All recorded event slots
            </p>
          </div>
        </div>

        {/* Card 2: PENDING ACTION */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
              Pending Action
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-100/80 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {pendingCount}
            </div>
            <p className="text-xs text-amber-700 font-bold mt-1">
              Requires approval
            </p>
          </div>
        </div>

        {/* Card 3: CONFIRMED */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
              Confirmed
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {confirmedCount}
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Approved reservations
            </p>
          </div>
        </div>

        {/* Card 4: TOTAL REVENUE */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-full bg-purple-100/80 text-purple-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              Recorded booking value
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. STATUS FILTER TABS & SEARCH TOOLBAR     */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        
        {/* Status Filter Pills Left */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = (filters.status?.toUpperCase() === tab.id) || (tab.id === 'ALL' && (!filters.status || filters.status === 'all'));
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilters({ status: tab.id === 'ALL' ? 'all' : tab.id.toLowerCase() })}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#6F4E37] text-white shadow-xs'
                    : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#E8DED5]/60 text-[#6F4E37]'
                }`}>
                  {tab.count || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Search Input & Refresh */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          
          {/* Search Box */}
          <div className="relative flex-1 xl:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
            <input 
              type="text"
              placeholder="Search guest name, ref ID, or email..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
            />
          </div>

          {/* Refresh Control Button */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DED5] text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0] transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MAIN BOOKING TABLE COMPONENT            */}
      {/* ========================================== */}
      {isError ? (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
          <p className="text-sm font-black text-rose-700">Failed to load booking reservations.</p>
          <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please verify your server connection.'}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
        </div>
      ) : (
        <BookingTable bookings={bookings} isLoading={isLoading} />
      )}

    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="h-48 flex items-center justify-center font-black text-sm text-[#6F4E37]">Loading Reservations...</div>}>
      <BookingsDashboard />
    </Suspense>
  );
}
