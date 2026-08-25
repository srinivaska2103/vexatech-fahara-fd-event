'use client';

import React, { useState } from 'react';
import { 
  Sparkles, PlayCircle, Search, BookOpen, ChevronRight, 
  Building2, PackageSearch, Landmark, CalendarDays, Star, 
  RotateCcw, PhoneCall, Mail, CheckCircle2, ArrowRight, X,
  ShieldCheck, MessageCircle, ArrowUpRight, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStepCompletion = (guideId, stepIdx) => {
    setCompletedSteps(prev => {
      const guideObj = prev[guideId] || {};
      const nextState = { ...guideObj, [stepIdx]: !guideObj[stepIdx] };
      return { ...prev, [guideId]: nextState };
    });
  };

  const isStepCompleted = (guideId, stepIdx) => {
    return !!completedSteps[guideId]?.[stepIdx];
  };

  const getGuideProgress = (guideId, totalSteps) => {
    const guideObj = completedSteps[guideId] || {};
    const count = Object.values(guideObj).filter(Boolean).length;
    return Math.round((count / totalSteps) * 100);
  };

  const startTour = () => {
    try {
      localStorage.setItem('fahara_tour_completed', 'false');
      toast.success('Launching Interactive Guided Tour...');
      router.push('/event/dashboard');
    } catch (e) {
      toast.success('Redirecting to Dashboard Tour...');
      router.push('/event/dashboard');
    }
  };

  const topics = [
    { id: 'all', label: 'All Topics' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'bank-settlements', label: 'Bank & Settlements' },
    { id: 'bookings-events', label: 'Bookings & Events' },
    { id: 'ratings-reviews', label: 'Ratings & Reviews' },
  ];

  const guides = [
    {
      id: 'event-setup',
      topic: 'getting-started',
      badge: 'EVENT SETUP',
      icon: Building2,
      title: 'Setting Up Your Event Manager Profile & Details',
      desc: 'Learn how to upload your company logo, set business location details, operating hours, and contact details.',
      readTime: '3 min read',
      details: [
        'Navigate to Business → Company Profile in the sidebar menu.',
        'Upload your official event logo and cover banner image.',
        'Enter your registered business name, address, and GSTIN number.',
        'Save your changes to publish your verified partner profile.'
      ]
    },
    {
      id: 'services-packages',
      topic: 'getting-started',
      badge: 'SERVICES & PACKAGES',
      icon: PackageSearch,
      title: 'Creating & Managing Event Services & Packages',
      desc: 'Step-by-step instructions on setting up event packages, custom pricing tiers, add-ons, and inclusion lists.',
      readTime: '4 min read',
      details: [
        'Go to Business → Services in your dashboard sidebar.',
        'Click "Add New Service" to open the package creation modal.',
        'Specify package title, description, guest capacity, and pricing per event.',
        'Toggle availability status to make packages visible to customers.'
      ]
    },
    {
      id: 'bank-settlements',
      topic: 'bank-settlements',
      badge: 'RAZORPAY SETTLEMENTS',
      icon: Landmark,
      title: 'Linking Bank Accounts & Razorpay Route',
      desc: 'How to complete penny-drop bank verification and track automated vendor payout settlements within 7 business days.',
      readTime: '5 min read',
      details: [
        'Head to Finance → Payment Account in your dashboard sidebar.',
        'Review your linked bank account holder name and masked account number.',
        'Ensure IFSC Code and Settlement Capability show Verified & Active status.',
        'Payouts are transferred automatically via Razorpay Route within 7 business days.'
      ]
    },
    {
      id: 'bookings-events',
      topic: 'bookings-events',
      badge: 'BOOKING MANAGEMENT',
      icon: CalendarDays,
      title: 'Handling Reservations & Event Cancellations',
      desc: 'Manage incoming customer bookings, calendar schedule availability, status updates, and cancellation policies.',
      readTime: '4 min read',
      details: [
        'Navigate to Management → Bookings to view the Reservation Studio directory.',
        'Filter reservations by status (Pending, Confirmed, Completed, Cancelled).',
        'Click on any booking row to view customer contact, event date, and guest count.',
        'Use the Calendar view to inspect date slot availability across months.'
      ]
    },
    {
      id: 'ratings-reviews',
      topic: 'ratings-reviews',
      badge: 'RATINGS & REVIEWS',
      icon: Star,
      title: 'Managing Diners, Reviews & Reputation Studio',
      desc: 'Monitor customer feedback, respond to diner praise, and track overall event reputation metrics.',
      readTime: '3 min read',
      details: [
        'Go to Management → Reviews in your dashboard sidebar.',
        'Inspect your average star rating, total verified diner feedback, and response rate.',
        'Filter reviews by 5-Star Praise, 4-Star, or lower ratings.',
        'Submit official responses to customer feedback to build trust.'
      ]
    },
    {
      id: 'refunds-adjustments',
      topic: 'bank-settlements',
      badge: 'REFUNDS & ADJUSTMENTS',
      icon: RotateCcw,
      title: 'Customer Cancellation Refund Protocol',
      desc: 'Understand automated backend refund reversals, Razorpay gateway logs, and policy compliance.',
      readTime: '4 min read',
      details: [
        'Navigate to Finance → Refunds in your dashboard sidebar.',
        'Inspect completed refund logs, pending authorization claims, and adjustment amounts.',
        'Refunds are executed strictly via secure backend Fahara API integrations.',
        'Export CSV financial reports anytime for internal accounting.'
      ]
    }
  ];

  const filteredGuides = guides.filter(g => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.badge.toLowerCase().includes(q);
    if (!matchesSearch) return false;

    if (selectedTopic !== 'all' && g.topic !== selectedTopic) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 sm:pb-36">
      
      {/* Top Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] tracking-tight">
        Event Manager User Guide & Support
      </h1>

      {/* ========================================== */}
      {/* 1. INTERACTIVE ONBOARDING HERO BANNER CARD */}
      {/* ========================================== */}
      <div className="bg-gradient-to-br from-[#6F4E37] via-[#5D4037] to-[#432A1C] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/15 border border-amber-300/40 text-amber-200 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              INTERACTIVE ONBOARDING
            </span>
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              9 Step Tour
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            New to Fahara? Take the Interactive Guided Tour!
          </h2>

          <p className="text-xs sm:text-sm text-[#F3EFEA] font-medium leading-relaxed">
            Our step-by-step guided tour spotlights every key feature—from creating your event manager profile and linking Razorpay bank accounts to handling venue bookings and receiving payouts.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={startTour}
              className="bg-white text-[#2C1810] hover:bg-[#FFF8F0] px-6 py-3.5 rounded-full font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <PlayCircle className="w-4 h-4 text-[#6F4E37]" />
              <span>Start Guided Tour →</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. SEARCH & TOPIC FILTERS BAR              */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        {/* Search Input Left */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
          <input 
            type="text"
            placeholder="Search guides, topics, or FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
          />
        </div>

        {/* Topic Filter Pills Right */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTopic(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                selectedTopic === t.id
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. MAIN GUIDES & QUICK ACTIONS GRID        */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column (2/3 width): Step-by-Step User Guides */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#2C1810] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6F4E37]" />
              <span>Step-by-Step User Guides</span>
            </h3>
            <span className="text-xs text-[#8C6D58] font-bold">
              {filteredGuides.length} Guides Found
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={guide.id}
                  onClick={() => setActiveGuideModal(guide)}
                  className="bg-white border border-[#E8DED5] rounded-[28px] p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-[#6F4E37]/40 transition-all duration-300 cursor-pointer group relative overflow-hidden space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] border border-[#6F4E37]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                      {guide.badge}
                    </span>
                    <span className="text-xs text-[#8C6D58] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8C6D58]" />
                      {guide.readTime}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 text-[#6F4E37] group-hover:bg-[#6F4E37] group-hover:text-white group-hover:border-[#6F4E37] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-all duration-300 shadow-2xs">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-extrabold text-[#2C1810] group-hover:text-[#6F4E37] transition-colors leading-tight">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-[#8C6D58] font-medium leading-relaxed line-clamp-2">
                        {guide.desc}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] group-hover:bg-[#6F4E37] group-hover:text-white group-hover:border-[#6F4E37] flex items-center justify-center transition-all duration-300 shrink-0 self-center shadow-2xs">
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1/3 width): Quick Actions, Payout Status, WhatsApp & Hotline */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Quick Tour Actions Card */}
          <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-[#8C6D58] uppercase tracking-wider block flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-[#6F4E37]" />
                QUICK TOUR ACTIONS
              </span>
              <p className="text-xs text-[#8C6D58] font-medium leading-relaxed">
                Need a refresher on how the portal works? Launch the 9-step interactive guided overlay anytime.
              </p>
            </div>

            <button
              type="button"
              onClick={startTour}
              className="w-full py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white font-extrabold text-xs shadow-md shadow-[#6F4E37]/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Restart Interactive Tour</span>
            </button>
          </div>

          {/* Card 2: Verified Cashfree Payouts Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                Verified Razorpay Payouts
              </span>
              <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                Payouts are automatically transferred 7 business days after marking reservations as Completed.
              </p>
            </div>

            <Link
              href="/event/finance/payment-account"
              className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md shadow-emerald-800/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center block"
            >
              <span>Check Bank Status →</span>
            </Link>
          </div>

          {/* Card 3: Direct Support Desk & WhatsApp */}
          <div className="space-y-2">
            <span className="text-xs font-black text-[#8C6D58] uppercase tracking-wider block px-1">
              DIRECT SUPPORT DESK
            </span>

            <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-white stroke-none" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#2C1810]">WhatsApp Support</h4>
                  <p className="text-xs text-[#8C6D58] font-bold">+91 89460 29205</p>
                </div>
              </div>

              <a
                href="https://wa.me/918946029205"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 block text-center"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 4: 24/7 Dedicated Partner Hotline */}
          <div className="bg-[#FFF8F0]/90 border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-[#6F4E37] uppercase tracking-wider block flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                24/7 DEDICATED PARTNER HOTLINE
              </span>
              <p className="text-xs text-[#8C6D58] font-medium leading-relaxed">
                Speak directly with your assigned Fahara Partner Executive for priority onboarding and setup assistance.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a 
                href="tel:+918946029205"
                className="p-3 bg-white border border-[#E8DED5] rounded-2xl flex items-center gap-3 hover:border-[#6F4E37] transition-all block"
              >
                <PhoneCall className="w-4 h-4 text-[#6F4E37] shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-[#8C6D58] uppercase block">Toll-Free Helpline</span>
                  <span className="text-xs font-extrabold text-[#2C1810]">+91 89460 29205</span>
                </div>
              </a>

              <a 
                href="mailto:vexatech.connect@gmail.com"
                className="p-3 bg-white border border-[#E8DED5] rounded-2xl flex items-center gap-3 hover:border-[#6F4E37] transition-all block"
              >
                <Mail className="w-4 h-4 text-[#6F4E37] shrink-0" />
                <div>
                  <span className="text-[10px] font-black text-[#8C6D58] uppercase block">Partner Inbox</span>
                  <span className="text-xs font-extrabold text-[#2C1810]">vexatech.connect@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Modern Guide Detail Modal */}
      <AnimatePresence>
        {activeGuideModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1C100B]/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveGuideModal(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFDFB] border border-[#E8DED5] rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden select-none"
            >
              {/* Header Tag Badge & Close Button */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-black text-[#6F4E37] bg-[#FFF8F0] border border-[#6F4E37]/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#6F4E37]" />
                  {activeGuideModal.badge}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveGuideModal(null)}
                  className="w-9 h-9 rounded-full bg-[#FFF8F0] border border-[#E8DED5] text-[#6F4E37] hover:bg-[#6F4E37] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs active:scale-90"
                  aria-label="Close Guide"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight leading-snug">
                  {activeGuideModal.title}
                </h3>
                <p className="text-xs text-[#8C6D58] font-medium leading-relaxed">
                  {activeGuideModal.desc}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#E8DED5]" />

              {/* Progress Tracker & Procedure List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-[#2C1810] uppercase tracking-wider text-[11px]">
                    INSTRUCTIONS & PROCEDURE
                  </span>
                  <span className="text-[#6F4E37] text-[11px] font-extrabold">
                    {getGuideProgress(activeGuideModal.id, activeGuideModal.details.length)}% Completed
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2 bg-[#FFF8F0] rounded-full border border-[#E8DED5] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getGuideProgress(activeGuideModal.id, activeGuideModal.details.length)}%` }}
                    className="h-full bg-[#6F4E37] rounded-full transition-all duration-300"
                  />
                </div>

                {/* Interactive Steps List */}
                <div className="space-y-2.5 pt-1">
                  {activeGuideModal.details.map((step, idx) => {
                    const isCompleted = isStepCompleted(activeGuideModal.id, idx);
                    return (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        key={idx}
                        onClick={() => toggleStepCompletion(activeGuideModal.id, idx)}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
                            : 'bg-[#FFFDF9] border-[#E8DED5] hover:bg-[#FFF8F0] hover:border-[#6F4E37]/30 text-[#2C1810]'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isCompleted 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-[#6F4E37] text-white shadow-xs'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
                        </div>
                        <span className={`text-xs font-semibold leading-relaxed flex-1 ${
                          isCompleted ? 'line-through text-emerald-800/80' : 'text-[#2C1810]'
                        }`}>
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGuideModal(null)}
                  className="w-full py-3.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-[#6F4E37]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Got It, Close Guide</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
