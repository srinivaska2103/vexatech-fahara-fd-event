'use client';

import React, { useState, useEffect } from 'react';
import { 
  Coffee, Sparkles, Building2, ShieldCheck, Loader2, Star, 
  Store, CalendarDays, CheckCircle2, Zap, Trophy, Flame, Key, CreditCard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  { text: "Connecting to Fahara Event Cloud...", progress: 25 },
  { text: "Syncing Venue Schedule & Bookings...", progress: 55 },
  { text: "Verifying Razorpay Payout Engine...", progress: 80 },
  { text: "Launching Owner Workspace...", progress: 98 },
];

const INITIAL_OBSTACLES = [
  { id: 1, label: 'Cafe Booking', xp: 50, icon: Coffee, pos: { top: '10%', left: '2%' }, mdPos: { top: '15%', left: '12%' }, color: 'bg-[#6F4E37] text-white' },
  { id: 2, label: 'VIP Reservation', xp: 100, icon: CalendarDays, pos: { top: '10%', right: '2%' }, mdPos: { top: '18%', right: '14%' }, color: 'bg-amber-700 text-white' },
  { id: 3, label: 'Razorpay Payout', xp: 75, icon: CreditCard, pos: { bottom: '16%', left: '2%' }, mdPos: { bottom: '22%', left: '16%' }, color: 'bg-emerald-700 text-white' },
  { id: 4, label: '5-Star Review', xp: 60, icon: Star, pos: { bottom: '16%', right: '2%' }, mdPos: { bottom: '25%', right: '16%' }, color: 'bg-yellow-600 text-white' },
  { id: 5, label: 'Venue Key Pass', xp: 80, icon: Key, pos: { top: '46%', left: '1%' }, mdPos: { top: '50%', left: '6%' }, color: 'bg-indigo-700 text-white' },
  { id: 6, label: 'Operations Boost', xp: 120, icon: Flame, pos: { top: '46%', right: '1%' }, mdPos: { top: '52%', right: '6%' }, color: 'bg-rose-600 text-white' },
];

export default function LoadingScreen({ text: initialText = "Preparing owner workspace..." }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [clearedObstacles, setClearedObstacles] = useState({});
  const [popFeedback, setPopFeedback] = useState(null);

  // Cycle through loading steps dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, []);

  const currentStep = LOADING_STEPS[currentStepIdx];

  // Handle Obstacle Click / Tap
  const handleObstacleClick = (obs, event) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const newScore = score + obs.xp;
    setScore(newScore);
    setPoppedCount(prev => prev + 1);

    // Mark cleared temporarily
    setClearedObstacles(prev => ({ ...prev, [obs.id]: true }));

    // Show feedback float text
    setPopFeedback({
      id: Date.now(),
      text: `+${obs.xp} XP! 🎯`,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });

    // Respawn obstacle after 4s
    setTimeout(() => {
      setClearedObstacles(prev => ({ ...prev, [obs.id]: false }));
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-6 px-3 sm:px-6 bg-[#FFFDFB] select-none font-sans overflow-hidden">
      
      {/* Background Soft Coffee Radial Gradients */}
      <div className="absolute top-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#FAF0E6]/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#F5E6D3]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Floating XP Pop Text Feedback */}
      <AnimatePresence>
        {popFeedback && (
          <motion.div
            key={popFeedback.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -45, scale: 1.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{ left: popFeedback.x - 35, top: popFeedback.y }}
            className="fixed z-50 pointer-events-none text-xs sm:text-sm font-black text-[#5C3B29] bg-white/95 border border-[#E8DED5] px-2.5 py-1 rounded-full shadow-lg"
          >
            {popFeedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 1. TOP WIDGET: MINI-GAME SCORE BAR */}
      {/* ======================================================== */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 w-full flex justify-center px-2"
      >
        <div className="bg-white/95 backdrop-blur-md border border-[#E8DED5] rounded-full px-3 sm:px-5 py-1.5 sm:py-2 shadow-2xs flex items-center justify-between sm:justify-center gap-2 sm:gap-3 text-xs max-w-[94vw] sm:max-w-md w-full sm:w-auto">
          <div className="flex items-center gap-1.5 font-black text-[#6F4E37] shrink-0">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400" />
            <span className="text-[11px] sm:text-xs">SCORE: {score} PTS</span>
          </div>
          <span className="text-[#E8DED5]">•</span>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#8C6D58] font-bold truncate min-w-0">
            <Zap className="w-3 h-3 text-amber-600 fill-amber-500 shrink-0" />
            <span className="truncate">Tap badges to clear! ({poppedCount} cleared)</span>
          </div>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* 2. FLOATING OBSTACLES MINI-GAME (DYNAMIC RESPONSIVE TARGETS) */}
      {/* ======================================================== */}
      {INITIAL_OBSTACLES.map((obs) => {
        const Icon = obs.icon;
        const isCleared = clearedObstacles[obs.id];

        return (
          <motion.div
            key={obs.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -6, 0, 6, 0],
            }}
            transition={{
              y: {
                duration: 3 + obs.id * 0.4,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              opacity: { duration: 0.4 }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleObstacleClick(obs, e)}
            style={{
              top: obs.pos.top,
              left: obs.pos.left,
              right: obs.pos.right,
              bottom: obs.pos.bottom,
            }}
            className="absolute z-20 cursor-pointer touch-manipulation"
          >
            <div 
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-[#E8DED5] shadow-2xs hover:shadow-md flex items-center gap-1.5 sm:gap-2.5 transition-all group ${
                isCleared ? 'bg-emerald-50 border-emerald-300 scale-95 opacity-60' : 'bg-white/95 backdrop-blur-xs'
              }`}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${obs.color}`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-[11px] font-black text-[#2C1810] leading-tight whitespace-nowrap">
                  {isCleared ? 'Cleared! ✔' : obs.label}
                </span>
                <span className="text-[8px] sm:text-[9px] font-extrabold text-[#8C6D58] uppercase tracking-wider flex items-center gap-1 leading-none mt-0.5">
                  {isCleared ? (
                    <span className="text-emerald-700 font-bold">+ {obs.xp} XP</span>
                  ) : (
                    <span className="text-[#6F4E37] font-bold">+{obs.xp} PTS</span>
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* ======================================================== */}
      {/* 3. CENTER SPINNER WITH FAHARA LOGO IMAGE */}
      {/* ======================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-sm w-full my-auto">
        
        {/* Outer Circular Disk Container */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#FAF0E6]/90 border border-[#E8DED5] flex items-center justify-center p-2.5 sm:p-3 shadow-2xs mb-4 sm:mb-5">
          
          {/* 1. Animated Outer Dark Brown Arc Spinner Ring */}
          <div 
            className="absolute inset-0 rounded-full border-[3px] sm:border-[3.5px] border-transparent border-t-[#5C3B29] border-r-[#5C3B29] animate-spin" 
            style={{ animationDuration: '2.2s' }} 
          />

          {/* 2. Secondary Glowing Counter Arc Ring */}
          <div 
            className="absolute inset-1 rounded-full border-[2px] border-transparent border-b-amber-500/60 animate-spin" 
            style={{ animationDuration: '3.6s', animationDirection: 'reverse' }} 
          />

          {/* 3. Inner Dashed Concentric Circle Container */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-dashed border-[#6F4E37]/50 flex items-center justify-center relative bg-[#FFFDFB]">
            
            {/* Center Logo Square Badge Card */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white border border-[#E8DED5] p-1 shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer z-30 opacity-100">
              <img 
                src="/fahara-logo.jpeg" 
                alt="Fahara Logo" 
                className="w-full h-full object-cover rounded-lg sm:rounded-xl transition-transform duration-300 group-hover:scale-110 max-w-full max-h-full"
                style={{ width: '100%', height: '100%', objectFit: 'cover', maxWidth: '64px', maxHeight: '64px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  if (e.target.parentElement) {
                    e.target.parentElement.innerText = 'F';
                    e.target.parentElement.className = 'w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#6F4E37] text-white font-black flex items-center justify-center text-xl shadow-md';
                  }
                }}
              />
            </div>

          </div>

        </div>

        {/* Text Stack Below Center Spinner */}
        <div className="space-y-1 sm:space-y-1.5 w-full">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg sm:text-2xl font-black text-[#2C1810] tracking-tight">
              Fahara Venue Partner
            </h2>
          </div>
          
          <p className="text-[10px] sm:text-xs font-bold text-[#8C6D58] uppercase tracking-wider">
            LIVE OPERATION STUDIO
          </p>

          {/* Dynamic Progress Indicator */}
          <div className="pt-2 sm:pt-3 space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#6F4E37]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6F4E37]" />
              <span className="truncate max-w-[240px] sm:max-w-none">{currentStep?.text || initialText}</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-44 sm:w-56 mx-auto h-2 bg-[#FFF8F0] rounded-full border border-[#E8DED5] overflow-hidden p-0.5 shadow-2xs">
              <motion.div 
                initial={{ width: '10%' }}
                animate={{ width: `${currentStep?.progress || 60}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#6F4E37] to-[#5C3B29] rounded-full shadow-xs"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Bottom Tip Bar Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-20 px-2 max-w-[94vw] sm:max-w-md w-full"
      >
        <div className="bg-white/95 backdrop-blur-xs border border-[#E8DED5] rounded-full px-3 sm:px-4 py-1.5 shadow-2xs flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-[#8C6D58] font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
          <span className="truncate">Interactive Mini-Game Active! Click any badge to pop it!</span>
        </div>
      </motion.div>

    </div>
  );
}
