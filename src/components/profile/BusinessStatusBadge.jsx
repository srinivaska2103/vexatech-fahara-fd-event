'use client';

import { useProfileStore } from '@/store/profileStore';

export default function BusinessStatusBadge() {
  const { profile } = useProfileStore();

  const status = profile?.status || 'PENDING';
  
  const getBadgeStyle = () => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'INACTIVE': return 'bg-red-100 text-red-700 border-red-200';
      case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'PENDING': default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
}
