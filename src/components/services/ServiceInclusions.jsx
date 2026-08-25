'use client';

import { Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

const CARD_COLORS = [
  { bg: 'bg-amber-50/80', border: 'border-amber-200/80', text: 'text-amber-900', badgeBg: 'bg-amber-500', focusRing: 'focus:border-amber-500 focus:ring-amber-500/20' },
  { bg: 'bg-indigo-50/80', border: 'border-indigo-200/80', text: 'text-indigo-900', badgeBg: 'bg-indigo-500', focusRing: 'focus:border-indigo-500 focus:ring-indigo-500/20' },
  { bg: 'bg-emerald-50/80', border: 'border-emerald-200/80', text: 'text-emerald-900', badgeBg: 'bg-emerald-500', focusRing: 'focus:border-emerald-500 focus:ring-emerald-500/20' },
  { bg: 'bg-purple-50/80', border: 'border-purple-200/80', text: 'text-purple-900', badgeBg: 'bg-purple-500', focusRing: 'focus:border-purple-500 focus:ring-purple-500/20' },
  { bg: 'bg-rose-50/80', border: 'border-rose-200/80', text: 'text-rose-900', badgeBg: 'bg-rose-500', focusRing: 'focus:border-rose-500 focus:ring-rose-500/20' },
  { bg: 'bg-blue-50/80', border: 'border-blue-200/80', text: 'text-blue-900', badgeBg: 'bg-blue-500', focusRing: 'focus:border-blue-500 focus:ring-blue-500/20' },
];

export default function ServiceInclusions({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inclusions'
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-black text-[#2C1810] uppercase tracking-wider">Service Inclusions Cards</label>
          <p className="text-[11px] text-[#8C6D58] font-medium">Define key features and package highlights provided in this service.</p>
        </div>
        <button
          type="button"
          onClick={() => append({ value: '' })}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/20 hover:border-[#6F4E37] rounded-2xl text-xs font-black transition-all shadow-2xs active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Inclusion</span>
        </button>
      </div>
      
      {/* Grid of Side-by-Side Colorful Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {fields.map((field, index) => {
            const colorTheme = CARD_COLORS[index % CARD_COLORS.length];
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`relative p-4 rounded-3xl border ${colorTheme.bg} ${colorTheme.border} shadow-2xs flex flex-col justify-between group transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full ${colorTheme.badgeBg} text-white flex items-center justify-center text-[10px] font-black shadow-xs`}>
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-black text-[#8C6D58] uppercase tracking-wider">Inclusion Item</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-transparent"
                    title="Remove item"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <div className="space-y-1">
                  <input
                    {...register(`inclusions.${index}.value`)}
                    className={`w-full bg-white border border-[#E8DED5] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#2C1810] focus:outline-none transition-all ${colorTheme.focusRing}`}
                    placeholder="e.g. 2 Hours DJ Setup, Unlimited Drinks"
                  />
                  {errors?.inclusions?.[index]?.value && (
                    <p className="text-rose-600 text-[10px] font-extrabold mt-1">{errors.inclusions[index].value.message}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {fields.length === 0 && (
          <div className="col-span-full py-12 px-4 text-center bg-[#FFFDF9] rounded-3xl border border-dashed border-[#E8DED5]">
            <Sparkles className="w-8 h-8 text-[#6F4E37] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-[#2C1810] mb-1">No inclusions added yet</p>
            <p className="text-[11px] text-[#8C6D58] font-medium mb-3">Click 'Add Inclusion' above to create colorful feature cards.</p>
            <button
              type="button"
              onClick={() => append({ value: '' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6F4E37] text-white rounded-2xl text-xs font-bold shadow-xs hover:bg-[#5C402D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Inclusion</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
