'use client';

import { create } from 'zustand';

export interface Goal {
    id: string;
    title: string;
    description?: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
    category: 'attendance' | 'performance' | 'enrollment' | 'budget' | 'other';
    status: 'on-track' | 'at-risk' | 'achieved';
}

// Mock goals data
const mockGoals: Goal[] = [
    {
        id: 'g1',
        title: 'District Attendance',
        description: 'Achieve 95% average attendance by end of year',
        target: 95,
        current: 92,
        unit: '%',
        deadline: '2026-06-30',
        category: 'attendance',
        status: 'on-track',
    },
    {
        id: 'g2',
        title: 'Math Proficiency',
        description: 'Improve district-wide math proficiency scores',
        target: 85,
        current: 78,
        unit: '%',
        deadline: '2026-06-30',
        category: 'performance',
        status: 'at-risk',
    },
    {
        id: 'g3',
        title: 'Teacher Retention',
        description: 'Maintain high teacher retention rate',
        target: 90,
        current: 88,
        unit: '%',
        deadline: '2026-06-30',
        category: 'other',
        status: 'on-track',
    },
    {
        id: 'g4',
        title: 'Zero Critical Alerts',
        description: 'Resolve all critical school alerts',
        target: 0,
        current: 3,
        unit: ' alerts',
        deadline: '2026-03-31',
        category: 'other',
        status: 'at-risk',
    },
];

interface GoalsState {
    goals: Goal[];

    // Selectors
    getGoal: (id: string) => Goal | undefined;
    getGoalsByCategory: (category: Goal['category']) => Goal[];
    getGoalsAtRisk: () => Goal[];
    getGoalsAchieved: () => Goal[];

    // Actions
    updateProgress: (id: string, current: number) => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
    goals: mockGoals,

    getGoal: (id) => get().goals.find(g => g.id === id),

    getGoalsByCategory: (category) => get().goals.filter(g => g.category === category),

    getGoalsAtRisk: () => get().goals.filter(g => g.status === 'at-risk'),

    getGoalsAchieved: () => get().goals.filter(g => g.status === 'achieved'),

    updateProgress: (id, current) => {
        set((state) => ({
            goals: state.goals.map(g => {
                if (g.id !== id) return g;
                const newStatus: Goal['status'] =
                    current >= g.target ? 'achieved' :
                        (current / g.target) < 0.8 ? 'at-risk' : 'on-track';
                return { ...g, current, status: newStatus };
            }),
        }));
    },
}));
