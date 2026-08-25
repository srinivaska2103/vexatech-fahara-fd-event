'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 md:p-14 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative"
      >
        {/* Floating icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center text-primary mb-8 border border-white/10 shadow-inner"
        >
          <Compass className="w-12 h-12" />
        </motion.div>

        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-text to-text/50 mb-4 tracking-tighter">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-text mb-4 tracking-tight">
          Page Not Found
        </h2>
        
        <p className="text-text/60 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
          Oops! It seems you've wandered off the map. The page you are looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl font-bold tracking-wide transition-all shadow-[0_8px_25px_rgba(var(--primary),0.3)] hover:shadow-[0_12px_30px_rgba(var(--primary),0.4)] overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Home className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Back to Dashboard</span>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
