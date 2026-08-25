"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdatePassword } from '@/hooks/settings/useSettingsQueries';
import { Loader2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const PasswordSettings = () => {
  const updatePassword = useUpdatePassword();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  const onSubmit = (data) => {
    updatePassword.mutate(data, {
      onSuccess: () => {
        toast.success("Password updated successfully");
        reset();
      },
      onError: () => toast.error("Failed to update password. Check current password.")
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-6 lg:p-8 mb-6">
      <div className="mb-6 border-b border-border pb-4 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Change Password</h3>
          <p className="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Current Password</label>
          <input 
            type="password"
            {...register('currentPassword')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-2">New Password</label>
          <input 
            type="password"
            {...register('newPassword')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-2">Confirm New Password</label>
          <input 
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={!isDirty || updatePassword.isPending}
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updatePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSettings;
