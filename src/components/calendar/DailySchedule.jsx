import { useCalendarStore } from '@/store/useCalendarStore';
import { format } from 'date-fns';

export default function DailySchedule({ events = [] }) {
  const { currentDate, view } = useCalendarStore();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (view === 'agenda') {
    return (
      <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto p-6">
        <h3 className="text-xl font-bold text-text mb-6 pb-2 border-b border-border">
          Agenda for {format(currentDate, 'MMMM d, yyyy')}
        </h3>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text/50">
            <p className="text-lg font-semibold">No events scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, i) => (
              <div key={i} className="p-4 bg-background border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors">
                <div className="font-bold text-text">{event.title}</div>
                <div className="text-sm text-text/70">{event.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-surface overflow-y-auto">
      <div className="flex min-w-max relative pt-4">
        <div className="w-20 shrink-0 border-r border-border bg-surface sticky left-0 z-10">
          {hours.map(hour => (
            <div key={hour} className="h-24 border-b border-border relative text-right pr-4">
              <span className="text-sm font-semibold text-text/50 absolute -top-3 right-4 bg-surface px-1">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex-1 flex w-full relative">
          <div className="flex-1 border-r border-border relative">
            {hours.map(hour => (
              <div key={hour} className="h-24 border-b border-border border-dashed hover:bg-background/30 transition-colors relative">
                {/* Half hour line */}
                <div className="absolute top-1/2 left-0 right-0 border-b border-border border-dotted w-full opacity-50"></div>
              </div>
            ))}
            {/* Events would be absolutely positioned here */}
          </div>
        </div>
      </div>
    </div>
  );
}
