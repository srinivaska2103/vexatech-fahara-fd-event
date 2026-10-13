'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  PartyPopper, 
  ShieldAlert,
  Cake,
  Heart,
  Briefcase,
  Camera,
  Music,
  Utensils
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetServicesQuery } from '@/hooks/services/useServicesQueries';
import { useServicesStore } from '@/store/servicesStore';
import ServiceCard from '@/components/services/ServiceCard';
import DeleteConfirmationModal from '@/components/shared/DeleteConfirmationModal';
import { EventPackageCardSkeleton } from '@/components/common/FaharaLoadingSystem';
import { useDeleteServiceMutation } from '@/hooks/services/useServicesMutations';

const CATEGORY_META = {
  Birthday: { icon: Cake, subtitle: 'Custom packages for birthday celebrations.' },
  Anniversary: { icon: Heart, subtitle: 'Couples & romantic candlelight dinner setups.' },
  'Corporate Meeting': { icon: Briefcase, subtitle: 'Professional meetings, Wi-Fi & seminar packages.' },
  Photography: { icon: Camera, subtitle: 'Photo, HD video & studio coverage packages.' },
  'Music & DJ': { icon: Music, subtitle: 'Sound, lighting & live DJ celebration packages.' },
  Catering: { icon: Utensils, subtitle: 'Food catering, buffet & banquet packages.' },
  Decoration: { icon: PartyPopper, subtitle: 'Stage, balloon & floral decor packages.' },
};

import { useGetProfileQuery, useToggleServiceAvailabilityMutation } from '@/hooks/profile/useProfileMutations';

export default function ServicesPage() {
  const { data: services, isLoading, isError, error, refetch } = useGetServicesQuery();
  const { data: profileData } = useGetProfileQuery();
  const { mutate: toggleAvailability, isPending: isToggling } = useToggleServiceAvailabilityMutation();
  const isAvailable = profileData?.is_active ?? true;

  const deleteMutation = useDeleteServiceMutation();
  const { searchQuery, setSearchQuery } = useServicesStore();
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const servicesList = Array.isArray(services) ? services : [];

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

  // Group packages by category
  const groupedCategories = {};
  filteredServices.forEach(service => {
    const catName = service.category || 'Birthday';
    if (!groupedCategories[catName]) {
      groupedCategories[catName] = [];
    }
    groupedCategories[catName].push(service);
  });

  // If user searched or filtered, ensure all default categories show if empty
  const activeCategoryKeys = Object.keys(groupedCategories).length > 0
    ? Object.keys(groupedCategories)
    : (selectedCategory !== 'ALL' ? [selectedCategory] : ['Birthday']);

  const handleDeleteConfirm = () => {
    if (deleteModal.id) {
      deleteMutation.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, id: null })
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans text-[#2C1810]">
      
      {/* Top Header Card */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A2E1D]/10 border border-[#4A2E1D]/20 text-[#4A2E1D] text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Event Services Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Event Packages & Services
            </h1>
            
            <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-2xl leading-relaxed">
              Create and manage custom event packages, birthday bash setups, catering, and celebration offerings across all your venues.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-3 rounded-2xl bg-white border border-[#E8DED5] text-stone-600 hover:text-[#2C1810] hover:bg-[#FFF8F0] transition-colors shadow-2xs cursor-pointer"
              title="Refresh services"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link 
              href="/event/services/create"
              className="px-5 py-3 rounded-2xl bg-[#4A2E1D] hover:bg-[#382215] text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-2 transition-all active:scale-95 min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event Package</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Availability Status Card */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
        isAvailable 
          ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white border-emerald-200 text-emerald-950' 
          : 'bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-white border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 ${
            isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            <span className="relative flex h-3 w-3">
              {isAvailable && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />}
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black tracking-tight">
                {isAvailable ? 'Event Packages Are LIVE & Discoverable' : 'Event Packages Are PAUSED / HIDDEN'}
              </h4>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isAvailable ? 'bg-emerald-200/80 text-emerald-900' : 'bg-rose-200/80 text-rose-900'
              }`}>
                {isAvailable ? 'Live on Customer App' : 'Hidden from Customers'}
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              {isAvailable 
                ? 'Customers can browse and book all your active packages on the Fahara user app.' 
                : 'Your packages and celebration offerings are temporarily unlisted and hidden from users.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleAvailability(!isAvailable)}
          disabled={isToggling}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer ${
            isAvailable 
              ? 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isToggling ? 'Updating...' : (isAvailable ? 'Pause & Hide Packages' : 'Make Available Now')}
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 shadow-2xs flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          {['ALL', 'Birthday', 'Anniversary', 'Corporate Meeting', 'Photography', 'Music & DJ', 'Catering', 'Decoration'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4A2E1D] text-white shadow-xs'
                  : 'bg-[#FFF8F0] hover:bg-[#4A2E1D]/10 text-stone-700'
              }`}
            >
              {cat === 'ALL' ? 'All Packages' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 xl:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input 
            type="text"
            placeholder="Search package name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#4A2E1D] focus:ring-2 focus:ring-[#4A2E1D]/15 transition-all"
          />
        </div>
      </div>

      {/* CATEGORY SECTIONS LIST (Screenshot 1) */}
      <div className="space-y-8 min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <EventPackageCardSkeleton key={n} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            <p className="text-sm font-black text-rose-700">Failed to load service packages.</p>
            <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please verify server connection.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
          </div>
        ) : filteredServices.length > 0 ? (
          activeCategoryKeys.map((catKey) => {
            const catPackages = groupedCategories[catKey] || [];
            if (catPackages.length === 0) return null;

            const meta = CATEGORY_META[catKey] || { icon: PartyPopper, subtitle: `Custom packages for ${catKey.toLowerCase()}.` };
            const CategoryIcon = meta.icon;

            return (
              <div key={catKey} className="space-y-5">
                
                {/* CATEGORY BANNER HEADER (Screenshot 1) */}
                <div className="bg-[#FFF8F0] border border-[#F2E8DE] p-4 sm:p-5 rounded-3xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8DED5] flex items-center justify-center text-[#4A2E1D] shadow-2xs shrink-0">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-[#2C1810] tracking-tight">{catKey}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4A2E1D] text-white text-xs font-black">
                          {catPackages.length}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">{meta.subtitle}</p>
                    </div>
                  </div>

                  <Link
                    href={`/event/services/create?category=${encodeURIComponent(catKey)}`}
                    className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-[#4A2E1D] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-[#4A2E1D]" />
                    <span>Add {catKey} Package</span>
                  </Link>
                </div>

                {/* 3 Package Cards Grid per Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {catPackages.map(service => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                    />
                  ))}
                </div>

              </div>
            );
          })
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E8DED5] rounded-3xl py-16 px-6 flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-20 h-20 bg-[#FFF8F0] border border-[#4A2E1D]/20 rounded-3xl flex items-center justify-center text-[#4A2E1D] mb-4 shadow-inner">
              <Layers className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-black text-[#2C1810] mb-2">No Event Packages Found</h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-md mb-6 leading-relaxed">
              You haven't created any event packages yet, or no packages match your search filter.
            </p>
            <Link 
              href="/event/services/create"
              className="px-6 py-3 bg-[#4A2E1D] hover:bg-[#382215] text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Package</span>
            </Link>
          </motion.div>
        )}
      </div>

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Event Package"
        message="Are you sure you want to delete this event package? This action cannot be undone."
      />
    </div>
  );
}
