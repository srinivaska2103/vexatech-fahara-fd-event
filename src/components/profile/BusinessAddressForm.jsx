'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfileStore } from '@/store/profileStore';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR window is not defined error
const LocationMap = dynamic(() => import('./LocationMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-background animate-pulse rounded-xl flex items-center justify-center text-text/50">Loading Map...</div>
});

export default function BusinessAddressForm() {
  const { profile, setProfile } = useProfileStore();

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      address: profile?.address || '',
      city: profile?.city || '',
      latitude: profile?.latitude || 28.6139, // Default to New Delhi
      longitude: profile?.longitude || 77.2090,
    }
  });

  const watchLat = watch('latitude');
  const watchLng = watch('longitude');

  useEffect(() => {
    reset({
      address: profile?.address || '',
      city: profile?.city || '',
      latitude: profile?.latitude || 28.6139,
      longitude: profile?.longitude || 77.2090,
    });
  }, [profile, reset]);

  const onSubmit = (data) => {
    setProfile({
      ...profile,
      address: data.address,
      city: data.city,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    });
  };

  const handleLocationChange = (lat, lng) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
    // Auto submit to store on map drag
    setProfile({
      ...profile,
      latitude: lat,
      longitude: lng
    });
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group">
      {/* Decorative gradient orb */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors duration-500" />

      <div className="border-b border-white/5 p-6 md:p-8 flex items-center gap-5 bg-gradient-to-r from-background/50 to-surface/50 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <MapPin className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight">Business Address</h2>
          <p className="text-sm text-text/60 mt-1 font-medium">Your physical office or primary venue location</p>
        </div>
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <form onChange={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">Street Address</label>
            <input 
              type="text" 
              {...register('address')}
              className="w-full bg-background/50 hover:bg-surface/50 border border-white/10 hover:border-primary/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm"
              placeholder="123 Event Street, Sector 4"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text/80 ml-1">City</label>
            <input 
              type="text" 
              {...register('city')}
              className="w-full bg-background/50 hover:bg-surface/50 border border-white/10 hover:border-primary/50 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm"
              placeholder="e.g. Mumbai"
            />
          </div>
        </form>

        <div className="mt-8">
          <label className="block text-sm font-semibold text-text/80 mb-4 ml-1">Pinpoint on Map</label>
          <div className="border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-primary/10 transition-shadow h-[300px] md:h-[400px] relative">
            <div className="absolute inset-0 bg-primary/5 animate-pulse mix-blend-overlay pointer-events-none" />
            <LocationMap 
              position={[watchLat, watchLng]} 
              onChange={handleLocationChange} 
            />
          </div>
          <div className="flex justify-between items-center mt-4 px-2 text-xs text-text/50 font-mono">
            <span className="bg-background/50 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">Lat: {Number(watchLat).toFixed(6)}</span>
            <span className="bg-background/50 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">Lng: {Number(watchLng).toFixed(6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
