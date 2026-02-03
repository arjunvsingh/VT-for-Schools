'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { AppScrollArea } from '@/components/ui/scroll-area';
import {
    InterventionType,
    interventionLabels,
    useInterventionStore,
} from '@/lib/stores/intervention-store';

export interface ActionModalContext {
    entityName: string;
    entityType: 'school' | 'teacher' | 'student' | 'district';
    entityId: string;
    // Optional context for pre-populating
    riskFactor?: string;
    metric?: string;
    trend?: string;
    suggestedAction?: string;
    issue?: string;
    severity?: string;
    subject?: string;
    performance?: string;
}

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: InterventionType;
    context: ActionModalContext;
    onComplete?: () => void;
}

function generateContent(type: InterventionType, ctx: ActionModalContext): { subject: string; body: string } {
    switch (type) {
        case 'parent_outreach':
            return {
                subject: `Regarding ${ctx.entityName}'s Academic Progress`,
                body: `Dear Parent/Guardian,

We'd like to discuss ${ctx.entityName}'s recent academic progress.${ctx.riskFactor ? ` We've noticed concerns regarding ${ctx.riskFactor.toLowerCase()}.` : ''}${ctx.metric ? ` Their current metrics show: ${ctx.metric}.` : ''}${ctx.trend ? ` The trend has been ${ctx.trend}.` : ''}

${ctx.suggestedAction ? `Our recommendation: ${ctx.suggestedAction}.` : 'We believe early intervention can make a meaningful difference.'}

We'd love to schedule a time to discuss next steps together. Please let us know your availability.

Warm regards,
Dr. Sarah Chen
District Administrator`,
            };

        case 'send_accolades':
            return {
                subject: `Recognition for ${ctx.entityName}`,
                body: `We are pleased to recognize ${ctx.entityName} for their outstanding ${ctx.entityType === 'student' ? 'academic achievement' : 'professional performance'}.

${ctx.performance ? `Current performance: ${ctx.performance}.` : 'Their consistent dedication and hard work have not gone unnoticed.'}

${ctx.entityType === 'teacher'
    ? 'Your commitment to your students and the school community is truly commendable. Thank you for going above and beyond.'
    : 'Keep up the excellent work! We are proud of your accomplishments and look forward to seeing your continued growth.'}

Congratulations!

Dr. Sarah Chen
District Administrator`,
            };

        case 'enroll_hdt':
            return {
                subject: `HDT Enrollment — ${ctx.entityName}`,
                body: `High-Dosage Tutoring (HDT) Enrollment Request

Student: ${ctx.entityName}
${ctx.subject ? `Subject: ${ctx.subject}` : 'Subject: Mathematics'}
${ctx.performance ? `Current Performance: ${ctx.performance}` : ''}
${ctx.riskFactor ? `Reason: ${ctx.riskFactor}` : 'Reason: Below proficiency threshold'}

Recommended Schedule: 3x per week, 45-minute sessions
Program Duration: 8 weeks (with progress review at week 4)
Format: Small group (3-4 students)

${ctx.suggestedAction ? `Additional Notes: ${ctx.suggestedAction}` : 'Please review and approve this enrollment request.'}`,
            };

        case 'request_bridge':
            return {
                subject: `Bridge Support Request — ${ctx.entityName}`,
                body: `Bridge Request for ${ctx.entityName}

${ctx.issue ? `Performance Area: ${ctx.issue}` : 'Performance Area: Requires additional support'}
${ctx.severity ? `Severity: ${ctx.severity.charAt(0).toUpperCase() + ctx.severity.slice(1)}` : 'Severity: Medium'}
${ctx.riskFactor ? `Details: ${ctx.riskFactor}` : ''}

Recommended Support:
• Peer mentorship and coaching sessions (2x/week)
• Classroom observation and feedback cycle
• Resource allocation for professional development
• Monthly progress check-ins with administration

This request is based on recent performance data and aims to provide proactive support before issues escalate.

Please review and authorize the bridge support resources.`,
            };

        case 'send_email': {
            const subjectNote = ctx.subject ? " in " + ctx.subject : "";
            const issueNote = ctx.issue
                ? "Specifically, I would like to discuss " + ctx.issue + "."
                : "I would like to touch base on a few items.";
            return {
                subject: `Message for ${ctx.entityName}`,
                body: `Dear ${ctx.entityName},

I hope this message finds you well. I wanted to reach out regarding your work${subjectNote}.

${issueNote}

Please let me know if you have any questions or if there is anything you need from the administration.

Best regards,
Dr. Sarah Chen
District Administrator`,
            };
        }

        case 'schedule_call': {
            const topic = ctx.issue ? "Topic: " + ctx.issue : "Topic: General check-in";
            const contextLine = ctx.riskFactor ? "Context: " + ctx.riskFactor + "\n\n" : "";
            return {
                subject: `Call Request — ${ctx.entityName}`,
                body: `Phone Call Request

Participant: ${ctx.entityName}
${topic}
Urgency: Routine

Preferred Times:
- Morning (9:00 AM - 11:00 AM)
- Afternoon (1:00 PM - 3:00 PM)

${contextLine}Please confirm your availability and we will send a calendar invitation.

Dr. Sarah Chen
District Administrator`,
            };
        }

        default:
            return {
                subject: `${interventionLabels[type]?.label ?? 'Action'} — ${ctx.entityName}`,
                body: `Action requested for ${ctx.entityName}.\n\nPlease review and confirm.`,
            };
    }
}

export function ActionModal({ isOpen, onClose, type, context, onComplete }: ActionModalProps) {
    const info = interventionLabels[type];
    const triggerIntervention = useInterventionStore((s) => s.triggerIntervention);
    const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent'>('idle');

    const generated = generateContent(type, context);
    const [subject, setSubject] = useState(generated.subject);
    const [body, setBody] = useState(generated.body);

    // Reset state when modal opens with new content
    const handleSend = () => {
        if (sendState !== 'idle') return;
        setSendState('sending');

        triggerIntervention(type, context.entityType, context.entityId, context.entityName);

        setTimeout(() => {
            setSendState('sent');
            setTimeout(() => {
                onComplete?.();
                onClose();
                // Reset for next use
                setSendState('idle');
            }, 1000);
        }, 800);
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-stone-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{info.icon}</span>
                                <div>
                                    <h2 className="text-base font-medium text-off-white">{info.label}</h2>
                                    <p className="text-xs text-off-white/40">{info.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-off-white/40" />
                            </button>
                        </div>

                        {/* Body */}
                        <AppScrollArea className="max-h-[60vh]">
                            <div className="px-6 py-4 flex flex-col gap-4">
                                {/* Subject */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-off-white/30 font-medium mb-1 block">Subject</label>
                                    <input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-off-white focus:outline-none focus:border-acid-lime/50 transition-colors"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-off-white/30 font-medium mb-1 block">Message</label>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        rows={12}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-off-white leading-relaxed focus:outline-none focus:border-acid-lime/50 transition-colors resize-none"
                                    />
                                </div>

                                {/* Recipient Tag */}
                                <div className="flex items-center gap-2 text-xs text-off-white/40">
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5">
                                        {context.entityType}: {context.entityName}
                                    </span>
                                </div>
                            </div>
                        </AppScrollArea>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-off-white/60 hover:text-off-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <motion.button
                                onClick={handleSend}
                                disabled={sendState !== 'idle'}
                                whileHover={{ scale: sendState === 'idle' ? 1.02 : 1 }}
                                whileTap={{ scale: sendState === 'idle' ? 0.98 : 1 }}
                                className={cn(
                                    'flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all',
                                    sendState === 'sent'
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-acid-lime text-stone-black hover:bg-acid-lime/90'
                                )}
                            >
                                {sendState === 'sending' ? (
                                    <>
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                            <Loader2 className="w-4 h-4" />
                                        </motion.div>
                                        Sending...
                                    </>
                                ) : sendState === 'sent' ? (
                                    <>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                        Sent!
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

// Modal-enabled action types
export const MODAL_ACTION_TYPES: InterventionType[] = [
    'parent_outreach',
    'send_accolades',
    'enroll_hdt',
    'request_bridge',
    'send_email',
    'schedule_call',
];
