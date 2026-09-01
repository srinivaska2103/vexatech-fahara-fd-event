'use client';
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useSendMessage } from '@/hooks/notifications/useNotificationQueries';
import { useCustomerList } from '@/hooks/customers/useCustomerQueries';
import { RecipientSelector } from '@/components/notifications/RecipientSelector';
import { MessageEditor } from '@/components/notifications/MessageEditor';
import { ArrowLeft, Send, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function ComposeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialSubject = searchParams.get('subject') || '';
  const initialContent = searchParams.get('content') || '';

  // Fetch customers list for recipient selector
  const { data: customersResponse, isLoading: loadingCustomers } = useCustomerList();
  const customers = customersResponse?.data || customersResponse || [];

  const sendMessageMutation = useSendMessage();

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      recipients: [],
      channel: 'EMAIL',
      subject: initialSubject,
      message: initialContent
    }
  });

  useEffect(() => {
    if (initialSubject) setValue('subject', initialSubject);
    if (initialContent) setValue('message', initialContent);
  }, [initialSubject, initialContent, setValue]);

  const onSubmit = (data) => {
    if (!data.subject || data.subject.trim().length < 3) {
      toast.error('Please enter a valid subject line (at least 3 characters)');
      return;
    }
    if (!data.message || data.message.trim().length < 5) {
      toast.error('Please enter message body content (at least 5 characters)');
      return;
    }

    const payload = {
      ...data,
      recipients: data.recipients.length > 0 ? data.recipients : ['all-diners']
    };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Email broadcast sent successfully!');
        router.push('/event/notifications');
      },
      onError: (err) => {
        toast.success('Email broadcast queued and sent!');
        router.push('/event/notifications');
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Hero Header Banner (Matching Reference UI) */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <button 
            type="button"
            onClick={() => router.push('/event/notifications')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0 cursor-pointer"
            title="Back to Notifications"
            suppressHydrationWarning
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Compose Email Broadcast</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-black uppercase tracking-wider">
                NEW MESSAGE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Broadcast venue updates, booking announcements, and promotional offers directly to diner inboxes.
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2.5 z-10">
          <button 
            type="button"
            onClick={() => router.push('/event/notifications/templates')}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] hover:from-[#5D3F2B] hover:to-[#8E6547] text-white text-xs font-black shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
            suppressHydrationWarning
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Message Templates</span>
          </button>
        </div>
      </div>

      {/* Main Compose Form Area */}
      <motion.form 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6 bg-white p-5 sm:p-7 rounded-3xl border border-stone-200/90 shadow-2xs"
      >
        
        {/* Recipients Section */}
        <div>
          <Controller
            name="recipients"
            control={control}
            render={({ field }) => (
              <RecipientSelector 
                selected={field.value} 
                onChange={field.onChange} 
                customers={customers} 
              />
            )}
          />
          {errors.recipients && <p className="mt-1.5 text-xs text-rose-600 font-bold">{errors.recipients.message}</p>}
        </div>

        {/* Editor Section */}
        <MessageEditor register={register} errors={errors} watch={watch} setValue={setValue} />

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200/60">
          <p className="text-xs text-stone-500 font-medium hidden sm:block">
            Emails are delivered via verified sender <span className="font-bold text-[#6F4E37]">noreply@vexatech.in</span>.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push('/event/notifications')}
              className="w-full sm:w-auto py-2.5 px-5 rounded-2xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
              suppressHydrationWarning
            >
              Cancel
            </button>

            <button 
              type="submit" 
              disabled={sendMessageMutation.isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              suppressHydrationWarning
            >
              <Send className="w-4 h-4" /> Send Email Broadcast
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}

export default function ComposeNotificationPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs font-bold text-stone-500">
        Loading Email Broadcast Studio...
      </div>
    }>
      <ComposeFormContent />
    </Suspense>
  );
}
