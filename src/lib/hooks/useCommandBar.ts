'use client';

import { useEffect, useCallback } from 'react';
import { create } from 'zustand';

interface CommandBarState {
    isOpen: boolean;
    query: string;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setQuery: (query: string) => void;
}

export const useCommandBarStore = create<CommandBarState>((set) => ({
    isOpen: false,
    query: '',
    open: () => set({ isOpen: true, query: '' }),
    close: () => set({ isOpen: false, query: '' }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen, query: '' })),
    setQuery: (query) => set({ query }),
}));

export function useCommandBar() {
    const { isOpen, query, open, close, toggle, setQuery } = useCommandBarStore();

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // ⌘K or Ctrl+K to toggle
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggle();
            }
            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        },
        [isOpen, toggle, close]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return { isOpen, query, open, close, setQuery };
}
