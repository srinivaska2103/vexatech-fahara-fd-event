import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, isDeleting }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none font-sans">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#2C1810]/40 backdrop-blur-xs"
          onClick={!isDeleting ? onClose : undefined}
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative bg-white w-full max-w-[92vw] sm:max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8DED5] z-10"
        >
          <button 
            onClick={!isDeleting ? onClose : undefined}
            className="absolute top-4 right-4 text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0] p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-[#2C1810] mb-1.5 tracking-tight">{title || 'Confirm Deletion'}</h3>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-semibold mb-6 leading-relaxed">
              {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
            </p>

            <div className="flex items-center gap-2.5 w-full">
              <button 
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-[#2C1810] bg-[#FFFBF7] hover:bg-white border border-[#E8DED5] transition-all disabled:opacity-50 cursor-pointer text-xs sm:text-sm active:scale-98 shadow-2xs"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all disabled:opacity-70 flex items-center justify-center cursor-pointer text-xs sm:text-sm active:scale-98"
              >
                {isDeleting ? 'Deleting...' : 'Delete Item'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
