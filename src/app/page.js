'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/event/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#2C1810]">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
