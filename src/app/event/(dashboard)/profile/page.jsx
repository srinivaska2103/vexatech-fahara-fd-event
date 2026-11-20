"use client";
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useGetProfileQuery, useUpdateProfileMutation, useUploadImageMutation } from '@/hooks/profile/useProfileMutations';
import { 
  Loader2, Camera, MapPin, Building2, Save, Globe, Phone, Mail, 
  Link as LinkIcon, Clock, ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ModernTimePicker from '@/components/ui/ModernTimePicker';

const STEPS = [
  { id: 1, title: 'Branding & Media', subtitle: 'Logo & banner images', icon: Camera },
  { id: 2, title: 'Business Details', subtitle: 'Identity & operating hours', icon: Building2 },
  { id: 3, title: 'Contact & Socials', subtitle: 'Reachability & web links', icon: Globe },
  { id: 4, title: 'Location & Radius', subtitle: 'Address & travel coverage', icon: MapPin },
];

export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const uploadImage = useUploadImageMutation();

  const [currentStep, setCurrentStep] = useState(1);
  const [localLogoPreview, setLocalLogoPreview] = useState(null);
  const [localBannerPreview, setLocalBannerPreview] = useState(null);

  const { register, handleSubmit, reset, watch, setValue, control, trigger, formState: { isDirty, errors } } = useForm({
    defaultValues: {
      company_name: '',
      company_logo: '',
      company_banner: '',
      description: '',
      working_hours: [
        { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "SATURDAY", openTime: "10:00", closeTime: "16:00", isClosed: false },
        { dayOfWeek: "SUNDAY", openTime: "", closeTime: "", isClosed: true }
      ],
      business_registration_number: '',
      established_year: '',
      experience_years: 0,
      business_email: '',
      business_phone: '',
      alternate_phone: '',
      website_url: '',
      instagram_url: '',
      facebook_url: '',
      youtube_url: '',
      linkedin_url: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: 'India',
      postal_code: '',
      service_radius_km: 25,
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "working_hours"
  });

  const companyLogoUrl = watch('company_logo');
  const companyBannerUrl = watch('company_banner');

  useEffect(() => {
    if (profileData) {
      const defaultHours = [
        { dayOfWeek: "MONDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "TUESDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "WEDNESDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "THURSDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "FRIDAY", openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: "SATURDAY", openTime: "10:00", closeTime: "16:00", isClosed: false },
        { dayOfWeek: "SUNDAY", openTime: "", closeTime: "", isClosed: true }
      ];
      
      let initialWorkingHours = defaultHours;
      const backendHours = profileData.working_hours || profileData.event_business_hours;
      
      if (Array.isArray(backendHours) && backendHours.length > 0) {
        initialWorkingHours = defaultHours.map(defaultDay => {
          const found = backendHours.find(
            h => (h.day_of_week || h.dayOfWeek)?.toUpperCase() === defaultDay.dayOfWeek
          );
          if (found) {
            const formatTime = (dateStr) => {
              if (!dateStr) return "";
              const strVal = String(dateStr);
              if (strVal.includes("T")) {
                const date = new Date(strVal);
                return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
              }
              return strVal;
            };
            return {
              dayOfWeek: defaultDay.dayOfWeek,
              openTime: formatTime(found.open_time || found.openTime) || defaultDay.openTime,
              closeTime: formatTime(found.close_time || found.closeTime) || defaultDay.closeTime,
              isClosed: found.is_closed !== undefined ? found.is_closed : (found.isClosed !== undefined ? found.isClosed : defaultDay.isClosed)
            };
          }
          return defaultDay;
        });
      }

      reset({
        company_name: profileData.company_name || '',
        company_logo: profileData.company_logo || '',
        company_banner: profileData.company_banner || '',
        description: profileData.description || '',
        working_hours: initialWorkingHours,
        business_registration_number: profileData.business_registration_number || '',
        established_year: profileData.established_year || '',
        experience_years: profileData.experience_years || 0,
        business_email: profileData.business_email || '',
        business_phone: profileData.business_phone || '',
        alternate_phone: profileData.alternate_phone || '',
        website_url: profileData.website_url || '',
        instagram_url: profileData.instagram_url || '',
        facebook_url: profileData.facebook_url || '',
        youtube_url: profileData.youtube_url || '',
        linkedin_url: profileData.linkedin_url || '',
        address_line1: profileData.address_line1 || '',
        address_line2: profileData.address_line2 || '',
        city: profileData.city || '',
        state: profileData.state || '',
        country: profileData.country || 'India',
        postal_code: profileData.postal_code || '',
        service_radius_km: profileData.service_radius_km || 25,
      });
    }
  }, [profileData, reset]);

  const handleImageUpload = async (e, fieldName, setLocalPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      const url = await uploadImage.mutateAsync(file);
      const finalUrl = url?.data?.url || url?.data?.imageUrl || url?.url || url?.imageUrl || url;
      
      if (finalUrl && typeof finalUrl === 'string') {
        setValue(fieldName, finalUrl, { shouldDirty: true });
        toast.success(`${fieldName === 'company_logo' ? 'Logo' : 'Banner'} uploaded successfully`);
      } else {
        setValue(fieldName, objectUrl, { shouldDirty: true });
      }
    } catch (error) {
      toast.error("Failed to upload image");
      setLocalPreview(null);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 2) {
      const isValid = await trigger(['company_name']);
      if (!isValid) return;
    }
    if (currentStep === 4) {
      const isValid = await trigger(['city', 'state']);
      if (!isValid) return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = (data) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        reset(data);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh]">
        <Loader2 className="w-10 h-10 text-[#E50914] animate-spin" />
        <p className="text-[#757575] mt-4 font-bold text-sm">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none">
      
      {/* Page Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-[#FEE2E2] rounded-3xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#E50914]/10 via-[#B71C1C]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF5F5] text-[#E50914] border border-[#E50914]/20 uppercase tracking-widest">
              Business Setup Wizard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">Company Profile Setup</h1>
          <p className="text-xs sm:text-sm text-[#757575] font-semibold mt-1">Configure your business identity, operating hours, and location step-by-step.</p>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty || updateProfile.isPending}
          className="relative z-10 self-start md:self-center px-6 py-3 bg-gradient-to-r from-[#E50914] to-[#4A3324] hover:from-[#5C402D] hover:to-[#38261B] text-white rounded-2xl font-black text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-[#E50914]/20 active:scale-95"
        >
          {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="bg-white border border-[#FEE2E2] rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#FFF5F5] border-[#E50914] shadow-sm ring-2 ring-[#E50914]/20' 
                    : isCompleted 
                    ? 'bg-[#FFFDF9] border-[#FEE2E2] hover:border-[#E50914]/40' 
                    : 'bg-white border-[#F2EAE1] opacity-60 hover:opacity-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black transition-colors ${
                  isActive 
                    ? 'bg-[#E50914] text-white shadow-sm' 
                    : isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-[#FFF5F5] text-[#757575] border border-[#E50914]/15'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-black truncate ${isActive ? 'text-[#252525]' : 'text-[#E50914]'}`}>
                      {step.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#757575] font-medium truncate mt-0.5">{step.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* WIZARD FORM CONTAINER */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: BRANDING & MEDIA */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center text-[#E50914]">
                    <Camera className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#252525]">Company Media & Visual Branding</h2>
                    <p className="text-xs text-[#757575] font-medium">Upload your company logo and main promotional banner.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#E50914] bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#E50914]/20">
                  Step 1 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 flex flex-col items-center text-center p-6 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE1]">
                  <h3 className="text-xs font-black text-[#252525] uppercase tracking-wider mb-4">Company Logo</h3>
                  <div className="relative group cursor-pointer w-32 h-32 mb-4">
                    <div className="w-full h-full rounded-3xl bg-white border-2 border-dashed border-[#E50914]/30 flex items-center justify-center overflow-hidden shadow-xs group-hover:border-[#E50914] transition-all">
                      {localLogoPreview || companyLogoUrl ? (
                        <img src={localLogoPreview || companyLogoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#757575] p-2">
                          <Camera className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-black uppercase">Upload Logo</span>
                        </div>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-[#252525]/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold">
                      Change Logo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'company_logo', setLocalLogoPreview)} disabled={uploadImage.isPending} />
                    </label>
                  </div>
                  <p className="text-[11px] text-[#757575] font-medium">Recommended: Square format (256×256px)</p>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-3">
                  <h3 className="text-xs font-black text-[#252525] uppercase tracking-wider">Company Banner</h3>
                  <div className="relative group cursor-pointer w-full h-52 sm:h-64 rounded-3xl overflow-hidden border-2 border-dashed border-[#E50914]/30 bg-[#FFFDF9] group-hover:border-[#E50914] transition-all">
                    {localBannerPreview || companyBannerUrl ? (
                      <img src={localBannerPreview || companyBannerUrl} alt="Company Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#757575] p-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center mb-3 text-[#E50914]">
                          <Camera className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-bold text-[#252525] mb-1">Click to upload promotional banner</span>
                        <span className="text-xs text-[#757575]">Recommended resolution: 1200×400px</span>
                      </div>
                    )}
                    <label className="absolute inset-0 bg-[#252525]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="px-4 py-2 bg-white text-[#252525] rounded-xl text-xs font-black shadow-lg">Upload Banner Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'company_banner', setLocalBannerPreview)} disabled={uploadImage.isPending} />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: BUSINESS DETAILS & OPERATING HOURS */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center text-[#E50914]">
                    <Building2 className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#252525]">Business Identity & Operating Hours</h2>
                    <p className="text-xs text-[#757575] font-medium">Core company details and standard weekly availability.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#E50914] bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#E50914]/20">
                  Step 2 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Company Name *</label>
                  <input 
                    {...register('company_name', { required: true })}
                    className={`w-full px-4 py-3 bg-[#FFFDF9] border rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 transition-all ${
                      errors.company_name ? 'border-rose-500' : 'border-[#FEE2E2]'
                    }`}
                    placeholder="Enter your registered company name"
                  />
                  {errors.company_name && <p className="text-xs text-rose-600 font-bold mt-1">Company name is required.</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Company Description</label>
                  <textarea 
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-medium focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 transition-all resize-none"
                    placeholder="Describe your event management services, packages, and expertise..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Registration / Tax ID</label>
                  <input 
                    {...register('business_registration_number')}
                    className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                    placeholder="Tax ID / Registration number"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Established Year</label>
                    <input 
                      type="number"
                      {...register('established_year', { valueAsNumber: true })}
                      className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Years Exp.</label>
                    <input 
                      type="number"
                      {...register('experience_years', { valueAsNumber: true })}
                      className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-[#F2EAE1]">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-[#E50914]" />
                    <label className="block text-xs font-black text-[#252525] uppercase tracking-wider">Weekly Operating Hours</label>
                  </div>
                  <div className="space-y-3">
                    {fields.map((field, index) => {
                      const isClosed = watch(`working_hours.${index}.isClosed`);
                      return (
                        <div key={field.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF9] p-3 sm:p-3.5 rounded-2xl border border-[#FEE2E2]">
                          <div className="flex items-center justify-between sm:w-28 shrink-0">
                            <div>
                              <input type="hidden" {...register(`working_hours.${index}.dayOfWeek`)} />
                              <span className="text-xs font-extrabold text-[#252525] uppercase tracking-wide">{field.dayOfWeek}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                {...register(`working_hours.${index}.isClosed`)}
                                className="w-4 h-4 text-[#E50914] rounded border-gray-300 focus:ring-[#E50914]"
                              />
                              <span className="text-xs text-[#757575] font-bold">Closed</span>
                            </div>
                          </div>
                          {!isClosed && (
                            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
                              <div className="flex-1 sm:flex-initial min-w-0">
                                <Controller
                                  control={control}
                                  name={`working_hours.${index}.openTime`}
                                  render={({ field: { value, onChange } }) => (
                                    <ModernTimePicker 
                                      value={value} 
                                      onChange={onChange} 
                                      placeholder="Open time" 
                                    />
                                  )}
                                />
                              </div>
                              <span className="text-[10px] font-black text-[#757575] uppercase shrink-0">to</span>
                              <div className="flex-1 sm:flex-initial min-w-0">
                                <Controller
                                  control={control}
                                  name={`working_hours.${index}.closeTime`}
                                  render={({ field: { value, onChange } }) => (
                                    <ModernTimePicker 
                                      value={value} 
                                      onChange={onChange} 
                                      placeholder="Close time" 
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONTACT & SOCIALS */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center text-[#E50914]">
                    <Globe className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#252525]">Contact & Social Presence</h2>
                    <p className="text-xs text-[#757575] font-medium">How clients and partners reach you online.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#E50914] bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#E50914]/20">
                  Step 3 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Business Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                    <input 
                      type="email"
                      {...register('business_email')}
                      className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-medium focus:outline-none focus:border-[#E50914]"
                      placeholder="events@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Primary Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                    <input 
                      {...register('business_phone')}
                      className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Alternate Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                    <input 
                      {...register('alternate_phone')}
                      className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                      placeholder="Secondary hotline"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-[#F2EAE1] space-y-4">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider">Social Links & Website</label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                      <input {...register('website_url')} className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#E50914]" placeholder="Website URL (https://...)" />
                    </div>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                      <input {...register('instagram_url')} className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#E50914]" placeholder="Instagram profile URL" />
                    </div>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                      <input {...register('facebook_url')} className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#E50914]" placeholder="Facebook page URL" />
                    </div>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                      <input {...register('youtube_url')} className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#E50914]" placeholder="YouTube channel URL" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: LOCATION & SERVICE RADIUS */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#FEE2E2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8"
            >
              <div className="flex items-center justify-between border-b border-[#F2EAE1] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5F5] border border-[#E50914]/20 flex items-center justify-center text-[#E50914]">
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#252525]">Location & Operational Radius</h2>
                    <p className="text-xs text-[#757575] font-medium">Specify your office address and service coverage range.</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#E50914] bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#E50914]/20">
                  Step 4 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Street Address Line 1</label>
                  <input 
                    {...register('address_line1')}
                    className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                    placeholder="Building name, street, suite number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Address Line 2 (Optional)</label>
                  <input 
                    {...register('address_line2')}
                    className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                    placeholder="Landmark or secondary address info"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">City *</label>
                  <input 
                    {...register('city', { required: true })}
                    className={`w-full px-4 py-3 bg-[#FFFDF9] border rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914] ${
                      errors.city ? 'border-rose-500' : 'border-[#FEE2E2]'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-xs text-rose-600 font-bold mt-1">City is required.</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">State / Region *</label>
                  <input 
                    {...register('state', { required: true })}
                    className={`w-full px-4 py-3 bg-[#FFFDF9] border rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914] ${
                      errors.state ? 'border-rose-500' : 'border-[#FEE2E2]'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-xs text-rose-600 font-bold mt-1">State is required.</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Country</label>
                  <input 
                    {...register('country')}
                    className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                    placeholder="Country"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Postal Code</label>
                  <input 
                    {...register('postal_code')}
                    className="w-full px-4 py-3 bg-[#FFFDF9] border border-[#FEE2E2] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#E50914]"
                    placeholder="ZIP / Pincode"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t border-[#F2EAE1]">
                  <label className="block text-xs font-black text-[#252525] uppercase tracking-wider mb-2">Event Service Radius</label>
                  <div className="flex items-center gap-4 bg-[#FFFDF9] p-4 rounded-2xl border border-[#FEE2E2]">
                    <input 
                      type="range" 
                      min="5" 
                      max="150" 
                      step="5"
                      {...register('service_radius_km', { valueAsNumber: true })}
                      className="flex-1 accent-[#E50914]"
                    />
                    <span className="font-black text-[#E50914] bg-[#FFF5F5] border border-[#E50914]/20 px-4 py-2 rounded-xl text-sm w-24 text-center">
                      {watch('service_radius_km')} km
                    </span>
                  </div>
                  <p className="text-xs text-[#757575] font-medium mt-2">Maximum distance in km from your base location for accepting event bookings.</p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* STEPPER NAVIGATION BUTTONS */}
        <div className="flex justify-between items-center bg-white border border-[#FEE2E2] rounded-3xl p-4 sm:p-5 shadow-xs">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border border-[#FEE2E2] text-[#252525] hover:bg-[#FFF5F5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-[#E50914] hover:bg-[#5C402D] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-md shadow-[#E50914]/20 active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isDirty || updateProfile.isPending}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
              >
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Complete Profile</span>
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
