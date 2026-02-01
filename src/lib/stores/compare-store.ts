'use client';

import { create } from 'zustand';

export interface CompareEntity {
    id: string;
    type: 'school' | 'teacher' | 'student';
    name: string;
    metrics?: Record<string, number>;
}

interface CompareState {
    entities: CompareEntity[];
    isDrawerOpen: boolean;
    maxEntities: number;

    // Actions
    addToCompare: (entity: CompareEntity) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    toggleDrawer: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;

    // Selectors
    isInCompare: (id: string) => boolean;
    canAdd: () => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
    entities: [],
    isDrawerOpen: false,
    maxEntities: 3,

    addToCompare: (entity) => {
        const { entities, maxEntities } = get();
        if (entities.length >= maxEntities || entities.some(e => e.id === entity.id)) {
            return;
        }
        set((state) => ({
            entities: [...state.entities, entity],
            isDrawerOpen: true, // Auto-open drawer when adding
        }));
    },

    removeFromCompare: (id) => {
        set((state) => {
            const newEntities = state.entities.filter(e => e.id !== id);
            return {
                entities: newEntities,
                isDrawerOpen: newEntities.length > 0 ? state.isDrawerOpen : false,
            };
        });
    },

    clearCompare: () => {
        set({ entities: [], isDrawerOpen: false });
    },

    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),

    isInCompare: (id) => get().entities.some(e => e.id === id),
    canAdd: () => get().entities.length < get().maxEntities,
}));
