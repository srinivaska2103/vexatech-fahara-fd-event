'use client';

import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7EFE5] via-[#FAF5EF] to-[#F2E8DC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-sans">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[440px] bg-white/95 backdrop-blur-md border border-white/80 rounded-[32px] shadow-2xl p-7 sm:p-9 relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

