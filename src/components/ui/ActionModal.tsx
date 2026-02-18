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
    const metricLine = ctx.metric ? `Current: ${ctx.metric}` : '';
    const trendLine = ctx.trend ? `Trend: ${ctx.trend}` : '';
    const severityLabel = ctx.severity ? ctx.severity.charAt(0).toUpperCase() + ctx.severity.slice(1) : '';

    switch (type) {
        case 'parent_outreach': {
            const dataPoints: string[] = [];
            if (ctx.riskFactor) dataPoints.push(`• ${ctx.riskFactor}`);
            if (ctx.metric) dataPoints.push(`• Current metrics: ${ctx.metric}`);
            if (ctx.trend) dataPoints.push(`• Trend: ${ctx.trend}`);
            if (ctx.subject) dataPoints.push(`• Subject area: ${ctx.subject}`);
            const dataSection = dataPoints.length > 0
                ? `Here is a summary of what our data shows:\n\n${dataPoints.join('\n')}`
                : 'We have identified some areas where additional support could be beneficial.';

            return {
                subject: `Regarding ${ctx.entityName}'s Academic Progress — Action Requested`,
                body: `Dear Parent/Guardian of ${ctx.entityName},

Thank you for your partnership in ${ctx.entityName}'s education. We are reaching out because our monitoring system has identified concerns that we would like to address together.

${dataSection}

${ctx.suggestedAction ? `RECOMMENDED NEXT STEP\n${ctx.suggestedAction}` : 'We believe early, collaborative intervention makes a meaningful difference and we want to work with you on a plan.'}

We would like to schedule a 20-minute conversation at your convenience. Available times:
• Weekday mornings: 8:00 – 9:00 AM
• Weekday afternoons: 3:30 – 5:00 PM
• Friday virtual office hours: 12:00 – 1:00 PM

Please reply to this message or call the front office at (555) 234-5678 to confirm a time.

Warm regards,
Dr. Sarah Chen
District Administrator
Central Valley Unified School District`,
            };
        }

        case 'send_accolades': {
            const achievementDetails: string[] = [];
            if (ctx.performance) achievementDetails.push(ctx.performance);
            if (ctx.subject) achievementDetails.push(`Outstanding work in ${ctx.subject}`);
            if (ctx.metric) achievementDetails.push(`Key metric: ${ctx.metric}`);
            const achievementSection = achievementDetails.length > 0
                ? `HIGHLIGHTED ACHIEVEMENTS\n${achievementDetails.map(a => `• ${a}`).join('\n')}`
                : 'Their consistent dedication and hard work have not gone unnoticed.';

            return {
                subject: `Official Recognition — ${ctx.entityName}`,
                body: `Dear ${ctx.entityName},

On behalf of the Central Valley Unified School District, we are delighted to formally recognize your exceptional ${ctx.entityType === 'student' ? 'academic achievement' : 'professional contributions'}.

${achievementSection}

${ctx.entityType === 'teacher'
                        ? 'Your commitment to your students is evident in the data — and more importantly, in the lives you are shaping. The district is fortunate to have educators of your caliber, and we want you to know that your efforts are seen and deeply valued.'
                        : 'Your hard work is paying off and we want you to know that your teachers, your school, and the entire district are proud of what you have accomplished. Keep reaching for excellence — we are here to support you every step of the way.'}

This recognition will be added to your permanent record and shared during our next district assembly.

With admiration,
Dr. Sarah Chen
District Administrator
Central Valley Unified School District`,
            };
        }

        case 'enroll_hdt': {
            const diagnosticLines: string[] = [];
            if (ctx.riskFactor) diagnosticLines.push(`Identified Gap: ${ctx.riskFactor}`);
            if (ctx.metric) diagnosticLines.push(`Assessment Data: ${ctx.metric}`);
            if (ctx.trend) diagnosticLines.push(`Performance Trend: ${ctx.trend}`);
            const diagnosticSection = diagnosticLines.length > 0
                ? diagnosticLines.join('\n')
                : 'Below proficiency threshold based on most recent assessment data';

            return {
                subject: `HDT Enrollment Request — ${ctx.entityName}`,
                body: `HIGH-DOSAGE TUTORING (HDT) ENROLLMENT REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STUDENT INFORMATION
Student: ${ctx.entityName}
${ctx.subject ? `Target Subject: ${ctx.subject}` : 'Target Subject: Mathematics'}

DIAGNOSTIC JUSTIFICATION
${diagnosticSection}

RECOMMENDED PROGRAM
• Schedule: 3 sessions per week, 45 minutes each
• Duration: 8 weeks (progress review at week 4)
• Format: Small group (3–4 students with similar skill gaps)
• Tutor Match: Specialist with experience in identified gap area

EXPECTED OUTCOMES
Based on district HDT data, students with similar profiles show:
• Average improvement of 12–18 percentile points after 8 weeks
• 73% of enrolled students reach proficiency threshold by program end
• Strongest gains when combined with classroom teacher coordination

${ctx.suggestedAction ? `ADDITIONAL NOTES\n${ctx.suggestedAction}` : ''}

APPROVAL REQUIRED
Please review and approve this enrollment. Parent notification will be sent upon approval.

Submitted by: Dr. Sarah Chen, District Administrator`,
            };
        }

        case 'request_bridge': {
            const concernLines: string[] = [];
            if (ctx.issue) concernLines.push(`Primary Concern: ${ctx.issue}`);
            if (ctx.riskFactor) concernLines.push(`Details: ${ctx.riskFactor}`);
            if (ctx.severity) concernLines.push(`Severity Level: ${severityLabel}`);
            if (ctx.metric) concernLines.push(`Current Metrics: ${ctx.metric}`);
            if (ctx.trend) concernLines.push(`Trend: ${ctx.trend}`);
            const concernSection = concernLines.length > 0
                ? concernLines.join('\n')
                : 'Performance data indicates need for additional support resources';

            return {
                subject: `Bridge Support Request — ${ctx.entityName}`,
                body: `BRIDGE SUPPORT REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBJECT
${ctx.entityType === 'teacher' ? 'Teacher' : ctx.entityType === 'student' ? 'Student' : 'Entity'}: ${ctx.entityName}

IDENTIFIED CONCERNS
${concernSection}

DATA-DRIVEN JUSTIFICATION
This request is generated from our performance monitoring system, which has tracked a pattern of ${ctx.trend === 'declining' ? 'declining indicators' : 'concerning metrics'} over recent weeks. Without intervention, projections indicate continued deterioration${ctx.entityType === 'student' ? ' with risk of course failure by end of semester' : ' impacting student outcomes across affected sections'}.

RECOMMENDED SUPPORT PLAN
${ctx.entityType === 'teacher' ? `• Peer mentorship: 2x/week sessions with department head or senior colleague
• Classroom observation cycle: 3 structured observations over 4 weeks with actionable feedback
• Professional development: Targeted PD in ${ctx.issue || 'identified area of need'}
• Bi-weekly progress check-ins with administration
• Reduced non-teaching duties for 4 weeks to allow focus on improvement` : `• Dedicated academic support: 3x/week with assigned interventionist
• Modified assessment schedule to reduce anxiety and build confidence
• Weekly progress monitoring with parent communication
• Counselor check-in to address any social-emotional factors
• Peer study group placement with compatible learning partners`}

EXPECTED TIMELINE
• Week 1–2: Assessment and support plan finalization
• Week 3–6: Active intervention with weekly progress tracking
• Week 6–8: Reassessment and outcome evaluation

HISTORICAL CONTEXT
Similar bridge interventions in our district have resulted in measurable improvement in 78% of cases within the 8-week window.

Please review and authorize the bridge support resources.

Submitted by: Dr. Sarah Chen, District Administrator`,
            };
        }

        case 'send_email': {
            const subjectNote = ctx.subject ? " in " + ctx.subject : "";
            const contextLines: string[] = [];
            if (ctx.issue) contextLines.push(ctx.issue);
            if (ctx.riskFactor) contextLines.push(`Background: ${ctx.riskFactor}`);
            if (ctx.metric) contextLines.push(`Current data: ${ctx.metric}`);
            const contextSection = contextLines.length > 0
                ? contextLines.join('\n')
                : 'I would like to touch base on a few items.';

            return {
                subject: `Message for ${ctx.entityName}`,
                body: `Dear ${ctx.entityName},

I hope this message finds you well. I wanted to reach out regarding your work${subjectNote}.

${contextSection}

${ctx.suggestedAction ? `Our suggestion: ${ctx.suggestedAction}\n` : ''}Please let me know if you have any questions or if there is anything you need from the administration. I am available for a quick call or in-person meeting at your convenience.

Best regards,
Dr. Sarah Chen
District Administrator
Central Valley Unified School District`,
            };
        }

        case 'schedule_call': {
            const topicLine = ctx.issue ? ctx.issue : "General check-in and progress review";
            const agendaItems: string[] = [];
            if (ctx.riskFactor) agendaItems.push(`• Discuss: ${ctx.riskFactor}`);
            if (ctx.metric) agendaItems.push(`• Review metrics: ${ctx.metric}`);
            if (ctx.subject) agendaItems.push(`• Subject area: ${ctx.subject}`);
            if (ctx.suggestedAction) agendaItems.push(`• Proposed action: ${ctx.suggestedAction}`);
            const agendaSection = agendaItems.length > 0
                ? `TALKING POINTS\n${agendaItems.join('\n')}\n`
                : '';

            return {
                subject: `Call Request — ${ctx.entityName}`,
                body: `PHONE CALL REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Participant: ${ctx.entityName}
Topic: ${topicLine}
Urgency: ${ctx.severity === 'high' ? 'High — within 48 hours' : 'Routine — within 1 week'}
Estimated Duration: 15–20 minutes

${agendaSection}AVAILABLE TIMES
• Mon–Thu mornings: 9:00 – 11:00 AM
• Mon–Thu afternoons: 1:00 – 3:00 PM
• Friday: By appointment only

Please confirm your preferred time and we will send a calendar invitation with a dial-in number.

Dr. Sarah Chen
District Administrator
Central Valley Unified School District
Phone: (555) 234-5678`,
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
                                    <h2 className="text-lg font-medium text-off-white">{info.label}</h2>
                                    <p className="text-sm text-off-white/40">{info.description}</p>
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
                                    <label className="text-xs uppercase tracking-wider text-off-white/30 font-medium mb-1 block">Subject</label>
                                    <input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-base text-off-white focus:outline-none focus:border-acid-lime/50 transition-colors"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-off-white/30 font-medium mb-1 block">Message</label>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        rows={12}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-base text-off-white leading-relaxed focus:outline-none focus:border-acid-lime/50 transition-colors resize-none"
                                    />
                                </div>

                                {/* Recipient Tag */}
                                <div className="flex items-center gap-2 text-sm text-off-white/40">
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
                                className="px-4 py-2 text-base text-off-white/60 hover:text-off-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <motion.button
                                onClick={handleSend}
                                disabled={sendState !== 'idle'}
                                whileHover={{ scale: sendState === 'idle' ? 1.02 : 1 }}
                                whileTap={{ scale: sendState === 'idle' ? 0.98 : 1 }}
                                className={cn(
                                    'flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-base transition-all',
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
