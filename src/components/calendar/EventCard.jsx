export default function EventCard({ event, onClick }) {
  return (
    <div 
      onClick={() => onClick && onClick(event)}
      className="bg-accent/20 border border-accent/40 rounded-lg p-2 text-xs text-text cursor-pointer hover:bg-accent/30 transition-colors"
    >
      <div className="font-bold truncate">{event.title || 'Event'}</div>
      <div className="opacity-70 truncate">{event.customer || 'Unknown Customer'}</div>
      <div className="mt-1 font-semibold flex items-center justify-between">
        <span>{event.time || '10:00 AM'}</span>
        <span className="w-2 h-2 rounded-full bg-primary"></span>
      </div>
    </div>
  );
}
