'use client';

import { useProfileStore } from '@/store/profileStore';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertCircle } from 'lucide-react';

export default function ProfileCompletionCard() {
  const percentage = useProfileStore((state) => state.getCompletionPercentage());

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
      {percentage === 100 && (
        <div className="absolute inset-0 bg-green-500/5 opacity-50 pointer-events-none animate-pulse mix-blend-overlay" />
      )}
      <div className="w-24 h-24 shrink-0 relative z-10">
        <CircularProgressbar 
          value={percentage} 
          text={`${percentage}%`} 
          styles={buildStyles({
            pathColor: percentage === 100 ? '#10b981' : '#8b5cf6', // using primary/emerald
            textColor: '#1f2937',
            trailColor: 'rgba(255,255,255,0.2)',
            textSize: '22px',
            pathTransitionDuration: 0.8
          })}
        />
      </div>
      
      <div className="flex-1 text-center sm:text-left relative z-10">
        <h3 className="text-xl font-bold text-text mb-1 tracking-tight">Profile Completion</h3>
        
        {percentage === 100 ? (
          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl backdrop-blur-sm mt-3 inline-block">
            <p className="text-sm text-green-600 font-bold">
              Excellent! Your profile is 100% complete and ready for customers.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-text/60 mb-4 font-medium">
              Complete your profile to build trust with customers and improve your visibility.
            </p>
            <div className="flex items-start gap-3 bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700 font-medium text-left leading-relaxed">
                Missing details may prevent you from appearing in top search results. Please fill in all required sections below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
