'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BentoCard } from '@/components/ui/BentoCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { useDataStore } from '@/lib/stores';
import {
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    Users,
    Calendar,
    ArrowRight,
    X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SchoolInsightsPanelProps {
    schoolId: string;
    onClose: () => void;
}

export function SchoolInsightsPanel({ schoolId, onClose }: SchoolInsightsPanelProps) {
    const school = useDataStore((state) => state.getSchool(schoolId));
    const teachers = useDataStore((state) => state.getTeachersForSchool(schoolId));
    const insights = useDataStore((state) => state.getInsightsForEntity('school', schoolId));

    if (!school) return null;

    const flaggedTeachers = teachers.filter(t => t.status === 'flagged');
    const isAlert = school.status === 'alert';
    const isWarning = school.status === 'warning';

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={schoolId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col gap-4 h-full"
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-mono text-off-white/40 uppercase tracking-widest">
                            Selected School
                        </span>
                        <h2 className="font-serif text-xl italic text-off-white">{school.name}</h2>
                        <span className="text-xs text-off-white/60">{school.principal}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        aria-label="Close school panel"
                    >
                        <X className="w-4 h-4 text-off-white/60" />
                    </button>
                </div>

                {/* Priority Insights - Dynamic */}
                {insights.length > 0 && (
                    <BentoCard
                        title="Priority Insights"
                        icon={<Sparkles className="w-4 h-4 text-acid-lime" />}
                        className="min-h-[160px]"
                        glow
                    >
                        <div className="flex flex-col gap-3 mt-2">
                            {insights.map(insight => (
                                <div key={insight.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-sm text-off-white">{insight.title}</h4>
                                        {insight.priority && (
                                            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${insight.priority === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-acid-lime/10 text-acid-lime'}`}>
                                                {insight.priority}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-off-white/80 mb-2">{insight.description}</p>

                                    {insight.impactMetric && (
                                        <div className="mb-2 pl-2 border-l-2 border-acid-lime/30">
                                            <p className="text-[10px] text-off-white/50 uppercase">Impact</p>
                                            <p className="text-xs text-off-white/90">{insight.impactMetric}</p>
                                        </div>
                                    )}

                                    {insight.actionLabel && (
                                        <div className="mt-2">
                                            <Link href={insight.actionPath || '#'} className="text-xs font-bold text-acid-lime flex items-center gap-1 hover:underline">
                                                {insight.actionLabel} <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                )}

                {/* AI Summary Card (Legacy/Fallback) */}
                {!insights.length && (
                    <BentoCard
                        title="AI Insights"
                        icon={<Sparkles className={cn(
                            "w-4 h-4",
                            isAlert ? "text-red-400" : isWarning ? "text-orange-400" : "text-acid-lime"
                        )} />}
                        className="min-h-[160px]"
                        glow
                    >
                        <div className="flex flex-col gap-3 mt-2">
                            {school.aiSummary ? (
                                <>
                                    <p className={cn(
                                        "text-sm font-medium",
                                        isAlert ? "text-red-300" : isWarning ? "text-orange-300" : "text-acid-lime"
                                    )}>
                                        {school.aiSummary.headline}
                                    </p>
                                    <ul className="space-y-1.5">
                                        {school.aiSummary.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-xs text-off-white/70">
                                                <span className={cn(
                                                    "w-1 h-1 rounded-full mt-1.5 shrink-0",
                                                    isAlert ? "bg-red-400" : isWarning ? "bg-orange-400" : "bg-acid-lime"
                                                )} />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="text-xs text-off-white/50">No AI insights available</p>
                            )}
                        </div>
                    </BentoCard>
                )}

                {/* Flagged Teachers */}
                {flaggedTeachers.length > 0 && (
                    <BentoCard
                        title="Teachers Flagged"
                        icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                        className="min-h-[120px]"
                        glow
                    >
                        <div className="flex flex-col gap-2 mt-2">
                            {flaggedTeachers.map(teacher => (
                                <div
                                    key={teacher.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-400/20 flex items-center justify-center text-xs font-bold text-red-300">
                                            {teacher.initials}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-off-white font-medium">{teacher.name}</span>
                                            <div className="flex items-center gap-2 text-[10px] text-red-400/80">
                                                <span>{teacher.department}</span>
                                                <span className="w-1 h-1 rounded-full bg-red-400/40" />
                                                <span>Rating {teacher.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/teacher/${teacher.id}`}
                                        className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-red-400/10 text-red-300 text-[10px] font-bold uppercase tracking-wider hover:bg-red-400/20 transition-colors border border-red-400/20"
                                    >
                                        Review
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                )}

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-3 h-3 text-acid-lime" />
                            <span className="text-[10px] text-off-white/40 uppercase">Students</span>
                        </div>
                        <span className="text-lg font-mono text-off-white">{school.students.toLocaleString()}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-3 h-3 text-acid-lime" />
                            <span className="text-[10px] text-off-white/40 uppercase">Attendance</span>
                        </div>
                        <span className={cn(
                            "text-lg font-mono",
                            school.attendance < 90 ? "text-red-400" : "text-off-white"
                        )}>{school.attendance}%</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <BentoCard
                    title="Quick Actions"
                    icon={<CheckCircle2 className="w-4 h-4 text-acid-lime" />}
                    className="flex-1 min-h-[140px]"
                    glow
                >
                    <div className="flex flex-col gap-2 mt-2">
                        {isAlert && (
                            <ActionButton
                                type="request_bridge"
                                entityType="school"
                                entityId={schoolId}
                                entityName={school.name}
                                variant="primary"
                                size="sm"
                                className="w-full justify-center"
                            />
                        )}
                        <ActionButton
                            type="schedule_meeting"
                            entityType="school"
                            entityId={schoolId}
                            entityName={school.name}
                            variant="secondary"
                            size="sm"
                            className="w-full justify-center"
                            customLabel={`Contact ${school.principal}`}
                        />
                        <ActionButton
                            type="send_email"
                            entityType="school"
                            entityId={schoolId}
                            entityName={school.name}
                            variant="secondary"
                            size="sm"
                            className="w-full justify-center"
                        />
                        <Link
                            href={`/school/${schoolId}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 mt-1 rounded-lg bg-acid-lime/10 text-acid-lime text-sm font-medium hover:bg-acid-lime/20 transition-colors border border-acid-lime/20"
                        >
                            View Full Report
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </BentoCard>
            </motion.div>
        </AnimatePresence>
    );
}
