'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateStaffMutation, useUpdateStaffMutation } from '@/hooks/staff/useStaffMutations';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  role: z.string().min(1, 'Role is required'),
  experience: z.string().min(1, 'Experience is required'),
  emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 characters'),
});

export default function StaffForm({ initialData = null }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation(initialData?.id);
  
  const mutation = isEditing ? updateMutation : createMutation;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      role: '',
      experience: '',
      emergencyContact: '',
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.push('/event/staff');
      }
    });
  };

  const ROLES = ['Team Leader', 'Event Coordinator', 'Photographer', 'Videographer', 'Decorator', 'Catering Staff', 'DJ', 'Lighting Technician'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-text mb-6 pb-2 border-b border-border">Personal Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text mb-1">Full Name</label>
            <input 
              {...register('name')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-text mb-1">Email Address</label>
            <input 
              {...register('email')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-text mb-1">Phone Number</label>
            <input 
              {...register('phone')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" 
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-text mb-1">Emergency Contact</label>
            <input 
              {...register('emergencyContact')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" 
            />
            {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-text mb-6 pb-2 border-b border-border">Professional Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text mb-1">Primary Role</label>
            <select 
              {...register('role')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select a role</option>
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-text mb-1">Experience Level</label>
            <select 
              {...register('experience')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select experience</option>
              <option value="Fresher (0-1 years)">Fresher (0-1 years)</option>
              <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
              <option value="Experienced (3-5 years)">Experienced (3-5 years)</option>
              <option value="Expert (5+ years)">Expert (5+ years)</option>
            </select>
            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.push('/event/staff')}
          className="px-6 py-3 font-bold text-sm text-text hover:bg-surface border border-border rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="px-6 py-3 font-bold text-sm text-white bg-primary hover:bg-secondary rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEditing ? 'Save Changes' : 'Create Staff Member'}
        </button>
      </div>
    </form>
  );
}
