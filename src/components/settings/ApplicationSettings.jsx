"use client";
import React from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Settings2, Globe, Clock, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const ApplicationSettings = () => {
  const { applicationPreferences, setApplicationPreferences } = useSettingsStore();

  const handleSave = () => {
    // In a real app, you might sync this to the backend or local storage
    toast.success("Application preferences saved successfully");
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:p-8">
      <div className="mb-8 border-b border-border pb-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text">Application Preferences</h2>
          <p className="text-sm text-gray-500 mt-1">Customize your Fahara workspace experience.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Theme Settings */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-bold text-text">Theme Appearance</h4>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {['light', 'dark', 'system'].map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setApplicationPreferences({ theme: themeOption })}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-bold capitalize transition-colors ${
                  applicationPreferences.theme === themeOption 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {themeOption}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-bold text-text">Language</h4>
          </div>
          <div className="max-w-xs">
            <select 
              value={applicationPreferences.language}
              onChange={(e) => setApplicationPreferences({ language: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="en">English (US)</option>
              <option value="en-gb">English (UK)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-bold text-text">Timezone</h4>
          </div>
          <div className="max-w-xs">
            <select 
              value={applicationPreferences.timezone}
              onChange={(e) => setApplicationPreferences({ timezone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="UTC">UTC (Universal Coordinated Time)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            </select>
          </div>
        </div>

        {/* Date/Time Format */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <h4 className="text-sm font-bold text-text">Formats</h4>
          </div>
          <div className="flex gap-4 max-w-md">
            <select 
              value={applicationPreferences.dateFormat}
              onChange={(e) => setApplicationPreferences({ dateFormat: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>

            <select 
              value={applicationPreferences.timeFormat}
              onChange={(e) => setApplicationPreferences({ timeFormat: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
        </div>

        <div className="pt-6 flex justify-end mt-4">
          <button 
            onClick={handleSave}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApplicationSettings;
