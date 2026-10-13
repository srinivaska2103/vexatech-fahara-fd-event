'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Minus, 
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InclusionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Cake');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || initialData.inclusion_name || '');
      setDescription(initialData.description || '');
      setQuantity(initialData.quantity || 1);
      setUnit(initialData.unit || 'Cake');
    } else {
      setName('');
      setDescription('');
      setQuantity(1);
      setUnit('Cake');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!name.trim()) return;

    onSave({
      id: initialData?.id || `inc_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      quantity: Math.max(1, Number(quantity) || 1),
      unit: unit.trim() || 'Unit'
    });

    onClose();
  };

  const incrementQty = () => setQuantity(prev => (Number(prev) || 0) + 1);
  const decrementQty = () => setQuantity(prev => Math.max(1, (Number(prev) || 1) - 1));

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#2C1810]/60 backdrop-blur-xs p-0 sm:p-4 select-none font-sans"
        onClick={onClose}
      >
        {/* Modal Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-[#E8DED5] shadow-2xl p-5 sm:p-6 space-y-5 text-[#2C1810]"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DED5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#2C1810]">
                  {initialData ? 'Edit Custom Inclusion' : 'Add Custom Inclusion'}
                </h3>
                <p className="text-[11px] text-[#2C1810]/60">Specify items included in this event package.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl text-[#2C1810]/50 hover:bg-[#FFF8F0] hover:text-[#2C1810] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="space-y-4">
            
            {/* Inclusion Name */}
            <div className="space-y-1">
              <label className="text-xs font-black text-[#2C1810]" htmlFor="inc_name">Inclusion Name *</label>
              <input
                id="inc_name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Birthday Cake, Welcome Drinks, Balloon Setup..."
                className="w-full h-11 px-3.5 text-xs font-bold rounded-xl border border-[#E8DED5] focus:outline-none focus:border-[#6F4E37] text-[#2C1810]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-black text-[#2C1810]" htmlFor="inc_desc">Description (Optional)</label>
              <input
                id="inc_desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 1 Kg Chocolate Cake, Table setup with fairy lights..."
                className="w-full h-11 px-3.5 text-xs font-medium rounded-xl border border-[#E8DED5] focus:outline-none focus:border-[#6F4E37] text-[#2C1810]"
              />
            </div>

            {/* Quantity & Unit Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Stepper Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-black text-[#2C1810]" htmlFor="inc_qty">Quantity *</label>
                <div className="flex items-center gap-2 h-11 p-1 bg-[#FFF8F0] rounded-xl border border-[#E8DED5]">
                  <button
                    type="button"
                    onClick={decrementQty}
                    className="w-9 h-full rounded-lg bg-white border border-[#E8DED5] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 font-extrabold shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    id="inc_qty"
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full h-full border-none bg-transparent text-center font-black text-sm p-0 focus:outline-none text-[#2C1810]"
                  />

                  <button
                    type="button"
                    onClick={incrementQty}
                    className="w-9 h-full rounded-lg bg-[#6F4E37] text-white hover:bg-[#5D3F2B] flex items-center justify-center transition-all cursor-pointer shrink-0 font-extrabold shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Unit Input */}
              <div className="space-y-1">
                <label className="text-xs font-black text-[#2C1810]" htmlFor="inc_unit">Unit *</label>
                <input
                  id="inc_unit"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. Cake, Guests, Hours, Setup"
                  className="w-full h-11 px-3.5 text-xs font-bold rounded-xl border border-[#E8DED5] focus:outline-none focus:border-[#6F4E37] text-[#2C1810]"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E8DED5] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-[#E8DED5] text-xs font-bold text-[#2C1810] hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                className="py-2.5 px-6 rounded-xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{initialData ? 'Save Inclusion' : 'Add Inclusion'}</span>
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
