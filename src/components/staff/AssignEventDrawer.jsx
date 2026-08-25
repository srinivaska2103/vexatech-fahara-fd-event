import { useState } from 'react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';

export default function AssignEventDrawer({ isOpen, onClose, staff }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!isOpen || !staff) return null;

  // Mock list of events since we don't have the backend API for unassigned events yet
  const MOCK_EVENTS = [
    { id: 1, title: 'Summer Wedding', date: '2026-08-15', location: 'Grand Plaza', time: '10:00 AM - 6:00 PM' },
    { id: 2, title: 'Corporate Gala', date: '2026-08-20', location: 'Downtown Convention Center', time: '5:00 PM - 11:00 PM' },
  ];

  const handleAssign = () => {
    // In a real scenario, call a mutation here: useAssignStaffMutation
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">Assign Event</h2>
            <p className="text-sm text-text/50">To: {staff.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors text-text/50 hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-bold text-text mb-4 uppercase tracking-wider">Upcoming Events</h3>
          
          <div className="space-y-3">
            {MOCK_EVENTS.map(event => (
              <div 
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedEvent === event.id ? 'bg-primary/5 border-primary' : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <div className="font-bold text-text mb-2">{event.title}</div>
                <div className="flex flex-col gap-1 text-xs text-text/70">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {event.date}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {event.time}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {event.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-border bg-background flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-sm text-text hover:bg-surface rounded-xl transition-colors border border-border">
            Cancel
          </button>
          <button 
            onClick={handleAssign}
            disabled={!selectedEvent}
            className="px-6 py-2 font-bold text-sm text-white bg-primary hover:bg-secondary rounded-xl transition-colors disabled:opacity-50"
          >
            Assign Event
          </button>
        </div>
      </div>
    </>
  );
}
