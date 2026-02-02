'use client';

import { create } from 'zustand';

interface TransitionState {
    isTransitioning: boolean;
    targetUrl: string | null;
    startTransition: (url: string) => void;
    endTransition: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
    isTransitioning: false,
    targetUrl: null,

    startTransition: (url: string) => set({
        isTransitioning: true,
        targetUrl: url
    }),

    endTransition: () => set({
        isTransitioning: false,
        targetUrl: null
    }),
}));
