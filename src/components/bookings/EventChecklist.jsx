'use client';

import { useState } from 'react';
import { ListChecks, CheckCircle2, Circle } from 'lucide-react';

const defaultTasks = [
  { id: '1', label: 'Decoration Ready', completed: false },
  { id: '2', label: 'Food Confirmed', completed: false },
  { id: '3', label: 'Photography Assigned', completed: false },
  { id: '4', label: 'DJ Assigned', completed: false },
  { id: '5', label: 'Lighting Ready', completed: false },
  { id: '6', label: 'Venue Confirmed', completed: false },
  { id: '7', label: 'Customer Confirmed', completed: false },
];

export default function EventChecklist({ bookingId, initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks?.length ? initialTasks : defaultTasks);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    // In a real scenario, trigger an API update here
  };

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
          <ListChecks className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-text tracking-tight">Event Checklist</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-bold text-text/60 w-8">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <button 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left
              ${task.completed ? 'bg-primary/5 border-primary/20 text-text' : 'bg-background/50 border-white/5 hover:border-white/20 text-text/70'}
            `}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-text/30 shrink-0" />
            )}
            <span className={`text-sm font-semibold transition-all ${task.completed ? '' : ''}`}>
              {task.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
