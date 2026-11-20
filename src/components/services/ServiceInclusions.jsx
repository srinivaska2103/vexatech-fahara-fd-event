'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  Users,
  Tag,
  Gift,
  Music,
  Camera,
  Utensils,
  Mic,
  Home,
  X,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const WIZARD_STEPS = [
  { id: 1, title: 'Basic Details', subtitle: 'Name & Pricing Model' },
  { id: 2, title: 'Guest Capacity', subtitle: 'Min & Max Guests' },
  { id: 3, title: 'Tier Pricing', subtitle: 'Basic, Standard & Premium Tiers' },
];

const QUICK_PRESETS = [
  { name: 'Food & Catering', icon: Utensils, pType: 'PER_GUEST', bP: '200', bD: 'Basic Veg Buffet & Drinks', sP: '500', sD: 'Multi-Cuisine Buffet & Cake', pP: '1000', pD: 'Full Live Counters & Premium Banquet' },
  { name: 'Celebration Cake', icon: Gift, pType: 'FIXED', bP: '1000', bD: '1kg Classic Cake', sP: '2500', sD: '2kg Custom Theme Cake', pP: '5000', pD: '3-Tier Luxury Designer Cake' },
  { name: 'Event Decoration', icon: Home, pType: 'FIXED', bP: '2500', bD: 'Balloon Arch & Welcome Board', sP: '6000', sD: 'Theme Backdrop & Floral Setup', pP: '12000', pD: 'Full Stage & Royal LED Decor' },
  { name: 'Photography', icon: Camera, pType: 'FIXED', bP: '2000', bD: '2hr Digital Photos', sP: '5000', sD: '4hr HD Photo + Video', pP: '10000', pD: 'Cinematic Full Night Coverage' },
  { name: 'DJ & Sound', icon: Music, pType: 'FIXED', bP: '3000', bD: 'Basic DJ & Speaker Setup', sP: '6000', sD: 'Pro DJ + Disco Lights', pP: '12000', pD: 'VIP DJ + LED Stage & Smoke' },
  { name: 'Anchor / Host', icon: Mic, pType: 'FIXED', bP: '2000', bD: '2hr Host', sP: '4000', sD: '4hr Pro Anchor', pP: '8000', pD: 'Celebrity Emcee' },
];

export const ServiceInclusions = () => {
  const { watch, setValue } = useFormContext();
  const serviceInclusions = watch('inclusions') || [];

  const [wizardStep, setWizardStep] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);

  // Form state
  const [incName, setIncName] = useState('');
  const [pricingType, setPricingType] = useState('PER_GUEST');
  const [minGuests, setMinGuests] = useState('10');
  const [maxGuests, setMaxGuests] = useState('200');

  const [basicPrice, setBasicPrice] = useState('100');
  const [basicDesc, setBasicDesc] = useState('Basic menu & welcome drinks');
  const [standardPrice, setStandardPrice] = useState('250');
  const [standardDesc, setStandardDesc] = useState('Standard buffet & celebration cake');
  const [premiumPrice, setPremiumPrice] = useState('400');
  const [premiumDesc, setPremiumDesc] = useState('Full premium buffet & custom setup');

  const resetForm = () => {
    setIncName('');
    setPricingType('PER_GUEST');
    setMinGuests('10');
    setMaxGuests('200');
    setBasicPrice('100');
    setBasicDesc('Basic menu & welcome drinks');
    setStandardPrice('250');
    setStandardDesc('Standard buffet & celebration cake');
    setPremiumPrice('400');
    setPremiumDesc('Full premium buffet & custom setup');
    setEditingIndex(null);
    setWizardStep(1);
  };

  const applyPreset = (preset) => {
    setIncName(preset.name);
    if (preset.pType) setPricingType(preset.pType);
    setBasicPrice(preset.bP);
    setBasicDesc(preset.bD);
    setStandardPrice(preset.sP);
    setStandardDesc(preset.sD);
    setPremiumPrice(preset.pP);
    setPremiumDesc(preset.pD);
  };

  const handleNextWizardStep = () => {
    if (wizardStep === 1 && !incName.trim()) {
      import('react-hot-toast').then(m => m.default.error('Please enter a feature name'));
      return;
    }
    if (wizardStep < WIZARD_STEPS.length) setWizardStep(s => s + 1);
  };

  const handlePrevWizardStep = () => {
    if (wizardStep > 1) setWizardStep(s => s - 1);
  };

  const handleSaveInclusion = () => {
    if (!incName.trim()) {
      import('react-hot-toast').then(m => m.default.error('Please enter an inclusion item name'));
      return;
    }

    const bPriceNum = basicPrice && !isNaN(Number(basicPrice)) ? Number(basicPrice) : 0;
    const sPriceNum = standardPrice && !isNaN(Number(standardPrice)) ? Number(standardPrice) : 0;
    const pPriceNum = premiumPrice && !isNaN(Number(premiumPrice)) ? Number(premiumPrice) : 0;

    const incId = editingIndex !== null && serviceInclusions[editingIndex]?.id
      ? serviceInclusions[editingIndex].id
      : `inc_${Date.now()}`;

    const newInc = {
      id: incId,
      name: incName.trim(),
      category: incName.trim(),
      description: basicDesc.trim() || null,
      pricing_type: pricingType || 'PER_GUEST',
      min_guests: minGuests ? Number(minGuests) : 10,
      max_guests: maxGuests ? Number(maxGuests) : 200,
      basic_price: bPriceNum,
      basic_desc: basicDesc.trim(),
      standard_price: sPriceNum,
      standard_desc: standardDesc.trim(),
      premium_price: pPriceNum,
      premium_desc: premiumDesc.trim(),
      unit_price: bPriceNum,
      quantity: 1,
      unit: 'Item',
      is_active: true,
      display_order: editingIndex !== null ? editingIndex : serviceInclusions.length,
    };

    let updatedInclusions = [];
    if (editingIndex !== null) {
      updatedInclusions = [...serviceInclusions];
      updatedInclusions[editingIndex] = newInc;
      import('react-hot-toast').then(m => m.default.success(`"${incName.trim()}" updated successfully!`));
    } else {
      updatedInclusions = [...serviceInclusions, newInc];
      import('react-hot-toast').then(m => m.default.success(`"${incName.trim()}" added successfully!`));
    }

    setValue('inclusions', updatedInclusions, { shouldDirty: true, shouldValidate: true });
    resetForm();
  };

  const handleEditInclusion = (index) => {
    const inc = serviceInclusions[index];
    if (!inc) return;

    setEditingIndex(index);
    setIncName(inc.name || inc.category || '');
    setPricingType(inc.pricing_type || 'PER_GUEST');
    setMinGuests(inc.min_guests ? String(inc.min_guests) : '10');
    setMaxGuests(inc.max_guests ? String(inc.max_guests) : '200');

    setBasicPrice(inc.basic_price !== undefined ? String(inc.basic_price) : String(inc.unit_price || 0));
    setBasicDesc(inc.basic_desc || inc.description || '');

    setStandardPrice(inc.standard_price !== undefined ? String(inc.standard_price) : String(inc.unit_price || 0));
    setStandardDesc(inc.standard_desc || '');

    setPremiumPrice(inc.premium_price !== undefined ? String(inc.premium_price) : String(inc.unit_price || 0));
    setPremiumDesc(inc.premium_desc || '');

    setWizardStep(1);
    import('react-hot-toast').then(m => m.default.success(`Editing "${inc.name}"`));
  };

  const handleRemoveInclusion = (index) => {
    const itemToRemove = serviceInclusions[index];
    const updated = serviceInclusions.filter((_, i) => i !== index);
    setValue('inclusions', updated, { shouldDirty: true });
    if (editingIndex === index) {
      resetForm();
    }
    import('react-hot-toast').then(m => m.default.success(`Removed "${itemToRemove?.name || 'Inclusion'}"`));
  };

  return (
    <div className="space-y-6 text-[#252525] max-w-5xl mx-auto font-sans select-none">

      {/* ── Section Header ── */}
      <div className="bg-gradient-to-r from-white via-[#FFF5F5] to-[#FFF5F5] p-4 sm:p-6 rounded-3xl border border-[#EF5350]/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#B71C1C] text-white flex items-center justify-center shadow-md shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#252525] tracking-tight">
              Package Features & Tiered Inclusions
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
              Add features (e.g. Catering, Cake, Decor) and define Basic, Standard & Premium tier options.
            </p>
          </div>
        </div>

        {serviceInclusions.length > 0 && (
          <span className="px-3.5 py-1.5 rounded-full bg-[#E50914] text-white text-xs font-extrabold shadow-2xs self-start sm:self-center shrink-0">
            {serviceInclusions.length} Configured {serviceInclusions.length === 1 ? 'Feature' : 'Features'}
          </span>
        )}
      </div>

      {/* ── Main Step-by-Step Builder Box ── */}
      <div className="bg-white rounded-3xl border border-[#EF5350]/60 shadow-xs overflow-hidden">
        
        {/* Step Progress Navigation Bar */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-[#FFF5F5] to-white border-b border-[#EF5350]/40">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 max-w-3xl mx-auto">
            {WIZARD_STEPS.map((step) => {
              const isActive = wizardStep === step.id;
              const isCompleted = wizardStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id < wizardStep || (step.id === 2 && incName.trim())) {
                      setWizardStep(step.id);
                    }
                  }}
                  className={cn(
                    'flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 p-2 sm:p-3 rounded-2xl border transition-all text-center sm:text-left cursor-pointer',
                    isActive
                      ? 'bg-white border-[#E50914] shadow-md ring-2 ring-[#E50914]/15'
                      : isCompleted
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-stone-50/70 border-stone-200/80 opacity-60'
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 transition-transform',
                    isActive
                      ? 'bg-[#E50914] text-white scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-600'
                  )}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                  </div>
                  <div className="min-w-0">
                    <span className="hidden sm:block text-[10px] font-black text-stone-400 uppercase tracking-wider">
                      Step 0{step.id}
                    </span>
                    <h4 className={cn('text-[10px] sm:text-xs font-extrabold truncate', isActive ? 'text-[#E50914]' : 'text-[#252525]')}>
                      {step.title}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editing Banner indicator if active */}
        {editingIndex !== null && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between gap-3">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5" />
              Editing Item #{editingIndex + 1}: <span className="underline">{incName || 'Inclusion'}</span>
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="text-[11px] font-extrabold text-stone-600 hover:text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Cancel Edit
            </button>
          </div>
        )}

        {/* Step Form Body */}
        <div className="p-4 sm:p-7">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Feature Name & Presets ── */}
            {wizardStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Presets Toolbar */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-[#E50914] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Quick Feature Presets
                    </label>
                    <span className="text-[10px] text-stone-400 font-bold">Click to auto-fill</span>
                  </div>
                  
                  {/* Presets Responsive Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {QUICK_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = incName === preset.name;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className={cn(
                            'p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95',
                            isSelected
                              ? 'bg-[#E50914] text-white border-[#E50914] shadow-sm'
                              : 'bg-[#FFF5F5] hover:bg-[#FFF5F5] text-[#252525] border-[#EF5350]/70 hover:border-[#E50914]'
                          )}
                        >
                          <Icon className={cn('w-4 h-4', isSelected ? 'text-amber-300' : 'text-[#E50914]')} />
                          <span className="text-[11px] font-extrabold leading-tight truncate w-full">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  {/* Inclusion Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#252525] flex items-center gap-1">
                      Inclusion / Feature Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E50914]" />
                      <input
                        type="text"
                        value={incName}
                        onChange={(e) => setIncName(e.target.value)}
                        placeholder="e.g. Food & Catering, Celebration Cake"
                        className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm font-extrabold rounded-2xl border border-[#EF5350]/80 bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 text-[#252525] transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Pricing Model */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#252525]">
                      Pricing Model <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[
                        { id: 'PER_GUEST', title: 'Per Guest Rate', desc: 'Price × guest count' },
                        { id: 'FIXED', title: 'Fixed Amount', desc: 'Flat rate package' },
                      ].map((model) => {
                        const active = pricingType === model.id;
                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => setPricingType(model.id)}
                            className={cn(
                              'h-11 px-3 rounded-2xl border transition-all text-left flex flex-col justify-center cursor-pointer',
                              active
                                ? 'bg-[#E50914] text-white border-[#E50914] shadow-xs'
                                : 'bg-[#FFF5F5] text-[#252525] border-[#EF5350]/70 hover:border-[#E50914]'
                            )}
                          >
                            <span className="text-xs font-extrabold leading-none truncate">{model.title}</span>
                            <span className={cn('text-[9px] sm:text-[10px] font-bold mt-1 truncate', active ? 'text-white/80' : 'text-stone-500')}>
                              {model.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Guest Capacity Limits ── */}
            {wizardStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-amber-950">Set Guest Range for "{incName}"</h4>
                    <p className="text-[10px] sm:text-xs text-amber-800/90 font-medium">
                      Define the minimum and maximum attendee limits permitted for this feature.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#252525]">Minimum Guest Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={minGuests}
                      onChange={(e) => setMinGuests(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs sm:text-sm font-extrabold rounded-2xl border border-[#EF5350]/80 bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 text-[#252525] shadow-2xs"
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#252525]">Maximum Guest Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={maxGuests}
                      onChange={(e) => setMaxGuests(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs sm:text-sm font-extrabold rounded-2xl border border-[#EF5350]/80 bg-[#FFF5F5] focus:bg-[#FFF5F5] focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 text-[#252525] shadow-2xs"
                      placeholder="200"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Tier Pricing (Basic, Standard, Premium) ── */}
            {wizardStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs font-extrabold text-[#252525] uppercase tracking-wider">
                    Configure 3 Package Tiers for "{incName}"
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Pricing Mode: <span className="font-extrabold text-[#E50914]">{pricingType === 'PER_GUEST' ? '₹ Rate per Guest' : 'Fixed Flat Rate'}</span>
                  </p>
                </div>

                {/* 3 Tier Pricing Cards (Responsive Grid: 1 col on mobile, 3 cols on tablet+) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  {/* BASIC TIER */}
                  <div className="p-4 rounded-3xl border border-stone-300 bg-stone-50/80 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-800 uppercase tracking-wider">Basic Tier</span>
                      <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[9px] font-black">Essential</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-500 uppercase">Rate (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-xs text-stone-600">₹</span>
                        <input
                          type="number"
                          value={basicPrice}
                          onChange={(e) => setBasicPrice(e.target.value)}
                          className="w-full h-10 pl-7 pr-3 text-xs font-extrabold rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#E50914] text-[#252525]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-stone-500 uppercase">Description</label>
                      <input
                        type="text"
                        value={basicDesc}
                        onChange={(e) => setBasicDesc(e.target.value)}
                        placeholder="Basic offering description"
                        className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#E50914] text-[#252525]"
                      />
                    </div>
                  </div>

                  {/* STANDARD TIER */}
                  <div className="p-4 rounded-3xl border-2 border-amber-400 bg-amber-50/50 space-y-3 relative shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-900 uppercase tracking-wider">Standard Tier</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black">Popular</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-900/80 uppercase">Rate (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-xs text-amber-900">₹</span>
                        <input
                          type="number"
                          value={standardPrice}
                          onChange={(e) => setStandardPrice(e.target.value)}
                          className="w-full h-10 pl-7 pr-3 text-xs font-extrabold rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-600 text-[#252525]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-amber-900/80 uppercase">Description</label>
                      <input
                        type="text"
                        value={standardDesc}
                        onChange={(e) => setStandardDesc(e.target.value)}
                        placeholder="Standard offering description"
                        className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-amber-600 text-[#252525]"
                      />
                    </div>
                  </div>

                  {/* PREMIUM TIER */}
                  <div className="p-4 rounded-3xl border border-[#EF5350] bg-[#FFF5F5] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#E50914] uppercase tracking-wider">Premium Tier</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E50914] text-white text-[9px] font-black">VIP Deluxe</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#E50914]/80 uppercase">Rate (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-xs text-[#E50914]">₹</span>
                        <input
                          type="number"
                          value={premiumPrice}
                          onChange={(e) => setPremiumPrice(e.target.value)}
                          className="w-full h-10 pl-7 pr-3 text-xs font-extrabold rounded-xl border border-[#EF5350] bg-white focus:outline-none focus:border-[#E50914] text-[#252525]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#E50914]/80 uppercase">Description</label>
                      <input
                        type="text"
                        value={premiumDesc}
                        onChange={(e) => setPremiumDesc(e.target.value)}
                        placeholder="Premium offering description"
                        className="w-full h-10 px-3 text-xs font-semibold rounded-xl border border-[#EF5350] bg-white focus:outline-none focus:border-[#E50914] text-[#252525]"
                      />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-3.5 sm:p-5 bg-stone-50/80 border-t border-[#EF5350]/40 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrevWizardStep}
            disabled={wizardStep === 1}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-extrabold text-stone-700 flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs font-extrabold text-[#E50914] shrink-0">Step {wizardStep}/3</span>

          {wizardStep < 3 ? (
            <button
              type="button"
              onClick={handleNextWizardStep}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-[#E50914] hover:bg-[#E50914] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveInclusion}
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingIndex !== null ? 'Update Feature' : 'Save Feature'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Configured Package Features List ── */}
      {serviceInclusions.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#252525] uppercase tracking-wider">
              Configured Package Inclusions ({serviceInclusions.length})
            </h3>
          </div>

          <div className="space-y-4">
            {serviceInclusions.map((inc, index) => {
              const isPerGuest = (inc.pricing_type || 'PER_GUEST') === 'PER_GUEST';
              const isBeingEdited = editingIndex === index;
              return (
                <div
                  key={inc.id || index}
                  className={cn(
                    'bg-white p-4 sm:p-5 rounded-3xl border transition-all space-y-4 relative shadow-2xs',
                    isBeingEdited ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10' : 'border-[#EF5350]/70 hover:border-[#E50914]/40'
                  )}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFF5F5] border border-[#EF5350]/60 text-[#E50914] flex items-center justify-center text-xs sm:text-sm font-extrabold shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-[#252525]">{inc.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#E50914]/10 text-[#E50914] text-[9px] sm:text-[10px] font-black uppercase">
                            {isPerGuest ? 'Per Guest Rate' : 'Fixed Rate'}
                          </span>
                        </div>
                        {(inc.min_guests || inc.max_guests) && (
                          <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
                            Capacity: {inc.min_guests || 10} – {inc.max_guests || 200} Guests
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditInclusion(index)}
                        className="p-1.5 sm:p-2 rounded-xl text-[#E50914] hover:bg-[#FFF5F5] border border-stone-200 transition-colors cursor-pointer"
                        title="Edit Feature"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(index)}
                        className="p-1.5 sm:p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
                        title="Remove Feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 3 Tier Pricing Cards (Responsive Grid: 1 col on mobile, 3 col on tablet+) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
                    
                    {/* Basic */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <span className="text-[10px] font-black text-stone-500 uppercase">BASIC</span>
                      <p className="text-sm sm:text-base font-extrabold text-[#252525]">
                        ₹{Number(inc.basic_price !== undefined ? inc.basic_price : (inc.unit_price || 0)).toLocaleString('en-IN')}
                        <span className="text-[11px] font-bold text-stone-500 ml-1">{isPerGuest ? '/guest' : 'fixed'}</span>
                      </p>
                      <p className="text-[11px] text-stone-600 font-medium line-clamp-2">{inc.basic_desc || inc.description || 'Basic setup'}</p>
                    </div>

                    {/* Standard */}
                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-1">
                      <span className="text-[10px] font-black text-amber-800 uppercase">STANDARD</span>
                      <p className="text-sm sm:text-base font-extrabold text-amber-950">
                        ₹{Number(inc.standard_price !== undefined ? inc.standard_price : (inc.unit_price || 0)).toLocaleString('en-IN')}
                        <span className="text-[11px] font-bold text-amber-800 ml-1">{isPerGuest ? '/guest' : 'fixed'}</span>
                      </p>
                      <p className="text-[11px] text-amber-900/80 font-medium line-clamp-2">{inc.standard_desc || 'Standard setup'}</p>
                    </div>

                    {/* Premium */}
                    <div className="p-3 rounded-2xl bg-[#FFF5F5] border border-[#EF5350] space-y-1">
                      <span className="text-[10px] font-black text-[#E50914] uppercase">PREMIUM</span>
                      <p className="text-sm sm:text-base font-extrabold text-[#252525]">
                        ₹{Number(inc.premium_price !== undefined ? inc.premium_price : (inc.unit_price || 0)).toLocaleString('en-IN')}
                        <span className="text-[11px] font-bold text-[#E50914] ml-1">{isPerGuest ? '/guest' : 'fixed'}</span>
                      </p>
                      <p className="text-[11px] text-stone-600 font-medium line-clamp-2">{inc.premium_desc || 'Premium setup'}</p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceInclusions;
