'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotesStore, Note } from '@/lib/stores/notes-store';
import { X, MessageSquare, Pin, Trash2, Send, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CurvedMenuPath } from './CurvedMenuPath';

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

interface NoteItemProps {
    note: Note;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
}

function NoteItem({ note, onDelete, onTogglePin }: NoteItemProps) {
    const [showActions, setShowActions] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn(
                "p-3 rounded-lg border transition-all",
                note.pinned
                    ? "bg-acid-lime/5 border-acid-lime/20"
                    : "bg-white/5 border-white/10"
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start gap-3">
                {/* Author Avatar */}
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-200 text-xs font-bold shrink-0">
                    {note.authorInitials}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{note.author}</span>
                            {note.pinned && (
                                <Pin className="w-3 h-3 text-acid-lime fill-acid-lime" />
                            )}
                        </div>
                        <span className="text-xs text-off-white/40">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-sm text-off-white/80 mt-1">{note.content}</p>

                    {/* Actions */}
                    <AnimatePresence>
                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5"
                            >
                                <button
                                    onClick={() => onTogglePin(note.id)}
                                    className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                                        note.pinned
                                            ? "text-acid-lime hover:bg-acid-lime/10"
                                            : "text-off-white/40 hover:text-off-white hover:bg-white/5"
                                    )}
                                >
                                    <Pin className="w-3 h-3" />
                                    {note.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                    onClick={() => onDelete(note.id)}
                                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

export function NotesPanel() {
    const { isPanelOpen, activeEntity, closePanel, notes, addNote, deleteNote, togglePin, getNotesForEntity } = useNotesStore();
    const [newNote, setNewNote] = useState('');
    const [windowHeight, setWindowHeight] = useState(0);

    // Track window height for SVG curve
    useEffect(() => {
        const updateHeight = () => setWindowHeight(window.innerHeight);
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    if (!isPanelOpen || !activeEntity) return null;

    const entityNotes = getNotesForEntity(activeEntity.type, activeEntity.id);

    const handleSubmit = () => {
        if (!newNote.trim()) return;

        addNote({
            entityType: activeEntity.type,
            entityId: activeEntity.id,
            author: 'Current Admin',
            authorInitials: 'CA',
            content: newNote.trim(),
        });

        setNewNote('');
    };

    return (
        <AnimatePresence>
            {/* Backdrop overlay */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={closePanel}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[139]"
            />

            {/* Drawer with curved edge */}
            <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-warm-charcoal z-[140] flex flex-col"
            >
                {/* Curved SVG Path */}
                {windowHeight > 0 && (
                    <CurvedMenuPath height={windowHeight} color="#1C1917" />
                )}

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-bold">Notes</h2>
                        <span className="text-xs text-off-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                            {entityNotes.length}
                        </span>
                    </div>
                    <button
                        onClick={closePanel}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {entityNotes.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-off-white/20 mx-auto mb-3" />
                            <p className="text-off-white/40">No notes yet</p>
                            <p className="text-xs text-off-white/20 mt-1">Add a note to track activity</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {entityNotes.map((note) => (
                                <NoteItem
                                    key={note.id}
                                    note={note}
                                    onDelete={deleteNote}
                                    onTogglePin={togglePin}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Add Note Input */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="Add a note..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-acid-lime/50 transition-colors"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!newNote.trim()}
                            className="p-2 bg-acid-lime text-stone-black rounded-lg hover:bg-acid-lime/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// Button to open notes panel
interface NotesButtonProps {
    entityType: Note['entityType'];
    entityId: string;
    className?: string;
}

export function NotesButton({ entityType, entityId, className }: NotesButtonProps) {
    const { openPanel, getNotesForEntity } = useNotesStore();
    const noteCount = getNotesForEntity(entityType, entityId).length;

    return (
        <button
            onClick={() => openPanel(entityType, entityId)}
            className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all text-sm",
                className
            )}
        >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Notes</span>
            {noteCount > 0 && (
                <span className="bg-cyan-400/20 text-cyan-200 text-xs px-1.5 py-0.5 rounded-full">
                    {noteCount}
                </span>
            )}
        </button>
    );
}
