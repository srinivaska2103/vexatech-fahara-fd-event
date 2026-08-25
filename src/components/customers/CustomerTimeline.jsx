import { Calendar, UserPlus, CreditCard, Star, XCircle } from 'lucide-react';

export default function CustomerTimeline({ customer }) {
  if (!customer) return null;

  // Mock timeline data based on customer info
  const timelineEvents = [
    {
      id: 1,
      type: 'registration',
      title: 'Customer Registered',
      date: customer.created_at || new Date().toISOString(),
      icon: UserPlus,
      color: 'bg-blue-100 text-blue-600',
    }
  ];

  if (customer.last_booking_date) {
    timelineEvents.unshift({
      id: 2,
      type: 'booking',
      title: 'Recent Booking Placed',
      date: customer.last_booking_date,
      icon: Calendar,
      color: 'bg-primary/10 text-primary',
    });
  }
  
  if (customer.is_vip) {
    timelineEvents.unshift({
      id: 3,
      type: 'vip',
      title: 'Marked as VIP',
      date: new Date().toISOString(),
      icon: Star,
      color: 'bg-yellow-100 text-yellow-600',
    });
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 pb-4 border-b border-border">
        Activity Timeline
      </h3>
      
      <div className="relative pl-4 border-l-2 border-border/50 space-y-8 mt-4">
        {timelineEvents.map((event, idx) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="relative">
              <div className={`absolute -left-[35px] w-8 h-8 rounded-full flex items-center justify-center ${event.color} border-4 border-surface`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="bg-background border border-border rounded-xl p-4 ml-2">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-text">{event.title}</h4>
                  <span className="text-xs text-text/40">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-text/60">System generated event based on account activity.</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
