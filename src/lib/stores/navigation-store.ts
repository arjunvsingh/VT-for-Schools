'use client';

import { create } from 'zustand';

interface NavigationState {
    // Track breadcrumb-style navigation history
    history: {
        path: string;
        label: string;
    }[];

    // Current context for back navigation
    currentDistrictId: string | null;
    currentSchoolId: string | null;

    // Actions
    setCurrentDistrict: (id: string) => void;
    setCurrentSchool: (id: string) => void;
    pushHistory: (path: string, label: string) => void;
    getBackPath: () => string;
    clearHistory: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
    history: [],
    currentDistrictId: null,
    currentSchoolId: null,

    setCurrentDistrict: (id: string) => set({ currentDistrictId: id }),

    setCurrentSchool: (id: string) => set({ currentSchoolId: id }),

    pushHistory: (path: string, label: string) => set((state) => ({
        history: [...state.history, { path, label }]
    })),

    getBackPath: () => {
        const { history } = get();
        if (history.length > 1) {
            return history[history.length - 2].path;
        }
        return '/';
    },

    clearHistory: () => set({ history: [], currentDistrictId: null, currentSchoolId: null })
}));
