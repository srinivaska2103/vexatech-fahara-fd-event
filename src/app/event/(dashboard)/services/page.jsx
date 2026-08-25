'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Sparkles, Layers, SlidersHorizontal, ArrowRight, 
  RefreshCw, CheckCircle2, IndianRupee, PartyPopper, LayoutGrid, List,
  Loader2, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetServicesQuery } from '@/hooks/services/useServicesQueries';
import { useServicesStore } from '@/store/servicesStore';
import ServiceCard from '@/components/services/ServiceCard';
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal';
import { useDeleteServiceMutation } from '@/hooks/services/useServicesMutations';

export default function ServicesPage() {
  const { data: services, isLoading, isError, error, refetch } = useGetServicesQuery();
  const deleteMutation = useDeleteServiceMutation();
  const { searchQuery, setSearchQuery } = useServicesStore();
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [view, setView] = useState('grid'); // 'grid' or 'table'

  const categories = [
    { id: 'ALL', label: 'All Packages' },
    { id: 'Birthday Parties', label: 'Birthday Parties' },
    { id: 'Catering', label: 'Catering' },
    { id: 'Decoration', label: 'Decoration' },
    { id: 'Corporate Events', label: 'Corporate Events' },
    { id: 'Photography', label: 'Photography' },
    { id: 'Music & DJ', label: 'Live Music & DJ' },
    { id: 'Venue', label: 'Venue' }
  ];

  const servicesList = Array.isArray(services) ? services : [];

  // Metrics calculation
  const totalOfferings = servicesList.length;
  const activePublished = servicesList.filter(s => (s.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length;
  const totalPriceSum = servicesList.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const avgPackageRate = totalOfferings > 0 ? Math.round(totalPriceSum / totalOfferings) : 0;
  
  const uniqueCategories = new Set(servicesList.map(s => s.category || s.type).filter(Boolean));
  const categoriesCount = Math.max(uniqueCategories.size, 4);

  // Filtered Services List
  const filteredServices = servicesList.filter(service => {
    const query = (searchQuery || '').toLowerCase();
    const name = (service.service_name || service.title || service.name || '').toLowerCase();
    const cat = (service.category || service.type || '').toLowerCase();
    
    const matchesSearch = !query || name.includes(query) || cat.includes(query);

    const matchesCategory = selectedCategory === 'ALL' || 
      cat.includes(selectedCategory.toLowerCase()) || 
      selectedCategory.toLowerCase().includes(cat);
    
    return matchesSearch && matchesCategory;
  });

  const handleDeleteConfirm = () => {
    if (deleteModal.id) {
      deleteMutation.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, id: null })
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[#6F4E37] text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Event Services Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Event Packages & Parties
            </h1>
            
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-2xl leading-relaxed">
              Configure special party offerings, birthday setups, catering, decoration, and workshop packages across all your venues.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-3 rounded-2xl bg-white border border-[#E8DED5] text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0] transition-colors shadow-2xs"
              title="Refresh services"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link 
              href="/event/services/create"
              className="px-5 py-3 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event Package</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. STATS OVERVIEW METRICS GRID (4 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: TOTAL OFFERINGS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#6F4E37]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#8C6D58] uppercase tracking-wider">
              Total Offerings
            </span>
            <div className="w-9 h-9 rounded-full bg-[#F3EFEA] text-[#6F4E37] flex items-center justify-center">
              <PartyPopper className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {totalOfferings}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              Configured packages
            </p>
          </div>
        </div>

        {/* Card 2: ACTIVE PUBLISHED */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
              Active Published
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {activePublished}
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Visible to clients
            </p>
          </div>
        </div>

        {/* Card 3: AVG PACKAGE RATE */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider">
              Avg Package Rate
            </span>
            <div className="w-9 h-9 rounded-full bg-purple-100/80 text-purple-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{avgPackageRate.toLocaleString()}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              Average base rate
            </p>
          </div>
        </div>

        {/* Card 4: CATEGORIES */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
              Categories
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {categoriesCount}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              Party & event types
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. CATEGORY TABS & SEARCH TOOLBAR          */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Search Input & View Toggles */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          
          {/* Search Box */}
          <div className="relative flex-1 xl:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
            <input 
              type="text"
              placeholder="Search package name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
            />
          </div>

          {/* View Mode Toggle Group */}
          <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#E8DED5] p-1 rounded-2xl shrink-0">
            <button 
              type="button"
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl transition-all ${
                view === 'grid' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0]'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button 
              type="button"
              onClick={() => setView('table')}
              className={`p-2 rounded-xl transition-all ${
                view === 'table' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MAIN SERVICES CONTENT GRID              */}
      {/* ========================================== */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-3xl border border-[#E8DED5] h-84 animate-pulse p-4 space-y-3">
                <div className="w-full h-44 bg-[#FFF8F0] rounded-2xl" />
                <div className="h-4 bg-[#FFF8F0] rounded-lg w-3/4" />
                <div className="h-3 bg-[#FFF8F0] rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            <p className="text-sm font-black text-rose-700">Failed to load service packages.</p>
            <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please verify your server connection.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onDelete={(id) => setDeleteModal({ isOpen: true, id })}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E8DED5] rounded-3xl py-16 px-6 flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-20 h-20 bg-[#FFF8F0] border border-[#6F4E37]/20 rounded-3xl flex items-center justify-center text-[#6F4E37] mb-4 shadow-inner">
              <Layers className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-black text-[#2C1810] mb-2">No Services Found</h3>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-md mb-6 leading-relaxed">
              You haven't created any event services yet, or no catalog items match your search filter.
            </p>
            <Link 
              href="/event/services/create"
              className="px-6 py-3 bg-[#6F4E37] hover:bg-[#5C402D] text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 active:scale-95"
            >
              <span>Create Your First Service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Event Service"
        message="Are you sure you want to delete this event service? All associated packages will also be permanently removed."
      />
    </div>
  );
}
