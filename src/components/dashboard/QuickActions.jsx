'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlusCircle, Calendar, BarChart3, Settings, Users, CreditCard } from 'lucide-react';

const ACTIONS = [
  { name: 'Add Service', icon: PlusCircle, href: '/event/services/create', color: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  { name: 'View Calendar', icon: Calendar, href: '/event/calendar', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
  { name: 'Analytics', icon: BarChart3, href: '/event/analytics', color: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
  { name: 'Customers', icon: Users, href: '/event/customers', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
  { name: 'Payments', icon: CreditCard, href: '/event/finance/payments', color: 'bg-rose-500/10 text-rose-700 border-rose-500/20' },
  { name: 'Settings', icon: Settings, href: '/event/settings', color: 'bg-gray-500/10 text-gray-700 border-gray-500/20' },
];

export default function QuickActions() {
  return (
    <div 
      data-tour="quick-actions" 
      className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
    >
      {ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
          >
            <Link 
              href={action.href}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 bg-white border border-[#E8DED5] rounded-2xl hover:border-[#6F4E37]/40 hover:shadow-md hover:-translate-y-0.5 transition-all group h-full relative overflow-hidden"
            >
              <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 shadow-2xs ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2C1810] text-center tracking-tight truncate w-full">
                {action.name}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
