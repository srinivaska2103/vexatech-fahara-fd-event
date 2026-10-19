'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';

/**
 * Calculates remaining days until subscription expiry using currentPeriodEnd timestamp
 */
export function getSubscriptionExpiryState(subscription, status, isActive) {
  if (!subscription) {
    if (status === 'EXPIRED') {
      return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
    }
    if (status === 'INACTIVE' || status === 'CANCELLED') {
      return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription inactive', shortText: 'Inactive', badgeType: 'expired' };
    }
    return { state: 'NO_SUB', text: 'No active plan', shortText: 'Subscribe', badgeType: 'neutral' };
  }

  // If backend explicitly marked status as EXPIRED
  const subStatus = String(subscription.status || status || '').toUpperCase();
  if (subStatus === 'EXPIRED') {
    return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
  }

  const periodEndRaw = subscription.currentPeriodEnd || subscription.current_period_end;
  if (!periodEndRaw) {
    if (isActive) {
      return { state: 'ACTIVE_NO_EXPIRY', text: 'Subscription active', shortText: 'Active', badgeType: 'active' };
    }
    return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
  }

  const expiryDate = new Date(periodEndRaw);
  const now = new Date();

  // If invalid date string
  if (isNaN(expiryDate.getTime())) {
    if (isActive) {
      return { state: 'ACTIVE_NO_EXPIRY', text: 'Subscription active', shortText: 'Active', badgeType: 'active' };
    }
    return { state: 'EXPIRED', daysLeft: 0, text: 'Subscription expired', shortText: 'Expired', badgeType: 'expired' };
  }

  const diffMs = expiryDate.getTime() - now.getTime();

  // Expired check
  if (diffMs <= 0) {
    return { 
      state: 'EXPIRED', 
      daysLeft: 0, 
      text: 'Subscription expired', 
      shortText: 'Expired', 
      badgeType: 'expired' 
    };
  }

  // Calculate days remaining (ceiling so partial days count towards today or full day)
  const diffHours = diffMs / (1000 * 60 * 60);
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // If expires within the same day / less than 24 hours
  if (diffHours <= 24) {
    return {
      state: 'EXPIRES_TODAY',
      daysLeft: 0,
      text: 'Subscription expires today',
      shortText: 'Expires today',
      badgeType: 'urgent'
    };
  }

  // 1 to 7 days left (Warning color)
  if (daysLeft <= 7) {
    return {
      state: 'WARNING',
      daysLeft,
      text: `Subscription · ${daysLeft} day${daysLeft > 1 ? 's' : ''} left`,
      shortText: `${daysLeft}d left`,
      badgeType: 'warning'
    };
  }

  // More than 7 days left (Normal active color)
  return {
    state: 'NORMAL',
    daysLeft,
    text: `Subscription · ${daysLeft} days left`,
    shortText: `${daysLeft} days left`,
    badgeType: 'normal'
  };
}

export default function SubscriptionBadge({ className = '' }) {
  const { subscription, status, isActive, isLoading, fetchSubscription } = useSubscriptionStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.id && typeof fetchSubscription === 'function') {
      fetchSubscription();
    }
  }, [user?.id, fetchSubscription]);

  // Loading state
  if (isLoading && !subscription) {
    return (
      <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 text-xs animate-pulse ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        <span className="text-[11px] font-bold">Subscription...</span>
      </div>
    );
  }

  const expiryState = getSubscriptionExpiryState(subscription, status, isActive);

  return (
    <Link
      href="/event/subscription"
      title={`${expiryState.text} — Click to manage subscription`}
      className={`relative inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all duration-200 cursor-pointer group select-none shrink-0 shadow-xs hover:shadow-md bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white border-red-400/40 hover:brightness-105 active:scale-95 ${className}`}
    >
      {/* Crown Icon */}
      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
        <Crown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-200 fill-amber-300 stroke-[2]" />
      </div>

      {/* Main label text */}
      <span className="text-[9px] sm:text-[11px] font-black tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
        <span className="hidden md:inline font-bold text-white/90">Subscription</span>
        <span className="hidden md:inline text-white/60">·</span>
        <span className="font-black drop-shadow-xs">
          {expiryState.daysLeft > 0 ? `${expiryState.daysLeft}d left` : expiryState.shortText}
        </span>
      </span>

      {/* Live animated pulsing indicator dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300"></span>
      </span>
    </Link>
  );
}
