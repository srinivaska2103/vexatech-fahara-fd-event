'use client';

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, User, Briefcase, AlertTriangle } from 'lucide-react';

import SettingsSidebar from '@/components/settings/SettingsSidebar';
import ProfileSettings from '@/components/settings/ProfileSettings';
import BusinessSettings from '@/components/settings/BusinessSettings';
import DangerZone from '@/components/settings/DangerZone';

const STEPS = [
  { id: 'profile', step: 1, title: 'Profile Settings', icon: User },
  { id: 'business', step: 2, title: 'Business Details', icon: Briefcase },
  { id: 'danger', step: 3, title: 'Danger Zone', icon: AlertTriangle, danger: true },
];

export default function SettingsPage() {
  const { activeTab, setActiveTab } = useSettingsStore();

  const currentStepObj = STEPS.find(s => s.id === activeTab) || STEPS[0];
  const progressPercent = Math.round((currentStepObj.step / STEPS.length) * 100);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />;
      case 'business': return <BusinessSettings />;
      case 'danger': return <DangerZone />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans pb-28 sm:pb-36">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER & STEP WIZARD PROGRESS  */}
      {/* ========================================== */}
      <div className="bg-[#FFF5F5]/80 border border-[#FEE2E2] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E50914]/10 via-[#B71C1C]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-[11px] font-black uppercase tracking-widest">
                <Settings className="w-3.5 h-3.5" />
                <span>Partner Account Studio</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
                Settings & Profile Setup
              </h1>
              
              <p className="text-xs sm:text-sm text-[#757575] font-medium max-w-2xl leading-relaxed">
                Configure your partner profile, company address, and settlement bank details.
              </p>
            </div>

            <div className="bg-white border border-[#FEE2E2] px-4 py-2.5 rounded-2xl shadow-2xs shrink-0 self-start md:self-center">
              <span className="text-[10px] font-black text-[#757575] uppercase tracking-wider block">
                Setup Progress
              </span>
              <span className="text-sm font-extrabold text-[#252525]">
                Step {currentStepObj.step} of 3 ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-[#FEE2E2]/60 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-[#E50914] h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. RESPONSIVE MOBILE STEP PILLS BAR        */}
      {/* ========================================== */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STEPS.map((s) => {
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                isActive 
                  ? s.danger ? 'bg-rose-600 text-white shadow-xs' : 'bg-[#E50914] text-white shadow-xs'
                  : 'bg-white border border-[#FEE2E2] text-[#757575] hover:bg-[#FFF5F5]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">
                {s.step}
              </span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* 3. STEP CONTENT & SIDEBAR WIZARD LAYOUT    */}
      {/* ========================================== */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        <SettingsSidebar />
        
        <div className="flex-1 w-full min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
