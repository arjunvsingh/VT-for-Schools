'use client';

import { create } from 'zustand';
import type { InterventionType } from './intervention-store';

// ============== Types ==============

export type ActivityType = 'win' | 'alert' | 'insight' | 'action';

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: Date;
    entityType?: 'school' | 'teacher' | 'student' | 'district';
    entityId?: string;
    entityName?: string;
    isRead: boolean;
    // For alerts that need intervention
    interventionType?: InterventionType;
}

// ============== Mock Data ==============

const generateMockActivities = (): ActivityItem[] => {
    const now = new Date();

    return [
        {
            id: 'a1',
            type: 'win',
            title: '23 Students Advanced',
            description: 'Moved from Tier 3 → Tier 2 this week at Jefferson ES',
            timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 mins ago
            entityType: 'school',
            entityId: 's4',
            entityName: 'Jefferson High',
            isRead: false,
        },
        {
            id: 'a2',
            type: 'alert',
            title: 'Attendance Declining',
            description: 'Maria G. has missed 3 days this week',
            timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins ago
            entityType: 'student',
            entityId: 'st4',
            entityName: 'Marcus Williams',
            isRead: false,
            interventionType: 'parent_outreach',
        },
        {
            id: 'a3',
            type: 'insight',
            title: 'Math Scores Up 8%',
            description: 'Washington Middle showing strong improvement',
            timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
            entityType: 'school',
            entityId: 's3',
            entityName: 'Washington Middle',
            isRead: false,
        },
        {
            id: 'a4',
            type: 'action',
            title: 'Tutoring Scheduled',
            description: 'Alex Kim matched with tutor for Algebra support',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            entityType: 'student',
            entityId: 'st2',
            entityName: 'Alex Kim',
            isRead: true,
        },
        {
            id: 'a5',
            type: 'alert',
            title: 'Teacher Support Needed',
            description: 'Michael Brown flagged for classroom management review',
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
            entityType: 'teacher',
            entityId: 't6',
            entityName: 'Michael Brown',
            isRead: false,
            interventionType: 'request_bridge',
        },
        {
            id: 'a6',
            type: 'win',
            title: 'Perfect Attendance Week',
            description: 'Lincoln HS achieved 98% attendance this week',
            timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
            entityType: 'school',
            entityId: 's1',
            entityName: 'Lincoln High School',
            isRead: true,
        },
        {
            id: 'a7',
            type: 'insight',
            title: 'Reading Progress',
            description: '12 students completed reading goals ahead of schedule',
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
            entityType: 'school',
            entityId: 's2',
            entityName: 'Roosevelt Elementary',
            isRead: true,
        },
    ];
};

// ============== Store ==============

interface ActivityState {
    activities: ActivityItem[];

    // Actions
    addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;

    // Selectors
    getRecentActivities: (count?: number) => ActivityItem[];
    getUnreadCount: () => number;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
    activities: generateMockActivities(),

    addActivity: (item) => {
        const newActivity: ActivityItem = {
            ...item,
            id: `a${Date.now()}`,
            timestamp: new Date(),
            isRead: false,
        };

        set((state) => ({
            activities: [newActivity, ...state.activities],
        }));
    },

    markAsRead: (id) => {
        set((state) => ({
            activities: state.activities.map((a) =>
                a.id === id ? { ...a, isRead: true } : a
            ),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            activities: state.activities.map((a) => ({ ...a, isRead: true })),
        }));
    },

    getRecentActivities: (count = 5) => {
        return get().activities.slice(0, count);
    },

    getUnreadCount: () => {
        return get().activities.filter((a) => !a.isRead).length;
    },
}));
