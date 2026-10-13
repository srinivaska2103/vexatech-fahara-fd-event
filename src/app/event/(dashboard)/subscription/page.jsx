'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { 
  Check, ShieldCheck, Sparkles, AlertTriangle, Calendar, CreditCard, RefreshCw, Lock, 
  Copy, ExternalLink, ArrowRight, PackageCheck, CalendarDays, Megaphone, BarChart3, 
  Layers, Receipt, CheckCircle2, Zap, Award, Star, Users, Bell, Coffee, Utensils, Info
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function EventSubscriptionPage() {
  const { 
    subscription, 
    plans,
    status, 
    isActive, 
    isLoading, 
    error, 
    fetchSubscription, 
    fetchPlans,
    createSubscription, 
    verifySubscription, 
    cancelSubscription,
    reactivateSubscription
  } = useSubscriptionStore();
  
  const user = useAuthStore((state) => state.user);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activePreviewMod, setActivePreviewMod] = useState(null);

  useEffect(() => {
    if (typeof fetchSubscription === 'function') {
      fetchSubscription();
    }
    if (typeof fetchPlans === 'function') {
      fetchPlans();
    }
  }, [fetchSubscription, fetchPlans]);


  // Event Manager pricing requirement: ₹299/month
  const currentPlanPrice = 299;
  const currentRole = 'EVENT_MANAGER';
  const currentPartnerLabel = 'Event Manager';

  // 3 Distinct Plan Cards with accurate supported features
  const allPlans = useMemo(() => [
    {
      id: 'cafe-plan',
      role: 'CAFE_OWNER',
      title: 'Cafe Owner',
      price: 299,
      billingCycle: 'MONTHLY',
      tagline: 'Take bookings, showcase custom event packages & grow cafe footfall.',
      icon: Coffee,
      badge: 'Venue Partner',
      features: [
        'Business profile and location',
        'Photos and gallery',
        'Customer discovery',
        'Booking and availability management',
        'Custom event packages and inclusions',
        'Deals and offers',
        'Reviews and ratings',
        'Business analytics'
      ]
    },
    {
      id: 'restaurant-plan',
      role: 'RESTAURANT_OWNER',
      title: 'Restaurant Owner',
      price: 149,
      billingCycle: 'MONTHLY',
      tagline: 'Connect with diners and manage tables, digital menu & reservations.',
      icon: Utensils,
      badge: 'Dining Partner',
      features: [
        'Restaurant profile and location',
        'Photos and business information',
        'Customer discovery',
        'Menu display',
        'Booking management',
        'Offers and promotions',
        'Reviews and ratings',
        'Business insights'
      ]
    },
    {
      id: 'event-manager-plan',
      role: 'EVENT_MANAGER',
      title: 'Event Manager',
      price: 299,
      billingCycle: 'MONTHLY',
      tagline: 'Showcase event packages, custom services & receive direct client inquiries.',
      icon: CalendarDays,
      badge: 'Full Event Suite',
      features: [
        'Event Manager profile',
        'Custom event services',
        'User-created packages and inclusions',
        'Service pricing and availability',
        'Customer enquiries and bookings',
        'Reviews and ratings',
        'Business insights'
      ]
    }
  ], []);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        setMsg({ type: 'error', text: 'Razorpay SDK failed to load. Please check your network connection.' });
        setSubmitting(false);
        return;
      }

      const orderData = await createSubscription();
      if (orderData?.alreadyActive) {
        setMsg({ type: 'success', text: 'You already have an active subscription!' });
        await fetchSubscription();
        setSubmitting(false);
        return;
      }

      const resolvedAmount = orderData.amount || currentPlanPrice;
      const options = {
        key: orderData.razorpayKeyId,
        amount: Math.round(resolvedAmount * 100),
        currency: orderData.currency || 'INR',
        name: 'Fahara Event Partner',
        description: `Fahara Event Partner Monthly Subscription ₹${resolvedAmount}/month`,
        image: '/Fahara Logo.jpeg',
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#6F4E37'
        },
        handler: async function (response) {
          try {
            await verifySubscription({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            });
            setMsg({ type: 'success', text: 'Subscription activated successfully! Welcome to Fahara Event Partner.' });
            await fetchSubscription();
          } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.message || 'Subscription payment verification failed.' });
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          }
        }
      };

      if (orderData.orderId) {
        options.order_id = orderData.orderId;
      } else if (orderData.subscriptionId) {
        options.subscription_id = orderData.subscriptionId;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Subscription error:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to initialize subscription checkout.' });
      setSubmitting(false);
    }
  };

  const confirmCancelRenewal = async () => {
    setShowCancelModal(false);
    setSubmitting(true);
    try {
      await cancelSubscription();
      setMsg({ type: 'success', text: 'Subscription auto-renewal cancelled. Portal remains unlocked until the billing period ends.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to cancel renewal.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReactivateRenewal = async () => {
    setSubmitting(true);
    setMsg(null);
    try {
      if (typeof reactivateSubscription === 'function') {
        await reactivateSubscription();
      } else {
        await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTION?.REACTIVATE || '/subscriptions/reactivate');
        await fetchSubscription();
      }
      setMsg({ type: 'success', text: 'Auto-renewal has been successfully turned back on! Your subscription will continue seamlessly.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reactivate auto-renewal.' });
    } finally {
      setSubmitting(false);
    }
  };

  const unlockedModules = useMemo(() => [
    { 
      title: 'Event Services & Inclusions', 
      desc: 'Create and configure itemized services including catering, decoration, audio systems, and stage lighting.', 
      href: '/event/services', 
      icon: PackageCheck, 
      badge: 'Services',
      category: 'OPERATIONS',
      features: [
        'Itemized pricing with custom units (per plate, item, session, or hour)',
        'Detailed inclusions checklist for client clarity',
        'Real-time service availability toggle',
        'Direct booking link integration for verified customers'
      ]
    },
    { 
      title: 'Event Packages Catalog', 
      desc: 'Bundle your standalone services into structured, tiered event packages tailored for celebrations.', 
      href: '/event/services', 
      icon: Layers, 
      badge: 'Packages',
      category: 'OPERATIONS',
      features: [
        'Tiered package levels: Basic, Standard & Premium',
        'Configurable guest capacities and base fees',
        'Instant customer booking directly from the Fahara consumer app',
        'Custom inclusions and add-on pricing controls'
      ]
    },
    { 
      title: 'Bookings & Enquiries', 
      desc: 'Review incoming customer requests, approve dates, communicate terms, and track order progress.', 
      href: '/event/bookings', 
      icon: CalendarDays, 
      badge: 'Bookings',
      category: 'CLIENTS',
      features: [
        'Real-time booking calendar with date conflict protection',
        'One-click Accept & Decline workflows with custom customer notes',
        'Advance deposit tracking & payment verification',
        'Downloadable invoice and booking summary PDFs'
      ]
    },
    { 
      title: 'Photo Gallery Portfolio', 
      desc: 'Showcase previous weddings, receptions, and parties to build client trust and inspire inquiries.', 
      href: '/event/profile', 
      icon: Star, 
      badge: 'Showcase',
      category: 'CLIENTS',
      features: [
        'High-resolution multi-image uploads and categorization',
        'Featured portfolio cards displayed on public discovery search',
        'Tagging by celebration type (Birthday, Wedding, Corporate)',
        'Optimized CDN image delivery for lightning-fast browsing'
      ]
    },
    { 
      title: 'Customer Reviews & Ratings', 
      desc: 'Monitor verified customer testimonials, star ratings, and reply directly to feedback.', 
      href: '/event/reviews', 
      icon: Users, 
      badge: 'Reputation',
      category: 'GROWTH',
      features: [
        'Verified guest reviews with photos and event details',
        'Official Event Partner response thread to showcase dedication',
        'Automated rating analytics & aggregate score calculation',
        'Feedback notification alerts sent instantly to your account'
      ]
    },
    { 
      title: 'Event Insights & Analytics', 
      desc: 'Understand business performance, booking trends, inquiry conversion, and payout reconciliations.', 
      href: '/event/analytics', 
      icon: BarChart3, 
      badge: 'Insights',
      category: 'GROWTH',
      features: [
        'Monthly inquiry volume and conversion percentage',
        'Revenue distribution and average booking value graphs',
        'Razorpay settlement history and payout status tracking',
        'Customer demographic and repeat client insights'
      ]
    },
  ], []);

  const filteredModules = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'ALL') return unlockedModules;
    return unlockedModules.filter((m) => m.category === selectedCategory);
  }, [unlockedModules, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8 text-[#2C1810]">
      {/* 1. Header Banner using Fahara Brand Tokens */}
      <div className="relative bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#F5E6D3] text-[#2C1810] p-6 sm:p-10 rounded-3xl shadow-md border border-[#E8DED5] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A67B5B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#6F4E37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-xs font-black uppercase tracking-wider border border-[#6F4E37]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Fahara Event Partner</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#2C1810] leading-tight">
                Grow Your Business With Fahara
              </h1>
              <p className="text-[#6F4E37]/90 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Discover Fahara's partner tools and activate your subscription to access your business dashboard.
              </p>
            </div>

            {isActive && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 block">Status</span>
                  <span className="text-xs font-black text-emerald-950 tracking-wide">ACTIVE & VERIFIED</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs ${
          msg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Inactive Notice Banner when subscription not active */}
      {!isActive && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center shrink-0 border border-[#DDB892]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-[#2C1810]">
                {status === 'EXPIRED' ? 'Subscription Expired' : (status === 'CANCELLED' ? 'Subscription Cancelled' : 'Active Subscription Required')}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                An active subscription is required to unlock your Event Manager dashboard, custom services, client inquiries, and package bookings. Your profile, services, and past bookings remain fully preserved.
              </p>
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
            <span>{status === 'EXPIRED' ? `Renew for ₹${currentPlanPrice}/month` : `Subscribe for ₹${currentPlanPrice}/month`}</span>
          </button>
        </div>
      )}

      {/* 2. Active Subscription Details View */}
      {isActive && subscription && (
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DED5]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider border border-emerald-300">
                  Active Subscription
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] text-[11px] font-bold border border-[#DDB892]">
                  Event Partner
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
                {subscription.planName || 'FAHARA EVENT PARTNER'}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Recurring monthly event partner subscription
              </p>
            </div>

            <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#E8DED5] text-right min-w-[140px]">
              <div className="text-2xl sm:text-3xl font-black text-[#6F4E37]">
                ₹{subscription.price || currentPlanPrice}
                <span className="text-xs font-bold text-stone-500"> / month</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                {subscription.cancelAtPeriodEnd ? 'Cancels at Period End' : 'Renews Monthly'}
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">Status</span>
              <span className="text-xs sm:text-sm font-black text-emerald-800 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {subscription.status}
              </span>
            </div>

            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">Current Period Start</span>
              <span className="text-xs sm:text-sm font-black text-[#2C1810] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                {subscription.currentPeriodStart ? format(new Date(subscription.currentPeriodStart), 'dd MMM yyyy') : 'N/A'}
              </span>
            </div>

            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">
                {subscription.cancelAtPeriodEnd ? 'Access Until' : 'Next Billing Date'}
              </span>
              <span className="text-xs sm:text-sm font-black text-[#2C1810] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#A67B5B]" />
                {subscription.currentPeriodEnd ? format(new Date(subscription.currentPeriodEnd), 'dd MMM yyyy') : 'N/A'}
              </span>
            </div>

            <div className="p-4 bg-[#FFF8F0]/60 rounded-2xl border border-[#E8DED5]">
              <span className="text-stone-500 text-[11px] font-bold block mb-1">Payment Reference</span>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-black text-stone-700 truncate max-w-[130px]">
                  {subscription.razorpaySubscriptionId || 'Direct'}
                </span>
                {subscription.razorpaySubscriptionId && (
                  <button 
                    onClick={() => copyToClipboard(subscription.razorpaySubscriptionId)}
                    className="p-1 text-stone-400 hover:text-[#6F4E37] cursor-pointer"
                    title="Copy ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cancellation Notice & Controls */}
          <div className="pt-4 border-t border-[#E8DED5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {subscription.cancelAtPeriodEnd 
                  ? 'Auto-renewal is cancelled. Access will remain active until the billing period ends.' 
                  : 'Recurring monthly subscription managed securely via Razorpay. You can cancel auto-renewal anytime.'}
              </span>
            </div>

            {subscription.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivateRenewal}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black shadow-sm hover:shadow transition-all cursor-pointer shrink-0 flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Renewing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Renew Auto-Renewal</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={submitting}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Cancel Auto-Renewal
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Event Partner Modules & Capabilities Showcase (Interactive UI) */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[11px] font-black text-[#6F4E37] uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Event Suite</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
              {isActive ? 'Your Unlocked Event Partner Tools' : 'Event Manager Modules & Capabilities'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-2xl mt-1">
              {isActive 
                ? 'Launch and manage all active event modules enabled with your verified subscription.' 
                : 'Click any module below to inspect features, client booking flows, and tools unlocked with your partner plan.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isActive && (
              <button
                onClick={handleSubscribe}
                disabled={submitting}
                className="px-5 py-2.5 rounded-2xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Unlock All (₹299/mo)</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Capabilities', count: 6 },
            { id: 'OPERATIONS', label: 'Services & Packages', count: 2 },
            { id: 'CLIENTS', label: 'Bookings & Clients', count: 2 },
            { id: 'GROWTH', label: 'Reputation & Analytics', count: 2 },
          ].map((cat) => {
            const isSelected = (selectedCategory || 'ALL') === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#6F4E37] text-white shadow-sm'
                    : 'bg-white border border-[#E8DED5] text-stone-600 hover:bg-[#FAF0E6] hover:text-[#2C1810]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod, mIdx) => {
            const ModIcon = mod.icon;
            const isHovered = activePreviewMod?.title === mod.title;

            return (
              <div
                key={mIdx}
                onClick={() => setActivePreviewMod(mod)}
                className={`p-6 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                  isHovered 
                    ? 'border-[#6F4E37] ring-4 ring-[#6F4E37]/10 shadow-lg -translate-y-1' 
                    : 'border-[#E8DED5] hover:border-[#6F4E37]/50 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Decorative background glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A67B5B]/5 rounded-full blur-2xl group-hover:bg-[#6F4E37]/10 transition-colors pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center border border-[#E8DED5] group-hover:bg-[#6F4E37] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-2xs">
                      <ModIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#DDB892] uppercase tracking-wider">
                        {mod.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#2C1810] group-hover:text-[#6F4E37] transition-colors flex items-center gap-1.5">
                      <span>{mod.title}</span>
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                      {mod.desc}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="p-3 rounded-2xl bg-[#FFF8F0]/70 border border-[#E8DED5]/80 space-y-1.5">
                    {mod.features.slice(0, 2).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-[11px] text-stone-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8DED5]/70 flex items-center justify-between text-xs font-bold text-[#6F4E37] relative z-10">
                  <span className="flex items-center gap-1 group-hover:underline">
                    <span>{isActive ? 'Launch Module' : 'Explore Feature'}</span>
                  </span>
                  {isActive ? (
                    <div className="w-7 h-7 rounded-full bg-[#FFF8F0] group-hover:bg-[#6F4E37] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-700 text-[11px] font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ready to Unlock</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Module Preview Modal */}
      {activePreviewMod && (
        <div 
          onClick={() => setActivePreviewMod(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DED5] space-y-6 text-[#2C1810]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] text-[#6F4E37] flex items-center justify-center border border-[#E8DED5] shadow-xs">
                  {React.createElement(activePreviewMod.icon, { className: 'w-6 h-6 stroke-[2.2]' })}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] bg-[#FFF8F0] px-2 py-0.5 rounded-full border border-[#DDB892]">
                    {activePreviewMod.badge}
                  </span>
                  <h3 className="text-lg font-black text-[#2C1810] mt-1">{activePreviewMod.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActivePreviewMod(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
              {activePreviewMod.desc}
            </p>

            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#6F4E37] block">
                Key Capabilities & Business Controls:
              </span>
              <div className="space-y-2">
                {activePreviewMod.features.map((feat, fIdx) => (
                  <div key={fIdx} className="p-3 rounded-2xl bg-[#FFF8F0] border border-[#E8DED5] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-[#2C1810] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E8DED5]">
              <span className="text-[11px] text-stone-500 font-bold">
                {isActive ? 'Status: Active & Available' : 'Requires: Fahara Partner Plan'}
              </span>

              {isActive ? (
                <Link
                  href={activePreviewMod.href}
                  className="px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black flex items-center gap-2 shadow-sm"
                >
                  <span>Open This Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setActivePreviewMod(null);
                    handleSubscribe();
                  }}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#593E2B] text-white text-xs font-black flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Subscribe to Access (₹299/mo)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#E8DED5] space-y-5 text-[#2C1810]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#2C1810]">Cancel Auto-Renewal?</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Your event manager dashboard will stay unlocked until your paid period ends. You won't be charged for next month.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF8F0] border border-[#E8DED5] text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 text-[#6F4E37] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Business data stays safe</span>
              </div>
              <p className="text-[11px] text-stone-500">
                All services, inclusions, packages, and bookings remain intact. You can renew whenever you're ready.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancelRenewal}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all cursor-pointer"
              >
                {submitting ? 'Cancelling...' : 'Confirm Cancel Renewal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
