'use client';

import { motion } from 'framer-motion';

export default function AuthIllustration() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="relative w-full max-w-lg aspect-square">
        {/* Abstract decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-primary/20 border-dashed"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 rounded-full border border-secondary/30"
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-16 rounded-full bg-gradient-to-tr from-primary/10 to-accent/20 blur-xl"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-primary mb-4">
              Manage Your Events
              <br />With Elegance
            </h2>
            <p className="text-lg text-text/80">
              The premier platform for professional event managers. Connect with clients, manage bookings, and scale your business.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
