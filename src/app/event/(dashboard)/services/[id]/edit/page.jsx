'use client';

import { use } from 'react';
import { useGetServiceByIdQuery } from '@/hooks/services/useServicesQueries';
import ServiceForm from '@/components/services/ServiceForm';
import { Loader2 } from 'lucide-react';

export default function EditServicePage({ params }) {
  const resolvedParams = use(params);
  const { data: service, isLoading, isError } = useGetServiceByIdQuery(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A2E1D]" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="bg-rose-50 text-rose-600 p-6 rounded-3xl text-center border border-rose-200 font-sans">
        <h2 className="text-lg font-bold mb-1">Package Not Found</h2>
        <p className="text-xs">The package you are trying to edit does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none">
      <ServiceForm initialData={service} />
    </div>
  );
}
