'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { Book, AlertCircle, CheckCircle } from 'lucide-react';
import { useDataStore } from '@/lib/stores';

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
                <div className="text-right">
                    <span className="block text-sm text-off-white/40 uppercase tracking-widest">GPA</span>
                    <span className={`text-4xl font-bold ${gpa >= 3.5 ? 'text-acid-lime' : gpa >= 2.5 ? 'text-off-white' : 'text-orange-400'}`}>{gpa}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                <BentoCard title="Performance Insights" icon={<CheckCircle className="text-acid-lime" />} glow>
                    <div className="mt-auto flex flex-col gap-4">
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

                    <BentoCard title="Areas of Focus" icon={<AlertCircle className="text-orange-400" />}>
                        <div className="mt-2 text-sm text-orange-200/80 p-3 bg-orange-400/5 rounded border border-orange-400/10">
                            <p>• English Lit essays submitted late (2 occurrences).</p>
                        </div>
                    </BentoCard>
                </div>

            </div>
        </PageTransition>
    );
}
