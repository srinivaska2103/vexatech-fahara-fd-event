import { create } from 'zustand';

// Parse initial hours, default to typical 9 to 5
const defaultHours = {
  monday: { open: '09:00', close: '17:00', closed: false },
  tuesday: { open: '09:00', close: '17:00', closed: false },
  wednesday: { open: '09:00', close: '17:00', closed: false },
  thursday: { open: '09:00', close: '17:00', closed: false },
  friday: { open: '09:00', close: '17:00', closed: false },
  saturday: { open: '10:00', close: '16:00', closed: false },
  sunday: { open: '10:00', close: '16:00', closed: true },
};

export const useProfileStore = create((set, get) => ({
  // Core Profile Data
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Media
  coverImage: null,
  setCoverImage: (url) => set({ coverImage: url }),
  gallery: [],
  setGallery: (images) => set({ gallery: images }),
  
  // Custom Fields (Stored locally until submitted to backend 'amenities' JSON)
  customFields: {
    gstNumber: '',
    registrationNumber: '',
    website: '',
    supportEmail: '',
    experienceYears: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    }
  },
  updateCustomFields: (fields) => set((state) => ({ 
    customFields: { ...state.customFields, ...fields } 
  })),

  // Working Hours
  businessHours: defaultHours,
  updateBusinessHours: (day, data) => set((state) => ({
    businessHours: {
      ...state.businessHours,
      [day]: { ...state.businessHours[day], ...data }
    }
  })),
  setFullBusinessHours: (hours) => {
    if (!hours || (Array.isArray(hours) && hours.length === 0)) {
      set({ businessHours: defaultHours });
    } else if (Array.isArray(hours)) {
      // Convert backend array to object
      const formatted = { ...defaultHours };
      hours.forEach(h => {
        const day = (h.day_of_week || h.dayOfWeek || '').toLowerCase();
        if (day) {
          formatted[day] = {
            open: h.open_time || h.openTime || defaultHours[day].open,
            close: h.close_time || h.closeTime || defaultHours[day].close,
            closed: h.is_closed !== undefined ? h.is_closed : (h.isClosed !== undefined ? h.isClosed : defaultHours[day].closed)
          };
        }
      });
      set({ businessHours: formatted });
    } else {
      set({ businessHours: hours });
    }
  },

  // Calculate Profile Completion
  getCompletionPercentage: () => {
    const state = get();
    const p = state.profile;
    const c = state.customFields;
    
    let total = 0;
    let completed = 0;
    
    const check = (val) => {
      total++;
      if (val && String(val).trim() !== '') completed++;
    };

    check(p?.name);
    check(p?.description);
    check(p?.address);
    check(p?.city);
    check(p?.latitude);
    check(c?.gstNumber);
    check(c?.registrationNumber);
    check(c?.supportEmail);
    check(c?.experienceYears);
    check(state.coverImage);
    
    // Check if at least 1 gallery image exists
    total++;
    if (state.gallery?.length > 0) completed++;
    
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }
}));
