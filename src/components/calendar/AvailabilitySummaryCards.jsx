'use client';

import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle, 
  Plus, 
  Package, 
  Coffee, 
  TrendingUp,
  Inbox
} from 'lucide-react';
import { useCalendarStore } from '@/store/useCalendarStore';
import Link from 'next/link';

export default function AvailabilitySummaryCards({ summary, onAddBlock }) {
  const { openCreateBlockModal } = useCalendarStore();

  const todayEvents = summary?.todayBookings || [];
  const pendingRequests = summary?.pendingRequests || [];
  const todayBlocks = summary?.todayBlocks || [];
  const upcomingBlocks = summary?.upcomingBlocks || [];
  const upcomingEvents = summary?.upcomingEvents || [];

  return (
    <div className="space-y-4">
      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Events */}
        <div className="bg-white border border-[#FEE2E2] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-[#E50914]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#757575]">Today's Events</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center border border-[#E50914]/15">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#252525]">{summary?.todayEventsCount || 0}</span>
            <span className="text-xs font-bold text-[#757575]">active scheduled</span>
          </div>
          <p className="text-[11px] text-[#757575] mt-2 font-semibold">
            {todayEvents.length > 0 ? `${todayEvents[0].service_name || 'Event'} today` : 'No events scheduled for today'}
          </p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white border border-[#FEE2E2] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">Pending Requests</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-900">{summary?.pendingRequestsCount || 0}</span>
            <span className="text-xs font-bold text-amber-700">awaiting action</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#757575] font-semibold">Need manager review</span>
            <Link 
              href="/event/bookings" 
              className="text-[10px] font-black text-[#E50914] hover:underline uppercase tracking-wide"
            >
              Review →
            </Link>
          </div>
        </div>

        {/* Blocked Slots */}
        <div className="bg-white border border-[#FEE2E2] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-[#E50914]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#757575]">Active Blocks</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#252525]">{summary?.totalActiveBlocksCount || 0}</span>
            <span className="text-xs font-bold text-[#757575]">periods locked</span>
          </div>
          <p className="text-[11px] text-[#757575] mt-2 font-semibold">
            {todayBlocks.length > 0 ? `${todayBlocks.length} block(s) active today` : 'Available for assignments'}
          </p>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white border border-[#FEE2E2] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-[#E50914]/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#757575]">Upcoming 30d</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#252525]">{summary?.upcomingEventsCount || 0}</span>
            <span className="text-xs font-bold text-emerald-700 font-semibold">confirmed</span>
          </div>
          <p className="text-[11px] text-[#757575] mt-2 font-semibold">Upcoming confirmed events</p>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="bg-gradient-to-r from-[#E50914] to-[#757575] rounded-3xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">Availability Management Actions</h4>
            <p className="text-xs text-white/80 font-medium">Prevent conflicts, reserve private dates, and coordinate venues.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            type="button"
            onClick={() => openCreateBlockModal()}
            className="flex-1 sm:flex-none px-4 py-2 bg-white text-[#E50914] text-xs font-black rounded-2xl hover:bg-[#FFF5F5] transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Add Block
          </button>
          <Link
            href="/event/services"
            className="flex-1 sm:flex-none px-4 py-2 bg-white/15 text-white border border-white/20 text-xs font-black rounded-2xl hover:bg-white/25 transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5" />
            Manage Packages
          </Link>
          <Link
            href="/event/bookings"
            className="flex-1 sm:flex-none px-4 py-2 bg-white/15 text-white border border-white/20 text-xs font-black rounded-2xl hover:bg-white/25 transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
