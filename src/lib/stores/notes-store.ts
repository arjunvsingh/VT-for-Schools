'use client';

import { create } from 'zustand';

export interface Note {
    id: string;
    entityType: 'school' | 'teacher' | 'student' | 'district';
    entityId: string;
    author: string;
    authorInitials: string;
    content: string;
    createdAt: string;
    pinned?: boolean;
}

// Mock notes data
const mockNotes: Note[] = [
    {
        id: 'n1',
        entityType: 'teacher',
        entityId: 't1',
        author: 'Admin Smith',
        authorInitials: 'AS',
        content: 'Excellent performance this quarter. Recommended for department lead position.',
        createdAt: '2026-01-28T10:30:00Z',
        pinned: true,
    },
    {
        id: 'n2',
        entityType: 'teacher',
        entityId: 't2',
        author: 'Principal Johnson',
        authorInitials: 'PJ',
        content: 'Discussed improvement plan. Follow-up meeting scheduled for Feb 15.',
        createdAt: '2026-01-25T14:15:00Z',
    },
    {
        id: 'n2b',
        entityType: 'teacher',
        entityId: 't2',
        author: 'Dr. Martinez',
        authorInitials: 'DM',
        content: 'Assigned mentor teacher (Sarah Carter). Weekly check-ins scheduled.',
        createdAt: '2026-01-27T16:00:00Z',
        pinned: true,
    },
    {
        id: 'n3',
        entityType: 'student',
        entityId: 'st2',
        author: 'Counselor Williams',
        authorInitials: 'CW',
        content: 'Parent meeting scheduled. Student showing signs of improvement after tutoring.',
        createdAt: '2026-01-27T09:00:00Z',
    },
    {
        id: 'n3b',
        entityType: 'student',
        entityId: 'st2',
        author: 'Ms. Rodriguez',
        authorInitials: 'MR',
        content: 'Alex is making good progress in Algebra after tutoring sessions. Continuing with 2x/week.',
        createdAt: '2026-01-29T11:30:00Z',
        pinned: true,
    },
    {
        id: 'n3c',
        entityType: 'student',
        entityId: 'st2',
        author: 'Principal Johnson',
        authorInitials: 'PJ',
        content: 'Spoke with Alex about goal-setting. Very receptive. Setting checkpoint for end of Feb.',
        createdAt: '2026-01-30T14:45:00Z',
    },
    {
        id: 'n4',
        entityType: 'school',
        entityId: 's1',
        author: 'District Admin',
        authorInitials: 'DA',
        content: 'Budget review completed. Additional funding approved for science lab.',
        createdAt: '2026-01-20T11:45:00Z',
        pinned: true,
    },
    {
        id: 'n5',
        entityType: 'student',
        entityId: 'st1',
        author: 'Ms. Carter',
        authorInitials: 'SC',
        content: 'John is exceeding expectations in AP Physics. Recommending for summer research program.',
        createdAt: '2026-01-28T08:15:00Z',
        pinned: true,
    },
    {
        id: 'n6',
        entityType: 'student',
        entityId: 'st4',
        author: 'Counselor Williams',
        authorInitials: 'CW',
        content: 'Marcus missed 3 classes this week. Reaching out to parent for check-in.',
        createdAt: '2026-01-30T10:00:00Z',
    },
    {
        id: 'n7',
        entityType: 'teacher',
        entityId: 't6',
        author: 'Principal Williams',
        authorInitials: 'PW',
        content: 'Classroom observation completed. Need to discuss classroom management strategies.',
        createdAt: '2026-01-29T15:30:00Z',
    },
];

interface NotesState {
    notes: Note[];
    isPanelOpen: boolean;
    activeEntity: { type: Note['entityType']; id: string } | null;

    // Actions
    addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
    deleteNote: (id: string) => void;
    togglePin: (id: string) => void;
    openPanel: (entityType: Note['entityType'], entityId: string) => void;
    closePanel: () => void;

    // Selectors
    getNotesForEntity: (entityType: Note['entityType'], entityId: string) => Note[];
}

export const useNotesStore = create<NotesState>((set, get) => ({
    notes: mockNotes,
    isPanelOpen: false,
    activeEntity: null,

    addNote: (noteData) => {
        const note: Note = {
            ...noteData,
            id: `n_${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [note, ...state.notes] }));
    },

    deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
    },

    togglePin: (id) => {
        set((state) => ({
            notes: state.notes.map(n =>
                n.id === id ? { ...n, pinned: !n.pinned } : n
            ),
        }));
    },

    openPanel: (entityType, entityId) => {
        set({ isPanelOpen: true, activeEntity: { type: entityType, id: entityId } });
    },

    closePanel: () => {
        set({ isPanelOpen: false, activeEntity: null });
    },

    getNotesForEntity: (entityType, entityId) => {
        const notes = get().notes.filter(
            n => n.entityType === entityType && n.entityId === entityId
        );
        // Sort: pinned first, then by date
        return notes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    },
}));
