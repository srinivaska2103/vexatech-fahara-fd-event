import { Clock, Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewTimeline({ review }) {
  if (!review) return null;

  const timeline = [
    {
      id: 1,
      title: 'Review Submitted',
      description: 'Customer posted this review.',
      date: review.created_at || new Date().toISOString(),
      icon: Send,
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  if (review.status === 'FLAGGED') {
    timeline.push({
      id: 2,
      title: 'Review Flagged',
      description: 'Marked for internal moderation.',
      date: review.updated_at || new Date().toISOString(),
      icon: Clock,
      color: 'bg-red-100 text-red-600'
    });
  }

  if (review.reply_text) {
    timeline.push({
      id: 3,
      title: 'Manager Replied',
      description: 'A public response was posted.',
      date: review.replied_at || new Date().toISOString(),
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600'
    });
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 pb-4 border-b border-border">
        Review Timeline
      </h3>
      
      <div className="relative pl-4 border-l-2 border-border/50 space-y-8 mt-4">
        {timeline.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="relative">
              <div className={`absolute -left-[35px] w-8 h-8 rounded-full flex items-center justify-center ${event.color} border-4 border-surface`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="ml-2">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-text">{event.title}</h4>
                </div>
                <p className="text-xs text-text/60 mb-1">{event.description}</p>
                <span className="text-[10px] font-bold text-text/40 uppercase">
                  {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
