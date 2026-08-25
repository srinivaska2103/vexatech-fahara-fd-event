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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="bg-red-50 text-red-500 p-6 rounded-2xl text-center border border-red-100">
        <h2 className="text-lg font-bold mb-2">Service Not Found</h2>
        <p>The service you are trying to edit does not exist or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Edit Service</h1>
        <p className="text-sm text-text/60 mt-1">Update details for {service.service_name}</p>
      </div>
      
      <ServiceForm initialData={service} />
    </div>
  );
}
