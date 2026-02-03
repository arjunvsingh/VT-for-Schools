'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { NotesButton } from '@/components/ui/NotesPanel';
import { ActionButton } from '@/components/ui/ActionButton';
import { Book, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useDataStore } from '@/lib/stores';
import { PerformanceHistory } from '@/components/ui/PerformanceHistory';

export default function StudentPage({ params }: { params: { id: string } }) {
    const student = useDataStore((state) => state.getStudent(params.id));

    // Fallback for invalid student ID
    const studentName = student?.name ?? 'Unknown Student';
    const initials = student?.initials ?? '??';
    const gradeLevel = student?.grade ?? 0;
    const gpa = student?.gpa ?? 0;
    const subjects = student?.subjects ?? [];
    const badges = student?.badges ?? [];
    const schoolId = student?.schoolId ?? 's1';
    const status = student?.status ?? 'on-track';

    // New enriched data
    const riskFactors = student?.riskFactors ?? [];
    const areasOfFocus = student?.areasOfFocus ?? [];
    const performanceHistory = student?.performanceHistory ?? [];

    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen max-w-5xl mx-auto flex flex-col gap-6">

            <BackLink href={`/school/${schoolId}`} label="Back to School" />

            <div className="flex items-start justify-between">
                <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl font-mono text-cyan-200 font-serif italic">
                        {initials}
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif italic">{studentName}</h1>
                        <p className="text-off-white/60">Grade {gradeLevel} • ID: {params.id}</p>
                        <div className="flex gap-2 mt-2">
                            {badges.map((badge) => (
                                <span key={badge} className="px-2 py-0.5 rounded text-xs bg-acid-lime/10 border border-acid-lime/20 text-acid-lime">{badge}</span>
                            ))}
                            {badges.length === 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10">No badges yet</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                        <span className="block text-sm text-off-white/40 uppercase tracking-widest">GPA</span>
                        <span className={`text-4xl font-bold ${gpa >= 3.5 ? 'text-acid-lime' : gpa >= 2.5 ? 'text-off-white' : 'text-orange-400'}`}>{gpa}</span>
                    </div>
                    <NotesButton entityType="student" entityId={params.id} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-start">

                <BentoCard title="Performance Insights" icon={<CheckCircle className="text-acid-lime" />} glow>
                    <div className="mt-2 flex flex-col gap-4">
                        <div className="p-3 rounded-lg bg-acid-lime/10 border border-acid-lime/20">
                            <h4 className="font-bold text-acid-lime text-sm mb-1">Excelling in Physics</h4>
                            <p className="text-xs text-off-white/80">Top 5% of class for 3 consecutive terms. Recommended for AP Track.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                            <h4 className="font-bold text-cyan-200 text-sm mb-1">Consistent Attendance</h4>
                            <p className="text-xs text-cyan-200/70">Zero unexcused absences this semester.</p>
                        </div>
                    </div>
                </BentoCard>

                <div className="flex flex-col gap-6">
                    <BentoCard title="Current Enrollment" icon={<Book className="text-cyan-400" />} glow>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {subjects.map(s => (
                                <div key={s} className="bg-white/5 p-2 rounded text-sm hover:bg-white/10 hover:text-cyan-300 transition-colors border border-white/5">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* Risk Analysis - New Card */}
                    {riskFactors.length > 0 && (
                        <BentoCard title="Risk Analysis" icon={<AlertCircle className="text-red-400" />} className="bg-red-500/5">
                            <div className="flex flex-col gap-3 mt-2">
                                {riskFactors.map(rf => (
                                    <div key={rf.id} className="p-3 rounded-lg bg-red-400/5 border border-red-400/10">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-red-300 text-sm">{rf.type}</h4>
                                            <span className="text-[10px] uppercase tracking-wider text-red-200/50 bg-red-400/10 px-1.5 py-0.5 rounded">{rf.trend}</span>
                                        </div>
                                        <p className="text-xs text-off-white/80 mb-2">{rf.detail}</p>

                                        {/* Metric if available */}
                                        {rf.metric && (
                                            <div className="flex items-center gap-2 mb-2 text-[10px] text-off-white/50 bg-black/20 p-1.5 rounded">
                                                <span>Current: <span className="text-off-white font-mono">{rf.metric.current}</span></span>
                                                <span>•</span>
                                                <span>Target: <span className="text-off-white font-mono">{rf.metric.threshold}</span></span>
                                            </div>
                                        )}

                                        <ActionButton
                                            type={rf.actionType}
                                            entityType="student"
                                            entityId={params.id}
                                            entityName={studentName}
                                            size="sm"
                                            variant="secondary"
                                            customLabel={rf.suggestedAction}
                                            className="w-full justify-center text-xs h-8"
                                            modalContext={{
                                                riskFactor: rf.detail,
                                                metric: rf.metric ? `Current: ${rf.metric.current}, Target: ${rf.metric.threshold}` : undefined,
                                                trend: rf.trend,
                                                suggestedAction: rf.suggestedAction,
                                                subject: rf.type,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </BentoCard>
                    )}

                    {/* Areas of Focus - Enriched */}
                    {areasOfFocus.length > 0 ? (
                        <BentoCard title="Areas of Focus" icon={<AlertCircle className="text-orange-400" />}>
                            <div className="flex flex-col gap-3 mt-2">
                                {areasOfFocus.map(area => (
                                    <div key={area.id} className="p-3 rounded-lg bg-orange-400/5 border border-orange-400/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-orange-300 bg-orange-400/10 px-1.5 py-0.5 rounded">{area.subject}</span>
                                            <span className="text-xs text-orange-200/60">• {area.occurrences} occurrences</span>
                                        </div>
                                        <p className="text-sm font-medium text-orange-100 mb-1">{area.issue}</p>

                                        <div className="mt-2 pl-2 border-l-2 border-orange-400/20">
                                            <p className="text-[10px] text-off-white/40 uppercase tracking-wider mb-0.5">Root Cause</p>
                                            <p className="text-xs text-off-white/70 italic">{area.rootCause}</p>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <span className="text-[10px] text-off-white/40">Teacher: {area.teacherName}</span>
                                            <ActionButton
                                                type={area.actionType}
                                                entityType="student"
                                                entityId={params.id}
                                                entityName={studentName}
                                                size="sm"
                                                variant="secondary"
                                                customLabel="Take Action"
                                                modalContext={{
                                                    subject: area.subject,
                                                    issue: area.issue,
                                                    riskFactor: area.rootCause,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>
                    ) : (
                        // Fallback empty state or original hardcoded value if no enriched data (shouldn't happen with updated store)
                        <BentoCard title="Areas of Focus" icon={<AlertCircle className="text-green-400" />}>
                            <div className="p-4 text-center text-off-white/40 text-sm">
                                <CheckCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p>No immediate concerns identified.</p>
                            </div>
                        </BentoCard>
                    )}
                </div>

            </div>

            {/* Academic Journey Timeline */}
            {performanceHistory.length > 0 && (
                <BentoCard title="Academic Journey" icon={<TrendingUp className="text-acid-lime" />} glow>
                    <div className="mt-3">
                        <PerformanceHistory
                            data={performanceHistory}
                            primaryLabel="GPA"
                            secondaryLabel="Attendance"
                            height={220}
                            domainMin={0}
                            domainMax={5}
                        />
                    </div>
                </BentoCard>
            )}
        </PageTransition>
    );
}
