'use client';

import React, { useState } from 'react';
import ReviewStatusBadge from './ReviewStatusBadge';
import StarRating from './StarRating';
import { format } from 'date-fns';
import { Calendar, User, ShoppingBag, Copy, Check, Sparkles, Mail, Phone, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewDetailsCard({ review }) {
  const [copied, setCopied] = useState(false);

  if (!review) return null;

  const reviewText = review.content || review.review || review.comment || review.review_text || 'No text content provided in this review.';
  const rating = Number(review.rating || 5);
  const bookingId = review.booking_number || (review.booking_id ? `#${String(review.booking_id).slice(0, 8)}` : 'N/A');

  const handleCopyBookingId = () => {
    if (review.booking_id || review.booking_number) {
      navigator.clipboard.writeText(review.booking_number || review.booking_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSentiment = (r) => {
    if (r >= 5) return { label: 'Outstanding Experience', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (r >= 4) return { label: 'Great Service', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    if (r >= 3) return { label: 'Average', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    return { label: 'Needs Attention', color: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const sentiment = getSentiment(rating);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.04)] mb-6 font-sans relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Bar: Customer Profile & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4A2C11] to-[#6F4E37] text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white">
              {review.customer_name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
              ✓
            </div>
          </div>

          <div>
            <h1 className="text-xl font-black text-[#2C1810] tracking-tight flex items-center gap-2">
              {review.customer_name || review.user_name || 'Valued Customer'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#6F4E37]" /> Verified Customer
              </span>
              {review.customer_email && (
                <span className="flex items-center gap-1 text-stone-600">
                  <Mail className="w-3.5 h-3.5 text-[#6F4E37]" /> {review.customer_email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center sm:items-end gap-2.5 shrink-0">
          <ReviewStatusBadge status={review.status || 'PUBLISHED'} />
          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${sentiment.color}`}>
            {sentiment.label}
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <StarRating rating={rating} size="w-6 h-6" />
          <span className="text-xl font-black text-[#2C1810]">{rating}.0</span>
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider border-l border-stone-200 pl-3">
            {review.created_at ? format(new Date(review.created_at), 'MMMM d, yyyy') : 'Recent Review'}
          </span>
        </div>

        <div className="bg-[#FFF8F0]/60 border border-[#DDB892]/40 rounded-2xl p-5 sm:p-6 text-stone-800 leading-relaxed font-medium text-base sm:text-lg italic shadow-2xs relative">
          <Sparkles className="w-5 h-5 text-amber-500/40 absolute top-4 right-4" />
          &ldquo;{reviewText}&rdquo;
        </div>
      </div>

      {/* Meta Grid: Service Booked & Booking ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#6F4E37] shadow-2xs shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Service Booked</p>
              <p className="text-sm font-black text-[#2C1810]">{review.service_name || review.category || 'Event Service'}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full uppercase tracking-wider">
            Verified
          </span>
        </div>

        <div className="bg-stone-50/90 border border-stone-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-[#6F4E37] shadow-2xs shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Booking ID</p>
              <p className="text-sm font-mono font-black text-[#2C1810] truncate">{bookingId}</p>
            </div>
          </div>
          <button
            onClick={handleCopyBookingId}
            className="p-2 bg-white border border-stone-200/90 rounded-xl hover:bg-[#FFF8F0] text-[#6F4E37] shadow-2xs transition-all cursor-pointer shrink-0"
            title="Copy Booking ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
