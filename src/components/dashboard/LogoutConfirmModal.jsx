'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle } from 'lucide-react';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-text/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative bg-surface rounded-2xl p-6 shadow-2xl border border-border max-w-sm w-full z-10 space-y-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          {/* Icon Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 id="logout-modal-title" className="text-lg font-bold text-text">
                Confirm Logout
              </h3>
              <p className="text-xs text-text/60 mt-0.5">
                Fahara Event Dashboard
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text/80 leading-relaxed">
            Are you sure you want to log out? You will need to sign in again to access your business bookings and revenue.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-text/80 text-sm font-medium hover:bg-background transition-colors active:scale-95 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-600/20 transition-all active:scale-95 min-h-[44px] flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Yes, Logout</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
