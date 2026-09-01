'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import SidebarNavigation from '@/components/dashboard/SidebarNavigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTour from '@/components/dashboard/DashboardTour';
import BottomNavigation from '@/components/dashboard/BottomNavigation';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.title = "Fahara Event Manager";
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      const isTabletOrMobile = window.innerWidth < 1024;
      setIsMobile(isTabletOrMobile);
      if (!isTabletOrMobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ProtectedLayout>
      <div className="flex h-screen overflow-hidden bg-background">
        <SidebarNavigation 
          isOpen={isSidebarOpen} 
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative w-full min-w-0">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
          
          <div className="flex-1 overflow-auto bg-background p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12">
            {children}
          </div>
          <DashboardTour />
          <BottomNavigation />
        </main>
      </div>
    </ProtectedLayout>
  );
}
