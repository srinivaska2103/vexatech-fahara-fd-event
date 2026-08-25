'use client';

import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#E8DED5]" />
        <div className="w-16 h-4 rounded bg-[#E8DED5]" />
        <div className="w-4 h-4 rounded bg-[#E8DED5]" />
        <div className="w-24 h-4 rounded bg-[#E8DED5]" />
      </div>

      {/* Welcome Banner Skeleton */}
      <div className="bg-[#FFF8F0] border border-[#E8DED5] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 w-full md:w-2/3">
          <div className="h-8 w-3/4 rounded-xl bg-[#E8DED5]" />
          <div className="h-4 w-1/2 rounded-lg bg-[#E8DED5]" />
        </div>
        <div className="h-12 w-44 rounded-2xl bg-[#E8DED5] shrink-0" />
      </div>

      {/* Quick Actions Bar Skeleton */}
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-white border border-[#E8DED5] p-4 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8DED5]" />
            <div className="h-3 w-16 rounded bg-[#E8DED5]" />
          </div>
        ))}
      </div>

      {/* Stats Cards Skeleton (360px: 1 col, 768px: 2 col, 1024px: 3 col) */}
      <div className="grid grid-cols-1 min-[540px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E8DED5] rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-[#E8DED5]" />
              <div className="w-14 h-5 rounded-full bg-[#E8DED5]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-[#E8DED5]" />
              <div className="h-8 w-32 rounded-xl bg-[#E8DED5]" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Performance Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-3xl bg-white border border-[#E8DED5] p-6 space-y-6">
          <div className="h-6 w-36 rounded bg-[#E8DED5]" />
          <div className="h-48 rounded-2xl bg-[#FFF8F0]" />
        </div>
        <div className="h-80 rounded-3xl bg-white border border-[#E8DED5] p-6 space-y-6">
          <div className="h-6 w-36 rounded bg-[#E8DED5]" />
          <div className="h-48 rounded-2xl bg-[#FFF8F0]" />
        </div>
      </div>
    </div>
  );
}
