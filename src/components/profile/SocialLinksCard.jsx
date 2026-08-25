'use client';

import { useProfileStore } from '@/store/profileStore';
import { Share2, Camera, Globe, Hash, Briefcase, Video } from 'lucide-react';

export default function SocialLinksCard() {
  const { customFields, updateCustomFields } = useProfileStore();
  const links = customFields?.socialLinks || {};

  const handleLinkChange = (platform, value) => {
    updateCustomFields({
      socialLinks: { ...links, [platform]: value }
    });
  };

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: Camera, placeholder: 'https://instagram.com/yourbusiness', hoverColor: 'group-hover:text-pink-500', focusRing: 'focus:ring-pink-500/20 focus:border-pink-500/50' },
    { id: 'facebook', label: 'Facebook', icon: Globe, placeholder: 'https://facebook.com/yourbusiness', hoverColor: 'group-hover:text-blue-500', focusRing: 'focus:ring-blue-500/20 focus:border-blue-500/50' },
    { id: 'twitter', label: 'X (Twitter)', icon: Hash, placeholder: 'https://twitter.com/yourbusiness', hoverColor: 'group-hover:text-blue-400', focusRing: 'focus:ring-blue-400/20 focus:border-blue-400/50' },
    { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, placeholder: 'https://linkedin.com/company/yourbusiness', hoverColor: 'group-hover:text-blue-600', focusRing: 'focus:ring-blue-600/20 focus:border-blue-600/50' },
    { id: 'youtube', label: 'YouTube', icon: Video, placeholder: 'https://youtube.com/@yourbusiness', hoverColor: 'group-hover:text-red-500', focusRing: 'focus:ring-red-500/20 focus:border-red-500/50' },
  ];

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group/card">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover/card:bg-primary/10 transition-colors duration-500" />
      
      <div className="border-b border-white/5 p-6 md:p-8 flex items-center gap-5 bg-gradient-to-r from-background/50 to-surface/50 backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <Share2 className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text tracking-tight">Social Media Links</h2>
          <p className="text-sm text-text/60 mt-1 font-medium">Connect your business profiles</p>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.id} className="group">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-text/80 ml-1">
                <Icon className={`w-4 h-4 text-primary/70 transition-colors duration-300 ${platform.hoverColor}`} />
                <label>{platform.label}</label>
              </div>
              <input 
                type="url" 
                value={links[platform.id] || ''}
                onChange={(e) => handleLinkChange(platform.id, e.target.value)}
                className={`w-full bg-background/50 hover:bg-surface/50 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-sm text-sm ${platform.focusRing}`}
                placeholder={platform.placeholder}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
