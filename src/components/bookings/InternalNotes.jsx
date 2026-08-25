'use client';

import { useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2 } from 'lucide-react';

export default function InternalNotes({ bookingId, initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      content: newNote,
      created_at: new Date().toISOString(),
      author: 'You'
    };
    setNotes([note, ...notes]);
    setNewNote('');
    setIsAdding(false);
    // In a real app, send to API here
  };

  const handleDelete = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner border border-white/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text tracking-tight">Internal Notes</h2>
            <p className="text-sm text-text/60 mt-0.5">Private team notes</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 max-h-[400px]">
        {isAdding && (
          <div className="bg-background/80 rounded-2xl p-4 border border-primary/20">
            <textarea
              autoFocus
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full bg-transparent border-none resize-none focus:ring-0 text-sm p-0 mb-3"
              placeholder="Type your note here..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs font-bold text-text/60 hover:text-text hover:bg-surface rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddNote}
                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        )}

        {notes.length === 0 && !isAdding ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <MessageSquare className="w-8 h-8 text-text/20 mb-3" />
            <p className="text-sm font-semibold text-text/60">No internal notes yet.</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-background/50 rounded-2xl p-4 border border-white/5 relative group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-primary">{note.author}</span>
                <span className="text-[10px] font-semibold text-text/40">
                  {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-text/80 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => handleDelete(note.id)}
                  className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
