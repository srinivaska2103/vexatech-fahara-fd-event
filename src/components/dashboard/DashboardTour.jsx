'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Sparkles, ChevronRight, ChevronLeft, X, Coffee,
  PartyPopper, Rocket, Building2, PackageSearch, Clock,
  CalendarDays, Calendar, UsersRound, Star, CreditCard,
  Landmark, IndianRupee, Settings, Compass, ArrowRight, Check,
  LayoutDashboard, RefreshCw, Wallet, BarChart3, Bell, LifeBuoy
} from 'lucide-react';

const TAB_TOUR_STEPS = [
  {
    isWelcomeStep: true,
    target: null,
    title: 'Welcome to Fahara',
    category: 'ONBOARDING',
    icon: Coffee,
    description: "Let's take an interactive guided tour and show you how to set up your venue, manage bookings, and receive payouts.",
  },
  {
    target: '[data-tour-id="nav-dashboard"]',
    title: 'Your Business at a Glance',
    icon: LayoutDashboard,
    category: 'PORTFOLIO SUMMARY',
    route: '/event/dashboard',
    description: 'Track your bookings, customers, revenue, ratings, and important business updates from one place.',
    metrics: [
      { label: 'Total Revenue' },
      { label: 'Active Bookings' },
      { label: 'Upcoming Schedule' },
      { label: 'Total Customers' },
      { label: 'Average Rating' },
      { label: 'Revenue Analytics' }
    ]
  },
  {
    target: '[data-tour-id="nav-event-management"]',
    title: 'Add Your Event Manager Profile',
    icon: Building2,
    category: 'VENUE LISTING',
    route: '/event/profile',
    description: 'Create your venue profile so customers can discover and book your event services.',
    statusBox: {
      text: 'Your venue profile is already created. You can update details anytime.'
    },
    actionBtn: { label: 'Go to Profile →', route: '/event/profile' }
  },
  {
    target: '[data-tour-id="nav-services"]',
    title: 'Services & Event Packages',
    icon: PackageSearch,
    category: 'PACKAGE CATALOG',
    route: '/event/services',
    description: 'Configure event management packages, guest capacity limits, tiered pricing structures, and custom add-ons.',
    statusBox: {
      text: 'Package Catalog Active: Configure custom pricing tiers & inclusions.'
    },
    actionBtn: { label: 'Go to Services →', route: '/event/services' }
  },
  {
    target: '[data-tour-id="nav-bookings"]',
    title: 'Reservations & Inquiries',
    icon: CalendarDays,
    category: 'RESERVATION STUDIO',
    route: '/event/bookings',
    description: 'Review incoming customer reservation requests, confirm bookings, assign staff coordinators, and update fulfillment status.',
    metrics: [
      { label: 'Real-time Booking Alerts' },
      { label: 'Filtered Status View' },
      { label: 'Complete Guest Contacts' },
      { label: 'Fulfillment Tracking' }
    ]
  },
  {
    target: '[data-tour-id="nav-events"]',
    title: 'Smart Schedule Calendar',
    icon: Calendar,
    category: 'AVAILABILITY SCHEDULER',
    route: '/event/calendar',
    description: 'View daily, weekly, and monthly event reservations in a synchronized calendar to prevent overlapping venue dates.',
    statusBox: {
      text: 'Real-time date availability & conflict warnings enabled.'
    }
  },
  {
    target: '[data-tour-id="nav-customers"]',
    title: 'Client CRM Directory',
    icon: UsersRound,
    category: 'CLIENT MANAGEMENT',
    route: '/event/customers',
    description: 'Maintain customer profiles, track repeat event clients, direct contact details, lifetime spend, and custom notes.',
    metrics: [
      { label: 'Centralized Profiles' },
      { label: 'Booking History' },
      { label: 'Direct Contacts' },
      { label: 'Lifetime Spend' }
    ]
  },
  {
    target: '[data-tour-id="nav-reviews"]',
    title: 'Reputation & Diner Praise',
    icon: Star,
    category: 'REPUTATION STUDIO',
    route: '/event/reviews',
    description: 'Monitor client feedback ratings, diner testimonials, response rate metrics, and manage your online reputation.',
    metrics: [
      { label: 'Star Ratings (4.9 ★)' },
      { label: 'Verified Diner Praise' },
      { label: 'Official Responses' },
      { label: 'Reputation Score' }
    ]
  },
  {
    target: '[data-tour-id="nav-payment-account"]',
    title: 'Settlement Account',
    icon: Wallet,
    category: 'RAZORPAY PAYOUTS',
    badge: 'VERIFIED',
    route: '/event/finance/payment-account',
    description: 'Add and verify your bank account so eligible payments and settlements can be processed securely via Razorpay.',
    infoBox: {
      label: 'Account Status:',
      val: 'Linked Bank Account Verified (XXXX-XXXX-5971)'
    }
  }
];

// Floating Colorful Balloons (Vibrant Festive Colors)
const BALLOONS = [
  { color: '#FF2D55', left: '4%', delay: 0, size: 'w-14 h-18' },    // Hot Pink
  { color: '#007AFF', left: '13%', delay: 0.3, size: 'w-16 h-20' }, // Bright Blue
  { color: '#FFCC00', left: '22%', delay: 0.1, size: 'w-12 h-16' }, // Golden Yellow
  { color: '#34C759', left: '33%', delay: 0.45, size: 'w-15 h-19' },// Emerald Green
  { color: '#FF9500', left: '44%', delay: 0.2, size: 'w-14 h-18' }, // Vivid Orange
  { color: '#AF52DE', left: '55%', delay: 0.5, size: 'w-16 h-20' }, // Royal Purple
  { color: '#5AC8FA', left: '66%', delay: 0.15, size: 'w-13 h-17' },// Cyan Blue
  { color: '#FF3B30', left: '77%', delay: 0.35, size: 'w-15 h-19' },// Bright Red
  { color: '#E040FB', left: '86%', delay: 0.05, size: 'w-14 h-18' },// Magenta Pink
  { color: '#00E676', left: '94%', delay: 0.4, size: 'w-12 h-16' }, // Neon Green
];

// Festive Decoration Papers / Confetti / Streamer Ribbons
const CONFETTI_PIECES = Array.from({ length: 70 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: [
    '#FF2D55', '#FF9500', '#FFCC00', '#34C759', 
    '#5AC8FA', '#007AFF', '#AF52DE', '#FF3B30', 
    '#E040FB', '#00E676', '#FFD600', '#FF1744'
  ][i % 12],
  size: Math.random() * 10 + 8,
  delay: Math.random() * 1.5,
  duration: Math.random() * 2.5 + 2.2,
  type: i % 4 === 0 ? 'ribbon' : i % 4 === 1 ? 'square' : i % 4 === 2 ? 'circle' : 'star',
}));

export default function DashboardTour() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Check if tour triggered from support page or localStorage
  useEffect(() => {
    const isCompleted = localStorage.getItem('fahara_tour_completed');
    if (isCompleted === 'false') {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [pathname]);

  const updateTargetRect = useCallback(() => {
    if (!isOpen || showCelebration) return;
    const step = TAB_TOUR_STEPS[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep, showCelebration]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [updateTargetRect]);

  const handleNext = () => {
    if (currentStep < TAB_TOUR_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const stepObj = TAB_TOUR_STEPS[nextStep];
      if (stepObj?.route && pathname !== stepObj.route) {
        router.push(stepObj.route);
      }
    } else {
      setIsOpen(false);
      setShowCelebration(true);
      localStorage.setItem('fahara_tour_completed', 'true');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const stepObj = TAB_TOUR_STEPS[prevStep];
      if (stepObj?.route && pathname !== stepObj.route) {
        router.push(stepObj.route);
      }
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    setShowCelebration(false);
    localStorage.setItem('fahara_tour_completed', 'true');
  };

  const finishAndGoToDashboard = () => {
    setShowCelebration(false);
    router.push('/event/dashboard');
  };

  // Keyboard shortcut listener (Arrow Left / Right / Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || showCelebration) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showCelebration, currentStep]);

  // Metric Check State per step
  const [checkedMetrics, setCheckedMetrics] = useState({});

  const toggleMetric = (stepIdx, metricIdx) => {
    setCheckedMetrics((prev) => {
      const key = `${stepIdx}-${metricIdx}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToStep = (index) => {
    setCurrentStep(index);
    const stepObj = TAB_TOUR_STEPS[index];
    if (stepObj?.route && pathname !== stepObj.route) {
      router.push(stepObj.route);
    }
  };

  const step = TAB_TOUR_STEPS[currentStep];
  const StepIcon = step?.icon || LayoutDashboard;

  return (
    <AnimatePresence>
      {/* ======================================================== */}
      {/* 1. BACKDROP & SPOTLIGHT HALO (No Blur Effect)             */}
      {/* ======================================================== */}
      {isOpen && step && (
        <div className="fixed inset-0 z-50 pointer-events-auto overflow-hidden">
          
          {/* Target Element Spotlight Cutout Ring (Clear & Unblurred) */}
          {targetRect && (
            <motion.div
              initial={false}
              animate={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute rounded-2xl border-2 border-white/90 shadow-[0_0_0_9999px_rgba(25,15,10,0.75)] pointer-events-none z-10"
            >
              <div className="absolute -inset-1 rounded-2xl border border-amber-300/80 animate-ping opacity-60 pointer-events-none" />
            </motion.div>
          )}

          {/* 1. Welcome Step Modal (Step 1 of 9) - Centered Overlay */}
          {step.isWelcomeStep ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1F140E]/60 backdrop-blur-xs pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-md bg-[#FFFDF9] border border-[#E8DED5] rounded-[36px] p-6 sm:p-8 shadow-2xl relative text-center select-none space-y-6 font-sans"
              >
                {/* Header: Step Pill & Close Button */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[#6F4E37] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                    STEP 1 OF {TAB_TOUR_STEPS.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-8 h-8 rounded-full bg-[#FFF8F0] text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Big Coffee/Beverage Cup Icon Card */}
                <div className="w-16 h-16 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center mx-auto shadow-md shadow-[#6F4E37]/25">
                  <Coffee className="w-8 h-8 stroke-[2]" />
                </div>

                {/* Welcome Title & Subtitle */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight leading-tight">
                    Welcome to Fahara, {user?.ownerName || user?.name || 'Srinivas K A'} 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8C6D58] font-medium leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-1/2 py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white font-extrabold text-xs shadow-md shadow-[#6F4E37]/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Start Guided Tour →</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full sm:w-1/2 py-3 rounded-2xl bg-white hover:bg-[#FFF8F0] text-[#2C1810] border border-[#E8DED5] font-extrabold text-xs shadow-2xs flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Skip for Now</span>
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            /* 2. Spotlight Step Modals (Steps 2 through 9) */
            <div className="absolute inset-0 flex items-end justify-end p-4 sm:p-8 pointer-events-none z-20">
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-lg bg-[#FFFDF9] border border-[#E8DED5] rounded-[32px] p-6 sm:p-7 shadow-2xl pointer-events-auto space-y-5 font-sans select-none"
              >
                {/* Header Row: Step Pill, Progress Dots, Skip */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[#6F4E37] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                      STEP {currentStep + 1} OF {TAB_TOUR_STEPS.length}
                    </span>

                    {/* Progress Dots Indicator (Clickable Jump Navigation) */}
                    <div className="flex items-center gap-1.5">
                      {TAB_TOUR_STEPS.map((stepItem, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => jumpToStep(i)}
                          title={`Jump to Step ${i + 1}: ${stepItem.title}`}
                          className={`rounded-full transition-all cursor-pointer ${
                            i === currentStep 
                              ? 'w-4 h-2 bg-[#6F4E37] shadow-xs' 
                              : 'w-2 h-2 bg-[#E8DED5] hover:bg-[#6F4E37]/50'
                          }`} 
                          aria-label={`Jump to Step ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleSkip}
                    className="text-xs font-bold text-[#8C6D58] hover:text-[#2C1810] transition-colors cursor-pointer"
                  >
                    Skip Tour
                  </button>
                </div>

                {/* Title & Icon Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#6F4E37]/25">
                      <StepIcon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xl font-extrabold text-[#2C1810] tracking-tight leading-tight">
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-black text-[#A67B5B] uppercase tracking-wider block">
                        {step.category}
                      </span>
                    </div>
                  </div>

                  {/* Verified Badge if Present */}
                  {step.badge && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
                      {step.badge}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#8C6D58] font-medium leading-relaxed">
                  {step.description}
                </p>

                {/* Status Box if Present */}
                {step.statusBox && (
                  <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-extrabold text-emerald-950 shadow-2xs">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                    <span>{step.statusBox.text}</span>
                  </div>
                )}

                {/* Info Box if Present */}
                {step.infoBox && (
                  <div className="bg-white border border-[#E8DED5] rounded-2xl p-3.5 flex items-center justify-between text-xs font-extrabold text-[#2C1810] shadow-2xs">
                    <span className="text-[#8C6D58] font-bold">{step.infoBox.label}</span>
                    <span className="font-mono text-xs text-[#2C1810]">{step.infoBox.val}</span>
                  </div>
                )}

                {/* Key Metrics Tracked Box (Interactive Clickable Checkboxes) */}
                {step.metrics && (
                  <div className="bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
                        KEY METRICS TRACKED:
                      </span>
                      <span className="text-[9px] font-bold text-[#A67B5B]">
                        Tap metric to toggle check
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold text-[#2C1810]">
                      {step.metrics.map((m, idx) => {
                        const isChecked = checkedMetrics[`${currentStep}-${idx}`] ?? true;
                        return (
                          <div 
                            key={idx} 
                            onClick={() => toggleMetric(currentStep, idx)}
                            className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-all cursor-pointer ${
                              isChecked 
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs' 
                                : 'bg-white border-[#E8DED5] text-[#8C6D58] opacity-70'
                            }`}
                          >
                            <Check className={`w-3.5 h-3.5 stroke-[3] shrink-0 ${isChecked ? 'text-emerald-600' : 'text-gray-400'}`} />
                            <span className="truncate">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom Action Pill Buttons (Back, Optional Action, Next Step) */}
                <div className="flex items-center justify-between pt-1">
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-5 py-2.5 rounded-full border border-[#E8DED5] bg-white hover:bg-[#FFF8F0] text-[#2C1810] text-xs font-extrabold transition-all flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2 ml-auto">
                    {step.actionBtn && (
                      <button
                        type="button"
                        onClick={() => router.push(step.actionBtn.route)}
                        className="px-4 py-2.5 rounded-full bg-[#6F4E37]/15 hover:bg-[#6F4E37]/25 text-[#6F4E37] text-xs font-extrabold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <span>{step.actionBtn.label}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-full bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs font-extrabold shadow-md shadow-[#6F4E37]/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>{currentStep === TAB_TOUR_STEPS.length - 1 ? 'Finish Tour 🎉' : 'Next Step'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CELEBRATION MODAL WITH BALLOONS & CONFETTI             */}
      {/* ======================================================== */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-auto z-50 overflow-hidden bg-[#1F140E]/60 backdrop-blur-xs">
          
          {/* Animated Colorful Balloons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {BALLOONS.map((b, idx) => (
              <motion.div
                key={idx}
                initial={{ y: '115vh', opacity: 0.9, rotate: idx % 2 === 0 ? -6 : 6 }}
                animate={{ y: '-25vh', opacity: 1, rotate: idx % 2 === 0 ? 8 : -8 }}
                transition={{
                  duration: 6 + (idx % 3),
                  delay: b.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ left: b.left }}
                className="absolute flex flex-col items-center z-10"
              >
                <div 
                  className={`${b.size || 'w-14 h-18'} rounded-full shadow-lg relative flex items-center justify-center`}
                  style={{ 
                    backgroundColor: b.color,
                    backgroundImage: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), ${b.color} 70%)`
                  }}
                >
                  <div className="w-3.5 h-4 bg-white/40 rounded-full absolute top-2 left-2.5 blur-[0.5px]" />
                </div>
                <div className="w-2.5 h-2.5 rounded-full -mt-1 shadow-xs" style={{ backgroundColor: b.color }} />
                <div className="w-0.5 h-20 bg-white/50" />
              </motion.div>
            ))}

            {/* Colorful Festive Decoration Papers / Confetti / Streamers */}
            {CONFETTI_PIECES.map((c) => {
              if (c.type === 'star') {
                return (
                  <motion.div
                    key={c.id}
                    initial={{ y: '-10vh', x: `${c.x}vw`, rotate: 0, opacity: 1 }}
                    animate={{ y: '110vh', rotate: 720, opacity: 0 }}
                    transition={{
                      duration: c.duration,
                      delay: c.delay,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{ color: c.color, fontSize: `${c.size * 1.5}px` }}
                    className="absolute shadow-xs"
                  >
                    ★
                  </motion.div>
                );
              }

              if (c.type === 'ribbon') {
                return (
                  <motion.div
                    key={c.id}
                    initial={{ y: '-10vh', x: `${c.x}vw`, rotate: 0, opacity: 1 }}
                    animate={{ y: '110vh', rotate: 1080, opacity: 0 }}
                    transition={{
                      duration: c.duration,
                      delay: c.delay,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    style={{
                      backgroundColor: c.color,
                      width: `${c.size * 0.4}px`,
                      height: `${c.size * 2.2}px`,
                      borderRadius: '4px',
                    }}
                    className="absolute shadow-xs"
                  />
                );
              }

              return (
                <motion.div
                  key={c.id}
                  initial={{ y: '-10vh', x: `${c.x}vw`, rotate: 0, opacity: 1 }}
                  animate={{ y: '110vh', rotate: 720, opacity: 0 }}
                  transition={{
                    duration: c.duration,
                    delay: c.delay,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  style={{
                    backgroundColor: c.color,
                    width: `${c.size}px`,
                    height: `${c.type === 'circle' ? c.size : c.size * 1.2}px`,
                    borderRadius: c.type === 'circle' ? '50%' : '3px',
                  }}
                  className="absolute shadow-xs"
                />
              );
            })}
          </div>

          {/* Celebration Card (Matching Target Screenshot) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="w-full max-w-lg bg-[#FFFDF9] border border-[#E8DED5] rounded-[36px] p-8 sm:p-10 shadow-2xl relative text-center overflow-hidden my-auto select-none space-y-4"
          >
            {/* Glossy Orange/Amber Star Icon Box */}
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30">
              <Star className="w-10 h-10 fill-white text-white drop-shadow-md" />
            </div>

            {/* Step Complete Pill Badge */}
            <div className="inline-block">
              <span className="px-4 py-1.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20 font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                STEP {TAB_TOUR_STEPS.length} OF {TAB_TOUR_STEPS.length} • COMPLETE
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-[#2C1810] tracking-tight">
              You're All Set! 🎉
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#8C6D58] leading-relaxed font-medium max-w-md mx-auto">
              Your Fahara Owner Portal is ready. Monitor bookings, ratings, and revenue to start managing your venue and growing your business.
            </p>

            {/* Dual Action Buttons (Exact to Screenshot) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                type="button"
                onClick={finishAndGoToDashboard}
                className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white font-extrabold text-xs shadow-md shadow-[#6F4E37]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Go to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCelebration(false);
                  router.push('/event/services');
                }}
                className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-white hover:bg-[#FFF8F0] text-[#2C1810] border border-[#E8DED5] font-extrabold text-xs shadow-2xs flex items-center justify-center transition-all active:scale-95"
              >
                <span>Manage Event Services</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Tour Trigger Launcher Badge (Bottom Right) */}
      {!isOpen && !showCelebration && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setCurrentStep(0);
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#6F4E37] text-white shadow-xl hover:bg-[#5C3B29] border-2 border-white flex items-center justify-center cursor-pointer transition-all group"
          title="Launch Interactive Tour"
          aria-label="Launch Interactive Tour"
        >
          <Compass className="w-5 h-5 stroke-[2.2] group-hover:rotate-45 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
