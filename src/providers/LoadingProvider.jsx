'use client';

import { useUIStore } from '@/store/uiStore';

export default function LoadingProvider({ children }) {
  const { isGlobalLoading } = useUIStore();

  return (
    <>
      {isGlobalLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      {children}
    </>
  );
}
