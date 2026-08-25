import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Birthday', 'Wedding', 'Engagement', 'Corporate Event', 
  'Baby Shower', 'Anniversary', 'Reception', 'Housewarming', 
  'College Event', 'Festival', 'Other'
];

export default function ServiceCategorySelect({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && !CATEGORIES.includes(value) && value !== 'Other') {
      setIsCustom(true);
      setCustomValue(value);
    } else if (value === 'Other') {
      setIsCustom(true);
    }
  }, [value]);

  const handleSelect = (category) => {
    if (category === 'Other') {
      setIsCustom(true);
      onChange(''); // clear it so user can type
    } else {
      setIsCustom(false);
      onChange(category);
    }
    setIsOpen(false);
  };

  const displayValue = isCustom ? customValue : value;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-text mb-2">Category *</label>
      
      {!isCustom ? (
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between bg-background hover:bg-surface border ${error ? 'border-red-500' : 'border-border hover:border-primary/50'} rounded-xl px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm`}
        >
          <span className={displayValue ? 'text-text' : 'text-text/40'}>
            {displayValue || 'Select a category'}
          </span>
          <ChevronDown className={`w-5 h-5 text-text/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Type custom category..."
            className={`flex-1 bg-background border ${error ? 'border-red-500' : 'border-border focus:border-primary'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
              setCustomValue('');
              onChange('');
            }}
            className="px-4 py-3 rounded-xl bg-surface border border-border text-sm font-medium hover:bg-background transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}

      <AnimatePresence>
        {isOpen && !isCustom && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {CATEGORIES.map((category) => (
              <div
                key={category}
                onClick={() => handleSelect(category)}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-primary/5 cursor-pointer transition-colors"
              >
                <span className={`text-sm ${value === category ? 'font-bold text-primary' : 'text-text'}`}>
                  {category}
                </span>
                {value === category && <Check className="w-4 h-4 text-primary" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
