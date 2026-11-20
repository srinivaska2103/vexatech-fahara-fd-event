'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTour from '@/components/dashboard/DashboardTour';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuthStore } from '@/store/authStore';
import { Sparkles, Lock, ShieldCheck, CheckCircle2, PackageCheck, CalendarDays, Megaphone, Star, BarChart3, Receipt, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { isActive: isSubActive, isLoading: isSubLoading, fetchSubscription, createSubscription, verifySubscription } = useSubscriptionStore();
  const user = useAuthStore((state) => state.user);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    document.title = "Grab2GO Event Manager";
  }, [pathname]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    const checkMobile = () => {
      const isTabletOrMobile = window.innerWidth < 1024;
      setIsMobile(isTabletOrMobile);
      if (!isTabletOrMobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openPaths = ['/event/subscription', '/event/support'];
  const isProtectedPath = !openPaths.some(p => pathname.startsWith(p));
  const showLockedState = !isSubLoading && !isSubActive && isProtectedPath;

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

  const handleDirectSubscribe = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutError('Razorpay SDK failed to load. Please check connection.');
        setCheckoutLoading(false);
        return;
      }

      const orderData = await createSubscription();
      if (orderData?.alreadyActive) {
        await fetchSubscription();
        setCheckoutLoading(false);
        return;
      }

      const resolvedAmount = orderData.amount || 299;
      const options = {
        key: orderData.razorpayKeyId,
        amount: Math.round(resolvedAmount * 100),
        currency: orderData.currency || 'INR',
        name: 'Grab2GO Event Partner',
        description: `Grab2GO Event Partner Monthly Subscription ₹${resolvedAmount}/month`,
        image: '/grab-it-logo.png',
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },

        theme: {
          color: '#E50914'
        },
        handler: async function (response) {
          try {
            await verifySubscription({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature
            });
            await fetchSubscription();
          } catch (err) {
            setCheckoutError(err.response?.data?.message || 'Payment verification failed.');
          } finally {
            setCheckoutLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
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
      console.error('Checkout error:', err);
      setCheckoutError(err.response?.data?.message || 'Failed to start payment checkout.');
      setCheckoutLoading(false);
    }
  };

  const faharaFeatures = [
    { title: 'Services & Packages Catalog', description: 'Manage custom event services, pricing tiers, inclusions, and packages.', icon: PackageCheck, color: 'text-rose-700', bg: 'bg-rose-100/80', border: 'border-rose-200' },
    { title: 'Event Bookings & Inquiries', description: 'Real-time client reservation tracking, party requests, and booking statuses.', icon: CalendarDays, color: 'text-emerald-700', bg: 'bg-emerald-100/80', border: 'border-emerald-200' },
    { title: 'Marketing & Promotional Campaigns', description: 'Run promotional discount deals, deal banners, and client marketing offers.', icon: Megaphone, color: 'text-fuchsia-700', bg: 'bg-fuchsia-100/80', border: 'border-fuchsia-200' },
    { title: 'Customer Reviews & Star Ratings', description: 'Monitor client feedback, track star ratings, and reply to customer reviews.', icon: Star, color: 'text-amber-700', bg: 'bg-amber-100/80', border: 'border-amber-200' },
    { title: 'Event Business Analytics', description: 'Deep revenue reports, popular event service trends, and client insights.', icon: BarChart3, color: 'text-purple-700', bg: 'bg-purple-100/80', border: 'border-purple-200' },
    { title: 'Finance, Payouts & Settlements', description: 'Razorpay settlement logs, transaction receipts, bank accounts & payouts.', icon: Receipt, color: 'text-blue-700', bg: 'bg-blue-100/80', border: 'border-blue-200' },
  ];

  return (
    <ProtectedLayout>
      <div className="flex h-screen overflow-hidden bg-background">
        <SidebarNavigation 
          isOpen={isSidebarOpen} 
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative w-full min-w-0">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
          
          <div className="flex-1 overflow-auto bg-background p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12">
            {showLockedState ? (
              <div className="min-h-full py-4 px-2 sm:px-4 max-w-5xl mx-auto space-y-8">
                {/* Locked Hero Card */}
                <div className="relative bg-gradient-to-br from-[#FFF9F2] via-[#FFF5F5] to-[#F5E6D3] text-[#252525] p-6 sm:p-10 rounded-3xl shadow-xl overflow-hidden border border-[#EF5350]/80">
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E50914]/10 text-[#E50914] text-xs font-black uppercase tracking-wider border border-[#E50914]/20 shadow-xs">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        Grab2GO EVENT PARTNER • INSTANT UNLOCK
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-[#252525]">
                        Unlock Your <span className="text-[#E50914]">Grab2GO Event Partner</span> Dashboard
                      </h1>
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Subscribe for ₹299/month to manage your event services, packages, client bookings, calendar availability, photo portfolio, customer reviews, and event business analytics.
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-700 font-bold pt-1">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Gateway Activation</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Gateway</span>
                        <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-600" /> All Modules Included</span>
                      </div>
                    </div>

                    <div className="w-full lg:w-80 bg-white/90 backdrop-blur-xl border border-[#EF5350]/80 hover:border-[#E50914]/50 p-6 rounded-3xl shrink-0 text-center space-y-4 shadow-xl transition-all">
                      <div className="space-y-1">
                        <span className="text-stone-500 text-[11px] font-black uppercase tracking-widest block">Partner Membership</span>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-[#E50914] tracking-tight">₹299</span>
                          <span className="text-xs font-bold text-stone-500"> / month</span>
                        </div>
                        <p className="text-[10px] text-stone-400">Monthly recurring partner subscription</p>
                      </div>

                      <button
                        onClick={handleDirectSubscribe}
                        disabled={checkoutLoading}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E50914] via-[#593E2B] to-[#452718] hover:from-[#593E2B] hover:to-[#252525] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#E50914]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {checkoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Initializing Payment...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                            <span>Subscribe Now @ ₹299/month</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

                {checkoutError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Modules Grid */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-[#252525]">Event Partner Modules</h2>
                      <p className="text-xs text-stone-500 font-medium">Complete event management suite enabled upon subscription</p>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#FFF5F5] text-[#E50914] text-xs font-black border border-[#EF5350]/60 w-fit">
                      6 Event Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faharaFeatures.map((feat, idx) => {
                      const IconComp = feat.icon;
                      return (
                        <div 
                          key={idx} 
                          className="p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-amber-500/50 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} border ${feat.border} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform`}>
                                <IconComp className="w-6 h-6 stroke-[2.5]" />
                              </div>
                              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-stone-100 text-stone-600">
                                Module 0{idx + 1}
                              </span>
                            </div>

                            <h3 className="text-base font-black text-[#252525] group-hover:text-[#E50914] transition-colors leading-snug">
                              {feat.title}
                            </h3>
                            <p className="text-xs text-stone-500 leading-relaxed font-medium">
                              {feat.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-extrabold text-emerald-700">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Unlocked with Subscription
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
          <DashboardTour />
          <BottomNavigation />
        </main>
      </div>
    </ProtectedLayout>
  );
}
