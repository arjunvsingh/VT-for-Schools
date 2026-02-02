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
            title: 'Reading Goal Achieved',
            description: 'Lincoln High exceeded 91% reading proficiency, beating 90% target',
            timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 mins ago
            entityType: 'school',
            entityId: 's1',
            entityName: 'Lincoln High School',
            isRead: false,
            interventionType: 'send_accolades',
        },
        {
            id: 'a2',
            type: 'alert',
            title: 'High-Risk Student Alert',
            description: 'Jayden Thompson: 8 absences this month, failing 3 classes',
            timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins ago
            entityType: 'student',
            entityId: 'st7',
            entityName: 'Jayden Thompson',
            isRead: false,
            interventionType: 'parent_outreach',
        },
        {
            id: 'a3',
            type: 'insight',
            title: 'HDT Engagement Rising',
            description: 'Lincoln High HDT participation up 10% this month',
            timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
            entityType: 'school',
            entityId: 's1',
            entityName: 'Lincoln High School',
            isRead: false,
        },
        {
            id: 'a4',
            type: 'action',
            title: 'HDT Enrollment Complete',
            description: 'Alex Kim enrolled in HDT program for Algebra II support',
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
            interventionType: 'enroll_hdt',
        },
        {
            id: 'a6',
            type: 'alert',
            title: 'Attendance Below Target',
            description: 'Roosevelt Elementary at 85% vs 92% goal - review needed',
            timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
            entityType: 'school',
            entityId: 's2',
            entityName: 'Roosevelt Elementary',
            isRead: true,
            interventionType: 'parent_outreach',
        },
        {
            id: 'a7',
            type: 'win',
            title: 'Perfect Attendance',
            description: 'Emma Johnson achieved 45 consecutive school days',
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
            entityType: 'student',
            entityId: 'st3',
            entityName: 'Emma Johnson',
            isRead: true,
            interventionType: 'send_accolades',
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
    removeActivity: (id: string) => void;

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

    removeActivity: (id) => {
        set((state) => ({
            activities: state.activities.filter((a) => a.id !== id),
        }));
    },

    getRecentActivities: (count = 5) => {
        return get().activities.slice(0, count);
    },

    getUnreadCount: () => {
        return get().activities.filter((a) => !a.isRead).length;
    },
}));
