'use client';

import React from 'react';
import { usePaymentAccount } from '@/hooks/finance/useFinanceQueries';
import { useGetProfileQuery } from '@/hooks/profile/useProfileMutations';
import { useAuthStore } from '@/store/authStore';
import PaymentAccountCard from '@/components/finance/PaymentAccountCard';
import UpdateBankModal from '@/components/finance/UpdateBankModal';
import VerificationModal from '@/components/finance/VerificationModal';
import { Loader2 } from 'lucide-react';

export default function PaymentAccountPage() {
  const { data: accountData, isLoading: isAccountLoading } = usePaymentAccount();
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const { user } = useAuthStore();

  const isLoading = isAccountLoading || isProfileLoading;

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <PaymentAccountCard 
          accountData={accountData} 
          profileData={profileData}
          user={user}
          isLoading={isLoading} 
        />
      </div>

      {/* Modals */}
      <UpdateBankModal />
      <VerificationModal />
    </div>
  );
}
