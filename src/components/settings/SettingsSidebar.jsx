'use client';

import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { User, Briefcase, AlertTriangle, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 'profile', step: 1, title: 'Profile Settings', subtitle: 'Personal & contact info', icon: User },
  { id: 'business', step: 2, title: 'Business Details', subtitle: 'Tax, address & bank info', icon: Briefcase },
  { id: 'danger', step: 3, title: 'Danger Zone', subtitle: 'Account controls & security', icon: AlertTriangle, danger: true },
];

export default function SettingsSidebar() {
  const { activeTab, setActiveTab } = useSettingsStore();

  const currentStepObj = STEPS.find(s => s.id === activeTab) || STEPS[0];

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-4 font-sans select-none">
      
      {/* Desktop & Tablet Vertical Stepper */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-[#F2EAE1] pb-3">
          <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider block">
            SETUP WIZARD
          </span>
          <h3 className="text-base font-extrabold text-[#2C1810]">
            Step {currentStepObj.step} of {STEPS.length}
          </h3>
        </div>

        <nav className="space-y-2">
          {STEPS.map((stepItem) => {
            const isActive = activeTab === stepItem.id;
            const isCompleted = stepItem.step < currentStepObj.step;
            const Icon = stepItem.icon;

            return (
              <button
                key={stepItem.id}
                type="button"
                onClick={() => setActiveTab(stepItem.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left ${
                  isActive
                    ? stepItem.danger
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                      : 'bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/20 scale-[1.01]'
                    : isCompleted
                    ? 'bg-[#FFF8F0] text-[#6F4E37] hover:bg-[#6F4E37]/10'
                    : stepItem.danger
                    ? 'bg-white text-rose-600 hover:bg-rose-50 border border-transparent'
                    : 'bg-white text-[#8C6D58] hover:bg-[#FFF8F0] hover:text-[#2C1810]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isActive
                      ? stepItem.danger ? 'bg-rose-200 text-rose-800' : 'bg-white/20 text-white'
                      : isCompleted
                      ? 'bg-[#6F4E37]/10 text-[#6F4E37]'
                      : 'bg-[#FAF5EF] text-[#8C6D58]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-[#6F4E37]" /> : stepItem.step}
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-black block truncate leading-tight">
                      {stepItem.title}
                    </span>
                    <span className={`text-[10px] font-medium block truncate ${
                      isActive ? (stepItem.danger ? 'text-rose-600' : 'text-white/80') : 'text-[#8C6D58]'
                    }`}>
                      {stepItem.subtitle}
                    </span>
                  </div>
                </div>

                <Icon className={`w-4 h-4 shrink-0 ${isActive ? (stepItem.danger ? 'text-rose-700' : 'text-white') : 'text-[#8C6D58]'}`} />
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
