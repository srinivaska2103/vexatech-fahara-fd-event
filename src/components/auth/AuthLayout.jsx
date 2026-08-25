'use client';

import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FBF6F0] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-white border border-[#F0E6DD] rounded-[28px] shadow-xl shadow-[#6F4E37]/[0.06] p-7 sm:p-9 relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

