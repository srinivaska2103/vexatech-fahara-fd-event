'use client';

import { Clock, Send, MessageCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function ReviewTimeline({ review }) {
  if (!review) return null;

  const timeline = [
    {
      id: 1,
      title: 'Review Submitted',
      description: 'Customer posted a rating and comment.',
      date: review.created_at || new Date().toISOString(),
      icon: Send,
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  ];

  if (review.status === 'FLAGGED') {
    timeline.push({
      id: 2,
      title: 'Review Flagged',
      description: 'Marked for internal moderation review.',
      date: review.updated_at || new Date().toISOString(),
      icon: AlertTriangle,
      badge: 'bg-rose-100 text-rose-800 border-rose-300'
    });
  }

  const replyText = review.reply_text || review.reply || review.owner_reply;
  if (replyText) {
    timeline.push({
      id: 3,
      title: 'Manager Response Posted',
      description: 'Official public response published.',
      date: review.replied_at || review.reply_at || new Date().toISOString(),
      icon: MessageCircle,
      badge: 'bg-amber-100 text-amber-900 border-amber-300'
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.04)] mb-6 font-sans"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <h3 className="text-sm font-black text-[#2C1810] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-[#6F4E37]" /> Review Activity
        </h3>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#6F4E37] bg-[#FFF8F0] px-2.5 py-1 rounded-full border border-[#DDB892]/40">
          History Log
        </span>
      </div>
      
      <div className="relative pl-6 border-l-2 border-stone-200/80 space-y-6 mt-4 ml-2">
        {timeline.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="relative group">
              <div className={`absolute -left-[37px] w-7 h-7 rounded-full flex items-center justify-center ${event.badge} border-2 border-white shadow-2xs transition-transform group-hover:scale-110`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#2C1810]">{event.title}</h4>
                <p className="text-xs text-stone-500 font-medium mt-0.5">{event.description}</p>
                <span className="text-[10px] font-extrabold text-[#6F4E37] uppercase tracking-wider mt-1 block">
                  {format(new Date(event.date), 'MMM d, yyyy · h:mm a')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
