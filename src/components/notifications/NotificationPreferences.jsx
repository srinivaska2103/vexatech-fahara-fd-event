"use client";
import React from 'react';
import { useNotificationPreferences, useUpdatePreferences } from '@/hooks/notifications/useNotificationQueries';
import { Loader2, Bell, Mail, Smartphone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const PreferenceToggle = ({ label, description, icon, checked, onChange }) => (
  <div className="flex items-start justify-between p-4 bg-white rounded-xl border border-border shadow-sm hover:border-primary/30 transition-colors">
    <div className="flex gap-4">
      <div className="p-2.5 bg-primary/10 rounded-lg text-primary mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-text text-sm">{label}</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-[280px] leading-relaxed">{description}</p>
      </div>
    </div>
    
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-2">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
  </div>
);

const NotificationPreferences = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdatePreferences();

  const [localPrefs, setLocalPrefs] = React.useState(null);

  React.useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = (key, value) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updatePreferences.mutate(localPrefs, {
      onSuccess: () => toast.success("Preferences updated successfully!")
    });
  };

  if (isLoading || !localPrefs) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      
      {/* Global Delivery Methods */}
      <section>
        <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Delivery Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PreferenceToggle 
            label="Email Notifications" 
            description="Receive daily summaries and important alerts directly to your inbox."
            icon={<Mail className="w-5 h-5" />}
            checked={localPrefs.emailNotifications}
            onChange={(val) => handleToggle('emailNotifications', val)}
          />
          <PreferenceToggle 
            label="Push Notifications" 
            description="Get real-time browser alerts even when you're not on the platform."
            icon={<Smartphone className="w-5 h-5" />}
            checked={localPrefs.pushNotifications}
            onChange={(val) => handleToggle('pushNotifications', val)}
          />
        </div>
      </section>

      {/* Alert Types */}
      <section>
        <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Alert Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PreferenceToggle 
            label="Booking Alerts" 
            description="Get notified about new bookings, cancellations, and modifications."
            icon={<Bell className="w-5 h-5" />}
            checked={localPrefs.bookingAlerts}
            onChange={(val) => handleToggle('bookingAlerts', val)}
          />
          <PreferenceToggle 
            label="Payment Alerts" 
            description="Receive updates when payments are processed, failed, or refunded."
            icon={<Bell className="w-5 h-5" />}
            checked={localPrefs.paymentAlerts}
            onChange={(val) => handleToggle('paymentAlerts', val)}
          />
          <PreferenceToggle 
            label="Review Alerts" 
            description="Be notified when a customer leaves a new review or rating."
            icon={<Bell className="w-5 h-5" />}
            checked={localPrefs.reviewAlerts}
            onChange={(val) => handleToggle('reviewAlerts', val)}
          />
          <PreferenceToggle 
            label="Customer Messages" 
            description="Alerts for new direct messages from your clients."
            icon={<Bell className="w-5 h-5" />}
            checked={localPrefs.customerMessageAlerts}
            onChange={(val) => handleToggle('customerMessageAlerts', val)}
          />
          <PreferenceToggle 
            label="Marketing & Offers" 
            description="Receive occasional updates about new platform features."
            icon={<Bell className="w-5 h-5" />}
            checked={localPrefs.marketingNotifications}
            onChange={(val) => handleToggle('marketingNotifications', val)}
          />
          <PreferenceToggle 
            label="System Notifications" 
            description="Important security and account status updates (recommended)."
            icon={<Bell className="w-5 h-5" />}
            checked={localPrefs.systemNotifications}
            onChange={(val) => handleToggle('systemNotifications', val)}
          />
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={updatePreferences.isPending}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {updatePreferences.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Preferences
        </button>
      </div>

    </div>
  );
};

export default NotificationPreferences;
