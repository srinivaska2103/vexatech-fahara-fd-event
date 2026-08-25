'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import axiosInstance from '@/lib/axios';

export default function DangerZone() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { setActiveTab } = useSettingsStore();

  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== 'DELETE') {
      toast.error("Please type DELETE to confirm account deletion.");
      return;
    }

    setIsDeleting(true);

    try {
      await axiosInstance.delete('/settings/account');
      toast.success("Your account has been deleted successfully.");
      setIsModalOpen(false);
      logout();
      router.push('/event/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-200 shadow-xs p-6 sm:p-8 space-y-6 select-none font-sans">
      
      {/* Header */}
      <div className="border-b border-rose-100 pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-widest">
          <span>STEP 3 OF 3 • DANGER ZONE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-rose-950">Danger Zone & Security</h2>
        <p className="text-xs text-rose-700/80 font-medium">Irreversible actions that affect your account and partner profile.</p>
      </div>

      <div className="border border-rose-200 bg-rose-50/40 p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-[#2C1810] text-sm sm:text-base">Delete Partner Account</h4>
          <p className="text-xs text-[#8C6D58] font-medium mt-1 max-w-lg leading-relaxed">
            Permanently remove your venue partner account and all of its contents from the Fahara platform. This action is not reversible.
          </p>
        </div>

        <button 
          type="button"
          onClick={() => {
            setConfirmText('');
            setIsModalOpen(true);
          }}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl font-extrabold text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Bottom Action Wizard Bar */}
      <div className="pt-6 border-t border-[#F2EAE1] flex items-center justify-between gap-4">
        <button 
          type="button" 
          onClick={() => setActiveTab('business')}
          className="px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] text-xs font-bold shadow-2xs flex items-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#8C6D58]" />
          <span>Back to Step 2</span>
        </button>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          ✓ Setup Complete
        </span>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-rose-200"
            >
              <div className="flex justify-between items-center p-5 border-b border-rose-100 bg-rose-50">
                <h3 className="text-base font-extrabold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Confirm Account Deletion
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-[#8C6D58] font-semibold leading-relaxed">
                  Are you absolutely sure you want to delete your account? This will immediately wipe all your data, including bookings, customer records, and settings.
                </p>

                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-2">
                  <label htmlFor="deleteConfirmInput" className="text-xs text-rose-900 font-bold block">
                    Please type <span className="bg-white px-1.5 py-0.5 rounded border border-rose-300 font-mono text-rose-600">DELETE</span> to confirm.
                  </label>
                  <input 
                    id="deleteConfirmInput"
                    type="text" 
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-rose-300 rounded-xl text-xs font-bold text-[#2C1810] focus:outline-none focus:border-rose-600"
                    placeholder="Type DELETE"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || confirmText.trim().toUpperCase() !== 'DELETE'}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Yes, Delete Account</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
