'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Sparkles, Send, Tag, Calendar, Gift, Heart, Info, 
  Search, Eye, CheckCircle2, PartyPopper, Briefcase, Zap, Star, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMAIL_TEMPLATES = [
  {
    id: 'event-marketing',
    title: 'Exclusive Event Setup & Celebration Deal',
    category: 'Marketing',
    icon: Gift,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconGradient: 'from-amber-500 to-orange-600',
    subject: '🎉 Transform Your Celebration with Exclusive Event Packages & Special Discounts!',
    content: 'Hello {{customer_name}},\n\nPlanning a birthday party, wedding celebration, corporate gathering, or anniversary?\n\nLet {{company_name}} handle everything! We offer custom theme decorations, professional sound & lighting, live entertainment, and full event coordination.\n\nBook your event arrangement package this month and receive a complimentary photo booth setup or dessert station!\n\nReserve your date today and let us create unforgettable memories for you and your guests.\n\nBest regards,\n{{company_name}} Team',
  },
  {
    id: 'special-discount',
    title: 'Promotional Offer & Discount',
    category: 'Offers',
    icon: Tag,
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    iconGradient: 'from-rose-500 to-pink-600',
    subject: '🔥 Exclusive 15% OFF on Your Next Event Reservation!',
    content: 'Hi {{customer_name}},\n\nWe have an exclusive offer just for you! Book your next event management service or party setup with us and enjoy a flat 15% OFF.\n\nUse Promo Code: Grab2GO15 when booking your event package.\n\nDon\'t miss out—this limited-time discount is valid through the end of the month!\n\nBest regards,\nGrab2GO Event Management',
  },
  {
    id: 'venue-announcement',
    title: 'New Service & Venue Announcement',
    category: 'Announcements',
    icon: Sparkles,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    iconGradient: 'from-purple-500 to-indigo-600',
    subject: '✨ Exciting New Event Services & Package Add-ons Available!',
    content: 'Hello {{customer_name}},\n\nWe are excited to announce brand new event decor packages, live acoustic setups, and custom catering offerings now available at {{cafe_name}}!\n\nWhether you are planning a birthday party, anniversary celebration, or corporate gathering, our upgraded packages deliver a seamless, memorable experience.\n\nExplore our new offerings and reserve your date today!\n\nCheers,\nThe Event Team',
  },
  {
    id: 'customer-appreciation',
    title: 'Customer Appreciation & Review Request',
    category: 'Follow Up',
    icon: Heart,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconGradient: 'from-emerald-500 to-teal-600',
    subject: 'Thank you for celebrating your event with us! ❤️',
    content: 'Dear {{customer_name}},\n\nThank you so much for celebrating your recent occasion with {{service_name}}! It was our absolute pleasure hosting you and your guests.\n\nWe would love to hear about your experience! Please take a quick moment to leave us a review or reply with any feedback.\n\nWe look forward to hosting your next event soon!\n\nWarm wishes,\nGrab2GO Events',
  },
  {
    id: 'birthday-special',
    title: 'Birthday Party Extravaganza Package',
    category: 'Celebrations',
    icon: PartyPopper,
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    iconGradient: 'from-cyan-500 to-blue-600',
    subject: '🎂 Make Your Upcoming Birthday Magical with Grab2GO Event Packages!',
    content: 'Hi {{customer_name}},\n\nIs your birthday or a loved one\'s special day around the corner?\n\nCelebrate stress-free with our complete Birthday Extravaganza setup! Includes customized balloon arches, personalized theme backdrops, cake cutting arrangements, and dedicated event coordination.\n\nBook 7 days in advance and get free custom invitation graphics for your guests!\n\nCheers,\n{{company_name}} Celebrations Team',
  },
  {
    id: 'corporate-meeting',
    title: 'Corporate Meeting & Conference Booking',
    category: 'Corporate',
    icon: Briefcase,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    iconGradient: 'from-sky-500 to-indigo-700',
    subject: '💼 Premium Corporate Event & Conference Management Services',
    content: 'Dear {{customer_name}},\n\nElevate your next corporate meeting, product launch, or team celebration with professional event arrangements by {{company_name}}.\n\nWe provide high-speed presentation tech setups, audio-visual gear, executive seating, and customized coffee break catering.\n\nContact us today for a tailored corporate proposal.\n\nBest regards,\nCorporate Events Team',
  },
  {
    id: 'early-bird-booking',
    title: 'Early Bird Holiday & Weekend Booking',
    category: 'Offers',
    icon: Zap,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconGradient: 'from-amber-400 to-amber-600',
    subject: '⚡ Reserve Early for Weekend & Holiday Celebrations!',
    content: 'Hello {{customer_name}},\n\nWeekend and holiday dates fill up fast! Lock in your preferred venue time slot and event manager setup early to secure priority scheduling.\n\nEarly bird reservations made this week qualify for a complimentary welcome drink bar for up to 10 guests.\n\nDon\'t wait—confirm your booking today!\n\nBest regards,\nGrab2GO Reservations Team',
  },
  {
    id: 'vip-membership',
    title: 'VIP Hospitality & Special Invitation',
    category: 'Marketing',
    icon: Star,
    badgeColor: 'bg-violet-50 text-violet-800 border-violet-200',
    iconGradient: 'from-violet-600 to-purple-800',
    subject: '⭐ You are Invited: Exclusive VIP Event Consultation & Tasting',
    content: 'Dear {{customer_name}},\n\nAs one of our valued guests, we are delighted to extend a private invitation for a complimentary event planning consultation.\n\nDiscuss your upcoming celebration with our top event directors and preview our premium decor & food options.\n\nReply directly to this message to claim your VIP consultation slot.\n\nWarm regards,\nGrab2GO Executive Suite',
  },
];

const CATEGORIES = ['All', 'Marketing', 'Offers', 'Announcements', 'Follow Up', 'Celebrations', 'Corporate'];

export default function MessageTemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = useMemo(() => {
    return EMAIL_TEMPLATES.filter((tmpl) => {
      const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory;
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        tmpl.title.toLowerCase().includes(searchLower) || 
        tmpl.subject.toLowerCase().includes(searchLower) ||
        tmpl.category.toLowerCase().includes(searchLower);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, search]);

  const handleSelectTemplate = (template) => {
    const params = new URLSearchParams();
    params.set('subject', template.subject);
    params.set('content', template.content);
    router.push(`/event/notifications/compose?${params.toString()}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#252525]">
      
      {/* Modern Header Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF5F5] to-[#FFF5F5] p-6 sm:p-8 rounded-3xl border border-[#EF5350]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => router.push('/event/notifications/compose')}
            className="w-10 h-10 rounded-2xl bg-white border border-[#EF5350]/60 hover:bg-[#E50914] text-[#E50914] hover:text-white flex items-center justify-center shadow-2xs transition-all shrink-0 cursor-pointer"
            title="Back to Compose"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E50914]/10 text-[#E50914] text-xs font-extrabold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BROADCAST TEMPLATES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#252525] tracking-tight">
              Email Message Templates
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
              Select or preview a pre-built email template to quickly populate your broadcast campaigns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#E50914] bg-white border border-[#EF5350]/60 px-3.5 py-2 rounded-2xl shadow-2xs">
            {filteredTemplates.length} Template{filteredTemplates.length !== 1 ? 's' : ''} Available
          </span>
        </div>
      </div>

      {/* Controls Bar: Category Filter & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                    isActive 
                      ? 'bg-[#E50914] text-white shadow-2xs' 
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="h-4 w-4" />
            </div>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white text-xs font-medium text-[#252525] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/20" 
              placeholder="Search templates or subjects..." 
            />
          </div>

        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200/80 shadow-2xs space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto font-black">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-base font-extrabold text-[#252525]">No Templates Found</h3>
          <p className="text-xs text-stone-500 font-medium">Try adjusting your search terms or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredTemplates.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <motion.div
                key={tmpl.id}
                whileHover={{ y: -3 }}
                className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tmpl.iconGradient} text-white flex items-center justify-center shadow-xs shrink-0 font-black`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#252525] leading-tight">{tmpl.title}</h3>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border inline-block mt-1 ${tmpl.badgeColor}`}>
                          {tmpl.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50/90 rounded-2xl border border-stone-200/80 space-y-1.5">
                    <p className="text-xs font-black text-[#252525] truncate">Subject: {tmpl.subject}</p>
                    <p className="text-xs text-stone-500 font-medium line-clamp-3 leading-relaxed whitespace-pre-wrap">{tmpl.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-[#252525] text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={14} /> Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="py-2.5 px-4 bg-gradient-to-r from-[#B71C1C] to-[#E50914] hover:from-[#3D2509] hover:to-[#5C402E] text-white text-xs font-black rounded-2xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Send size={14} /> Use Template
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-stone-200 p-6 max-w-lg w-full shadow-2xl space-y-4 text-[#252525] max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${previewTemplate.iconGradient} text-white flex items-center justify-center font-black`}>
                    <previewTemplate.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#252525]">{previewTemplate.title}</h3>
                    <span className="text-[10px] font-black text-[#E50914] uppercase">{previewTemplate.category}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block mb-0.5">Subject Line</span>
                  <p className="text-xs font-black text-[#252525]">{previewTemplate.subject}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block mb-1.5">Email Body</span>
                  <p className="text-xs text-stone-700 font-medium leading-relaxed whitespace-pre-wrap">{previewTemplate.content}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tmpl = previewTemplate;
                    setPreviewTemplate(null);
                    handleSelectTemplate(tmpl);
                  }}
                  className="px-5 py-2 bg-[#E50914] text-white font-bold rounded-xl text-xs hover:bg-[#B71C1C] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send size={13} /> Select This Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
