'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Send, Tag, Calendar, Gift, Heart, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EMAIL_TEMPLATES = [
  {
    id: 'event-marketing',
    title: 'Exclusive Event Setup & Celebration Deal',
    category: 'Marketing',
    icon: Gift,
    color: 'from-amber-500 to-orange-600',
    subject: '🎉 Transform Your Celebration with Exclusive Event Packages & Special Discounts!',
    content: 'Hello {{customer_name}},\n\nPlanning a birthday party, wedding celebration, corporate gathering, or anniversary?\n\nLet {{company_name}} handle everything! We offer custom theme decorations, professional sound & lighting, live entertainment, and full event coordination.\n\nBook your event arrangement package this month and receive a complimentary photo booth setup or dessert station!\n\nReserve your date today and let us create unforgettable memories for you and your guests.\n\nBest regards,\n{{company_name}} Team',
  },
  {
    id: 'special-discount',
    title: 'Promotional Offer & Discount',
    category: 'Offers',
    icon: Tag,
    color: 'from-rose-500 to-pink-600',
    subject: '🔥 Exclusive 15% OFF on Your Next Event Reservation!',
    content: 'Hi {{customer_name}},\n\nWe have an exclusive offer just for you! Book your next event management service or party setup with us and enjoy a flat 15% OFF.\n\nUse Promo Code: FAHARA15 when booking your event package.\n\nDon\'t miss out—this limited-time discount is valid through the end of the month!\n\nBest regards,\nFahara Event Management',
  },
  {
    id: 'venue-announcement',
    title: 'New Service & Venue Announcement',
    category: 'Announcements',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600',
    subject: '✨ Exciting New Event Services & Package Add-ons Available!',
    content: 'Hello {{customer_name}},\n\nWe are excited to announce brand new event decor packages, live acoustic setups, and custom catering offerings now available at {{cafe_name}}!\n\nWhether you are planning a birthday party, anniversary celebration, or corporate gathering, our upgraded packages deliver a seamless, memorable experience.\n\nExplore our new offerings and reserve your date today!\n\nCheers,\nThe Event Team',
  },
  {
    id: 'customer-appreciation',
    title: 'Customer Appreciation & Feedback',
    category: 'Follow Up',
    icon: Heart,
    color: 'from-emerald-500 to-teal-600',
    subject: 'Thank you for celebrating your event with us! ❤️',
    content: 'Dear {{customer_name}},\n\nThank you so much for celebrating your recent occasion with {{service_name}}! It was our absolute pleasure hosting you and your guests.\n\nWe would love to hear about your experience! Please take a quick moment to leave us a review or reply with any feedback.\n\nWe look forward to hosting your next event soon!\n\nWarm wishes,\nFahara Events',
  },
];

export default function MessageTemplatesPage() {
  const router = useRouter();

  const handleSelectTemplate = (template) => {
    const params = new URLSearchParams();
    params.set('subject', template.subject);
    params.set('content', template.content);
    router.push(`/event/notifications/compose?${params.toString()}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-5 sm:p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button 
            type="button"
            onClick={() => router.push('/event/notifications/compose')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#DDB892]/60 hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0 cursor-pointer"
            title="Back to Compose"
            suppressHydrationWarning
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Email Message Templates</h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Select a pre-built email template to quickly populate your email broadcast content.
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EMAIL_TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <motion.div
              key={tmpl.id}
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${tmpl.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#2C1810]">{tmpl.title}</h3>
                      <span className="text-[10px] font-black text-[#6F4E37] bg-[#6F4E37]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {tmpl.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/70 space-y-1.5">
                  <p className="text-xs font-black text-[#2C1810] truncate">Subject: {tmpl.subject}</p>
                  <p className="text-xs text-stone-500 font-medium line-clamp-3 leading-relaxed">{tmpl.content}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectTemplate(tmpl)}
                className="w-full py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5D3F2B] text-white text-xs font-extrabold rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                suppressHydrationWarning
              >
                <Send className="w-3.5 h-3.5" /> Use This Template
              </button>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
