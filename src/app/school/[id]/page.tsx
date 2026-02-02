'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { ActionButton } from '@/components/ui/ActionButton';
import PerformanceHeatmap from '@/components/school/PerformanceHeatmap';
import ProjectionGraph from '@/components/school/ProjectionGraph';
import { GoalsDashboard } from '@/components/school/GoalsDashboard';
import { ActivityTrackerPanel } from '@/components/school/ActivityTrackerPanel';
import { BackLink } from '@/components/navigation';
import { Users, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useDataStore } from '@/lib/stores';

export default function SchoolPage({ params }: { params: { id: string } }) {
    const school = useDataStore((state) => state.getSchool(params.id));
    const teachers = useDataStore((state) => state.getTeachersForSchool(params.id));
    const students = useDataStore((state) => state.getStudentsForSchool(params.id));

    // Track dismissed insights
    const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

    const dismissInsight = (insightId: string) => {
        setDismissedInsights(prev => new Set(prev).add(insightId));
    };

    // Fallback for invalid school ID
    const schoolName = school?.name ?? 'Unknown School';
    const principal = school?.principal ?? 'N/A';
    const districtId = school?.districtId ?? '1';
    const grade = school?.grade ?? 'N/A';
    const studentCount = school?.students ?? 0;
    const teacherCount = school?.teachers ?? 0;
    const attendance = school?.attendance ?? 0;

    return (
        <PageTransition className="p-4 md:p-8 pt-48 min-h-screen flex flex-col gap-8 max-w-7xl mx-auto">

            {/* Header */}
            <header className="flex flex-col gap-4">
                <BackLink href={`/district/${districtId}`} label="Back to District" />
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-serif text-5xl italic">{schoolName}</h1>
                        <p className="text-off-white/60 font-mono text-sm">ID: {params.id} • PRINCIPAL: {principal}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Activity Button */}
                        <ActivityTrackerPanel schoolId={params.id} />
                        {/* Grade */}
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold">{grade}</span>
                            <span className="text-[10px] text-off-white/40 uppercase tracking-widest">Grade</span>
                        </div>
                    </div>
                </div>
            </header>


            {/* Top Insights & Actions - Full Width */}
            <section>
                <BentoCard
                    title="Immediate Insights"
                    icon={<Zap className="text-acid-lime" />}
                    className="min-h-[280px]"
                    glow
                >
                    <div className="flex flex-col gap-4 mt-2">
                        <AnimatePresence mode="popLayout">
                            {/* Math Insight */}
                            {school?.goals && school.goals.math.current < school.goals.math.target && !dismissedInsights.has('math') && (
                                <motion.div
                                    key="math-insight"
                                    initial={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-red-200">Math Proficiency Below Target</span>
                                        <span className="text-sm text-red-200/60">
                                            Currently at {school.goals.math.current}% (target: {school.goals.math.target}%).
                                            {school.goals.math.target - school.goals.math.current > 10
                                                ? ' High Dosage Tutoring recommended for rapid improvement.'
                                                : ' Consider HDT enrollment for at-risk students.'}
                                        </span>
                                    </div>
                                    <ActionButton
                                        type="enroll_hdt"
                                        entityType="school"
                                        entityId={params.id}
                                        entityName={`${schoolName} Math HDT Program`}
                                        variant="secondary"
                                        size="sm"
                                        onComplete={() => dismissInsight('math')}
                                    />
                                </motion.div>
                            )}

                            {/* Attendance Insight */}
                            {school?.goals && school.goals.attendance.current < school.goals.attendance.target && !dismissedInsights.has('attendance') && (
                                <motion.div
                                    key="attendance-insight"
                                    initial={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-orange-200">Attendance Tracking Behind</span>
                                        <span className="text-sm text-orange-200/60">
                                            {school.goals.attendance.current}% attendance vs {school.goals.attendance.target}% goal.
                                            Review chronic absentees.
                                        </span>
                                    </div>
                                    <ActionButton
                                        type="parent_outreach"
                                        entityType="school"
                                        entityId={params.id}
                                        entityName={`${schoolName} Attendance`}
                                        variant="secondary"
                                        size="sm"
                                        onComplete={() => dismissInsight('attendance')}
                                    />
                                </motion.div>
                            )}

                            {/* Reading Success */}
                            {school?.goals && school.goals.reading.current >= school.goals.reading.target && !dismissedInsights.has('reading') && (
                                <motion.div
                                    key="reading-insight"
                                    initial={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-acid-lime/10 border border-acid-lime/20 rounded-lg flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-acid-lime">🎉 Reading Goal Achieved!</span>
                                        <span className="text-sm text-acid-lime/60">
                                            {school.goals.reading.current}% proficiency exceeds {school.goals.reading.target}% target.
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Tutoring Engagement Insight */}
                            {school?.goals && school.goals.tutoringEngagement.current < school.goals.tutoringEngagement.target && !dismissedInsights.has('tutoring') && (
                                <motion.div
                                    key="tutoring-insight"
                                    initial={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-between"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-cyan-200">HDT Enrollment Below Target</span>
                                        <span className="text-sm text-cyan-200/60">
                                            Only {school.goals.tutoringEngagement.current}% of at-risk students in High Dosage Tutoring (target: {school.goals.tutoringEngagement.target}%).
                                        </span>
                                    </div>
                                    <ActionButton
                                        type="enroll_hdt"
                                        entityType="school"
                                        entityId={params.id}
                                        entityName={`${schoolName} HDT Program`}
                                        variant="secondary"
                                        size="sm"
                                        onComplete={() => dismissInsight('tutoring')}
                                    />
                                </motion.div>
                            )}

                            {/* Empty state when all insights are dismissed */}
                            {dismissedInsights.size >= 3 && (
                                <motion.div
                                    key="all-done"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8 text-off-white/60"
                                >
                                    <span className="text-3xl mb-2 block">✅</span>
                                    <p className="font-medium">All caught up!</p>
                                    <p className="text-sm text-off-white/40">No pending actions require your attention.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </BentoCard>
            </section>

            {/* Goals Dashboard & At a Glance */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Goals Dashboard */}
                {school?.goals && (
                    <div className="lg:col-span-2">
                        <GoalsDashboard goals={school.goals} />
                    </div>
                )}

                {/* At a Glance */}
                <BentoCard
                    title="At a Glance"
                    icon={<Users className="text-blue-400" />}
                    className="lg:col-span-1"
                    glow
                >
                    <div className="grid grid-cols-2 gap-4 mt-4 h-full">
                        <div className="flex flex-col justify-center bg-white/5 rounded-lg p-3 text-center">
                            <span className="text-2xl font-bold">{studentCount.toLocaleString()}</span>
                            <span className="text-xs text-off-white/40">Students</span>
                        </div>
                        <div className="flex flex-col justify-center bg-white/5 rounded-lg p-3 text-center">
                            <span className="text-2xl font-bold">{teacherCount}</span>
                            <span className="text-xs text-off-white/40">Teachers</span>
                        </div>
                        <div className="flex flex-col justify-center bg-white/5 rounded-lg p-3 text-center col-span-2">
                            <span className="text-2xl font-bold text-acid-lime">{attendance}%</span>
                            <span className="text-xs text-off-white/40">Avg Attendance</span>
                        </div>
                    </div>
                </BentoCard>
            </section>

            {/* Deep Dive Visuals */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BentoCard
                    title="Academic Heatmap"
                    description="Performance by Grade & Subject"
                    className="col-span-1"
                    glow
                >
                    <PerformanceHeatmap />
                </BentoCard>

                <BentoCard
                    title="Predictive Analytics"
                    description="End of Year Forecast"
                    className="col-span-1"
                    glow
                >
                    <ProjectionGraph schoolId={params.id} />
                </BentoCard>

                <BentoCard
                    title="Faculty Performance"
                    description="Active Staff Overview"
                    className="lg:col-span-1 h-[200px]"
                    icon={<BookOpen className="text-cyan-400" />}
                    glow
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 h-full overflow-y-auto no-scrollbar">
                        <Link href="/teacher/t1" className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-acid-lime/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-200 font-serif italic border border-cyan-500/30">SC</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm group-hover:text-acid-lime transition-colors">Sarah Carter</span>
                                    <span className="text-[10px] text-off-white/60">Physics Head</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-acid-lime font-mono">4.9</span>
                                <span className="text-[10px] text-off-white/40">Rating</span>
                            </div>
                        </Link>

                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-200 font-serif italic border border-blue-500/30">JD</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">John Doe</span>
                                    <span className="text-[10px] text-off-white/60">Math Dept</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-yellow-400 font-mono">3.2</span>
                                <span className="text-[10px] text-off-white/40">Rating</span>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard
                    title="Student Performance"
                    description="Top Achievers & At-Risk"
                    className="lg:col-span-1 h-[200px]"
                    icon={<Users className="text-acid-lime" />}
                    glow
                >
                    <div className="flex flex-col gap-3 mt-2 h-full overflow-y-auto no-scrollbar">
                        <Link href="/student/st1" className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-acid-lime/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-200 font-mono text-xs border border-cyan-500/30">JS</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm group-hover:text-acid-lime transition-colors">John Smith</span>
                                    <span className="text-[10px] text-off-white/60">Grade 11</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-acid-lime font-mono text-xs">3.8 GPA</span>
                            </div>
                        </Link>
                        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg opacity-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-200 font-mono text-xs border border-orange-500/30">AK</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">Alex Kim</span>
                                    <span className="text-[10px] text-off-white/60">Grade 10</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-orange-400 font-mono text-xs">2.1 GPA</span>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            </section>
        </PageTransition>
    );
}
