'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }) {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    // In future phases: verify token and load user profile
    // For now, just set loading to false
    setLoading(false);
  }, [setLoading]);

  return <>{children}</>;
}
