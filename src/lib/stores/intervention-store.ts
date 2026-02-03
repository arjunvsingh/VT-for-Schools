'use client';

import { create } from 'zustand';

// ============== Types ==============

export type InterventionType =
    | 'request_bridge'
    | 'schedule_meeting'
    | 'send_email'
    | 'approve_budget'
    | 'flag_for_review'
    | 'assign_mentor'
    | 'schedule_tutoring'
    | 'enroll_hdt'
    | 'parent_outreach'
    | 'send_accolades'
    | 'schedule_call';

export type InterventionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Intervention {
    id: string;
    type: InterventionType;
    entityType: 'school' | 'teacher' | 'student' | 'district';
    entityId: string;
    entityName: string;
    status: InterventionStatus;
    createdAt: string;
    completedAt?: string;
    notes?: string;
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message?: string;
    duration?: number;
}

// ============== Intervention Labels ==============

export const interventionLabels: Record<InterventionType, { label: string; icon: string; description: string }> = {
    request_bridge: {
        label: 'Request Bridge',
        icon: '🌉',
        description: 'Request additional support resources',
    },
    schedule_meeting: {
        label: 'Schedule Meeting',
        icon: '📅',
        description: 'Set up a meeting with stakeholders',
    },
    send_email: {
        label: 'Send Email',
        icon: '✉️',
        description: 'Send notification email',
    },
    approve_budget: {
        label: 'Approve Budget',
        icon: '💰',
        description: 'Approve pending budget request',
    },
    flag_for_review: {
        label: 'Flag for Review',
        icon: '🚩',
        description: 'Mark for administrative review',
    },
    assign_mentor: {
        label: 'Assign Mentor',
        icon: '👥',
        description: 'Pair with a mentor teacher',
    },
    schedule_tutoring: {
        label: 'Schedule Tutoring',
        icon: '📚',
        description: 'Set up tutoring sessions for the student',
    },
    enroll_hdt: {
        label: 'Enroll in HDT',
        icon: '🎯',
        description: 'Enroll in High Dosage Tutoring (3-4x weekly, small group)',
    },
    parent_outreach: {
        label: 'Contact Parent',
        icon: '📞',
        description: 'Initiate parent/guardian communication',
    },
    send_accolades: {
        label: 'Send Accolades',
        icon: '🏆',
        description: 'Send official recognition for achievement',
    },
    schedule_call: {
        label: 'Schedule Call',
        icon: '📞',
        description: 'Schedule a phone call',
    },
};

// ============== Store ==============

interface InterventionState {
    interventions: Intervention[];
    toasts: Toast[];

    // Actions
    triggerIntervention: (
        type: InterventionType,
        entityType: Intervention['entityType'],
        entityId: string,
        entityName: string
    ) => void;
    completeIntervention: (id: string) => void;
    cancelIntervention: (id: string) => void;

    // Selectors
    getInterventionsForEntity: (entityType: string, entityId: string) => Intervention[];
    getPendingInterventions: () => Intervention[];

    // Toast Actions
    showToast: (toast: Omit<Toast, 'id'>) => void;
    dismissToast: (id: string) => void;
}

export const useInterventionStore = create<InterventionState>((set, get) => ({
    interventions: [],
    toasts: [],

    triggerIntervention: (type, entityType, entityId, entityName) => {
        const id = `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const intervention: Intervention = {
            id,
            type,
            entityType,
            entityId,
            entityName,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        set((state) => ({
            interventions: [intervention, ...state.interventions],
        }));

        // Show success toast
        const info = interventionLabels[type];
        get().showToast({
            type: 'success',
            title: `${info.icon} ${info.label}`,
            message: `Action initiated for ${entityName}`,
            duration: 4000,
        });

        // Simulate completion after 2 seconds (in real app, this would be an API call)
        setTimeout(() => {
            get().completeIntervention(id);
        }, 2000);
    },

    completeIntervention: (id) => {
        set((state) => ({
            interventions: state.interventions.map((i) =>
                i.id === id
                    ? { ...i, status: 'completed' as InterventionStatus, completedAt: new Date().toISOString() }
                    : i
            ),
        }));
    },

    cancelIntervention: (id) => {
        set((state) => ({
            interventions: state.interventions.map((i) =>
                i.id === id ? { ...i, status: 'cancelled' as InterventionStatus } : i
            ),
        }));
    },

    getInterventionsForEntity: (entityType, entityId) => {
        return get().interventions.filter(
            (i) => i.entityType === entityType && i.entityId === entityId
        );
    },

    getPendingInterventions: () => {
        return get().interventions.filter((i) => i.status === 'pending' || i.status === 'in_progress');
    },

    showToast: (toast) => {
        const id = `toast_${Date.now()}`;
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto-dismiss
        const duration = toast.duration ?? 3000;
        setTimeout(() => {
            get().dismissToast(id);
        }, duration);
    },

    dismissToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },
}));
