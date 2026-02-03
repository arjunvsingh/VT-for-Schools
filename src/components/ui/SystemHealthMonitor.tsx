'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Building2, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTransitionNavigate } from '@/components/layout/TransitionOverlay';

// Types derived from store but kept local for component flexibility
interface HealthSchool {
    id: string;
    name: string;
    status: 'good' | 'warning' | 'alert';
    principal: string;
    performance: number; // 0-100
    issue?: string;
}

interface HealthTeacher {
    id: string;
    name: string;
    schoolName: string;
    status: 'active' | 'flagged' | 'inactive';
    rating: number; // 0-5
    issue?: string;
}

interface SystemHealthMonitorProps {
    schools: HealthSchool[];
    teachers: HealthTeacher[];
    className?: string;
}

type Tab = 'schools' | 'teachers';

// AI Insight Generator Helper
function getInsight(issue: string | undefined, type: 'school' | 'teacher'): string {
    if (!issue) return "Performance metrics are stable.";

    if (type === 'school') {
        if (issue.includes('Critical')) return "Immediate intervention required for declining metrics.";
        if (issue.includes('Below Average')) return "Trend analysis suggests potential risk next quarter.";
        return "Monitor closely for variance.";
    } else {
        if (issue.includes('Performance')) return "Peer mentorship recommended based on recent reviews.";
        return "Schedule check-in to align on goals.";
    }
}

export function SystemHealthMonitor({ schools, teachers, className }: SystemHealthMonitorProps) {
    const [activeTab, setActiveTab] = useState<Tab>('schools');
    const navigate = useTransitionNavigate();

    // Filter for critical entities
    const criticalSchools = useMemo(() => {
        return schools
            .filter(s => s.status === 'alert' || s.status === 'warning')
            .sort((a, b) => (a.status === 'alert' ? -1 : 1)); // Alert first
    }, [schools]);

    const criticalTeachers = useMemo(() => {
        return teachers
            .filter(t => t.status === 'flagged')
            .sort((a, b) => a.rating - b.rating); // Lowest rating first
    }, [teachers]);

    const stats = useMemo(() => {
        return {
            schools: criticalSchools.length,
            teachers: criticalTeachers.length,
        };
    }, [criticalSchools, criticalTeachers]);

    const activeList = activeTab === 'schools' ? criticalSchools : criticalTeachers;

    // Helper to generate specific AI insights based on the issue
    const getInsight = (issue: string | undefined, type: 'school' | 'teacher') => {
        if (!issue) return "Routine performance monitoring active.";

        const lowerIssue = issue.toLowerCase();
        if (type === 'school') {
            if (lowerIssue.includes('resource')) return "High student-teacher ratio detected in Science dept.";
            if (lowerIssue.includes('performance')) return "Math proficiency dropped 5% vs previous quarter.";
            if (lowerIssue.includes('attendance')) return "Unusual comparative 3-day absentee spike.";
            return "AI detects anomaly in weekly reporting metrics.";
        } else {
            if (lowerIssue.includes('burnout')) return "Excess overtime hours logged (avg >50h/week).";
            if (lowerIssue.includes('feedback')) return "Negative sentiment trend in recent parent submissions.";
            if (lowerIssue.includes('curriculum')) return " falling behind district pacing guide by 2 weeks.";
            return "Performance deviation detected from cohort baseline.";
        }
    };
    const insights = useMemo(() => {
        const list = activeTab === 'schools' ? criticalSchools : criticalTeachers;

        // Positive insights (Mocked for demo as we focus on criticals)
        const good = activeTab === 'schools'
            ? "District-wide math proficiency is up 2.4% this quarter."
            : "92% of staff have completed their professional development goals.";

        // Negative insights - Dynamic generation
        if (list.length === 0) return { good, bad: "No critical anomalies detected at this time." };

        const issues = Array.from(new Set(list.map(item => item.issue).filter(Boolean))) as string[];
        const topIssue = issues[0] || "Performance Check";

        let bad = "";
        if (activeTab === 'schools') {
            bad = `${list.length} schools flagged. Primary driver: ${topIssue}`;
            if (issues.length > 1) bad += `, followed by ${issues[1].toLowerCase()}`;
            bad += ". Recommended: Allocate resource support.";
        } else {
            bad = `${list.length} teachers flagged. Main factor: ${topIssue}`;
            if (issues.length > 1) bad += ` and ${issues[1].toLowerCase()}`;
            bad += ". Recommended: Schedule 1:1 check-ins.";
        }

        return { good, bad };
    }, [activeTab, criticalSchools, criticalTeachers]);

    return (
        <div className={cn("w-full h-full flex flex-col gap-4", className)}>

            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-1">
                <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
                    <button
                        onClick={() => setActiveTab('schools')}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                            activeTab === 'schools'
                                ? "bg-stone-800 text-off-white shadow-sm"
                                : "text-off-white/40 hover:text-off-white/60"
                        )}
                    >
                        <Building2 className="w-3.5 h-3.5" />
                        Schools
                        {stats.schools > 0 && (
                            <span className="bg-red-500/20 text-red-300 px-1.5 rounded-full text-xs">
                                {stats.schools}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                            activeTab === 'teachers'
                                ? "bg-stone-800 text-off-white shadow-sm"
                                : "text-off-white/40 hover:text-off-white/60"
                        )}
                    >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Teachers
                        {stats.teachers > 0 && (
                            <span className="bg-orange-500/20 text-orange-300 px-1.5 rounded-full text-xs">
                                {stats.teachers}
                            </span>
                        )}
                    </button>
                </div>
            </div>



            {/* List - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {activeList.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => navigate(activeTab === 'schools' ? `/school/${item.id}` : `/teacher/${item.id}`)}
                            className="group relative flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                        >
                            {/* Main Row */}
                            <div className="flex items-center gap-3">
                                {/* Status Line */}
                                <div className={cn(
                                    "absolute left-0 top-3 bottom-3 w-0.5 rounded-full",
                                    activeTab === 'schools'
                                        ? (item as HealthSchool).status === 'alert' ? 'bg-red-500' : 'bg-orange-500'
                                        : 'bg-orange-500' // Teachers generally warning level
                                )} />

                                {/* Icon */}
                                <div className="w-8 h-8 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-xs text-off-white font-medium shrink-0 group-hover:border-acid-lime/50 transition-colors">
                                    {activeTab === 'schools' ? (
                                        <Building2 className="w-4 h-4 text-off-white/40" />
                                    ) : (
                                        <div className="text-xs font-bold">{(item as HealthTeacher).rating}</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-base font-medium text-off-white truncate group-hover:text-acid-lime transition-colors">
                                            {item.name}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-off-white/40 truncate">
                                        {activeTab === 'schools'
                                            ? `Principal: ${(item as HealthSchool).principal}`
                                            : `${(item as HealthTeacher).schoolName}`}
                                    </p>
                                </div>

                                {/* Issue Tag */}
                                <div className={cn(
                                    "text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5 text-off-white/50 whitespace-nowrap max-w-[120px] truncate",
                                    activeTab === 'schools' && (item as HealthSchool).status === 'alert' && "bg-red-500/10 text-red-300 border-red-500/20"
                                )}>
                                    {item.issue || 'Requires Review'}
                                </div>

                                {/* Hover Action */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-stone-900 shadow-xl rounded-md border border-white/10 p-1 flex gap-1 z-10">
                                    <div className="p-1.5 hover:bg-white/10 rounded text-off-white/80 hover:text-white">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>

                            {/* AI Insight Row */}
                            <div className="ml-11 flex items-start gap-2 text-xs text-off-white/60 bg-stone-900/50 p-2 rounded border border-white/5">
                                <Sparkles className="w-3 h-3 text-acid-lime shrink-0 mt-0.5" />
                                <span className="leading-tight">
                                    <strong className="text-acid-lime/90 font-normal">AI Insight:</strong> {getInsight(item.issue, activeTab === 'schools' ? 'school' : 'teacher')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {activeList.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-off-white/30 py-8">
                        <span className="text-2xl mb-2">🎉</span>
                        <span className="text-xs">No issues detected</span>
                    </div>
                )}
            </div>

            {/* View All */}
            <Link
                href={activeTab === 'schools' ? "/schools" : "/teachers"}
                className="text-sm text-center text-off-white/40 hover:text-acid-lime transition-colors mt-auto py-1 flex items-center justify-center gap-1 group"
            >
                View all {activeTab}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>
    );
}
