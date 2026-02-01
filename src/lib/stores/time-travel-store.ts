'use client';

import { create } from 'zustand';

// Historical data snapshots by month
export interface HistoricalSnapshot {
    date: string; // YYYY-MM format
    performance: number;
    attendance: number;
    enrollment: number;
    alerts: number;
}

// Mock historical data for schools/districts
const historicalData: Record<string, HistoricalSnapshot[]> = {
    's1': [
        { date: '2025-06', performance: 85, attendance: 91, enrollment: 1180, alerts: 5 },
        { date: '2025-07', performance: 86, attendance: 91, enrollment: 1190, alerts: 4 },
        { date: '2025-08', performance: 87, attendance: 92, enrollment: 1200, alerts: 4 },
        { date: '2025-09', performance: 88, attendance: 92, enrollment: 1210, alerts: 3 },
        { date: '2025-10', performance: 89, attendance: 93, enrollment: 1220, alerts: 3 },
        { date: '2025-11', performance: 90, attendance: 93, enrollment: 1230, alerts: 2 },
        { date: '2025-12', performance: 91, attendance: 94, enrollment: 1235, alerts: 2 },
        { date: '2026-01', performance: 92, attendance: 94, enrollment: 1240, alerts: 1 },
    ],
    's2': [
        { date: '2025-06', performance: 72, attendance: 84, enrollment: 820, alerts: 8 },
        { date: '2025-07', performance: 73, attendance: 85, enrollment: 825, alerts: 7 },
        { date: '2025-08', performance: 74, attendance: 85, enrollment: 830, alerts: 7 },
        { date: '2025-09', performance: 75, attendance: 86, enrollment: 835, alerts: 6 },
        { date: '2025-10', performance: 76, attendance: 87, enrollment: 840, alerts: 6 },
        { date: '2025-11', performance: 77, attendance: 87, enrollment: 845, alerts: 5 },
        { date: '2025-12', performance: 77, attendance: 88, enrollment: 848, alerts: 5 },
        { date: '2026-01', performance: 78, attendance: 88, enrollment: 850, alerts: 4 },
    ],
    'district-1': [
        { date: '2025-06', performance: 82, attendance: 88, enrollment: 4800, alerts: 12 },
        { date: '2025-07', performance: 83, attendance: 89, enrollment: 4900, alerts: 10 },
        { date: '2025-08', performance: 84, attendance: 89, enrollment: 5000, alerts: 9 },
        { date: '2025-09', performance: 85, attendance: 90, enrollment: 5050, alerts: 8 },
        { date: '2025-10', performance: 86, attendance: 90, enrollment: 5100, alerts: 7 },
        { date: '2025-11', performance: 87, attendance: 91, enrollment: 5150, alerts: 5 },
        { date: '2025-12', performance: 87, attendance: 91, enrollment: 5170, alerts: 4 },
        { date: '2026-01', performance: 88, attendance: 92, enrollment: 5190, alerts: 3 },
    ],
};

const availableDates = [
    '2025-06', '2025-07', '2025-08', '2025-09',
    '2025-10', '2025-11', '2025-12', '2026-01'
];

interface TimeTravelState {
    currentDate: string;
    isPlaying: boolean;
    availableDates: string[];

    // Actions
    setDate: (date: string) => void;
    play: () => void;
    pause: () => void;
    nextDate: () => void;
    prevDate: () => void;

    // Selectors
    getDataForDate: (entityId: string, date?: string) => HistoricalSnapshot | null;
    getDateIndex: () => number;
}

export const useTimeTravelStore = create<TimeTravelState>((set, get) => ({
    currentDate: '2026-01', // Default to current
    isPlaying: false,
    availableDates,

    setDate: (date) => set({ currentDate: date }),

    play: () => {
        set({ isPlaying: true });
    },

    pause: () => set({ isPlaying: false }),

    nextDate: () => {
        const { currentDate, availableDates } = get();
        const idx = availableDates.indexOf(currentDate);
        if (idx < availableDates.length - 1) {
            set({ currentDate: availableDates[idx + 1] });
        } else {
            set({ isPlaying: false }); // Stop at end
        }
    },

    prevDate: () => {
        const { currentDate, availableDates } = get();
        const idx = availableDates.indexOf(currentDate);
        if (idx > 0) {
            set({ currentDate: availableDates[idx - 1] });
        }
    },

    getDataForDate: (entityId, date) => {
        const targetDate = date || get().currentDate;
        const entityData = historicalData[entityId];
        if (!entityData) return null;
        return entityData.find(d => d.date === targetDate) || null;
    },

    getDateIndex: () => {
        const { currentDate, availableDates } = get();
        return availableDates.indexOf(currentDate);
    },
}));
