'use client';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { ArrowLeft, Book, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentPage({ params }: { params: { id: string } }) {
    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen max-w-5xl mx-auto flex flex-col gap-6">

            <Link href={`/school/s1`} className="flex items-center gap-2 text-sm text-off-white/60 hover:text-acid-lime transition-colors w-fit">
                <ArrowLeft className="w-4 h-4" /> Back to School
            </Link>

            <div className="flex items-start justify-between">
                <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl font-mono text-cyan-200 font-serif italic">
                        JS
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif italic">John Smith</h1>
                        <p className="text-off-white/60">Grade 11 • ID: {params.id}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded textxs bg-acid-lime/10 border border-acid-lime/20 text-xs text-acid-lime">Honor Roll</span>
                            <span className="px-2 py-0.5 rounded textxs bg-white/5 border border-white/10 text-xs">Varsity Team</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-sm text-off-white/40 uppercase tracking-widest">GPA</span>
                    <span className="text-4xl font-bold text-acid-lime">3.8</span>
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
                            {['AP Physics', 'Calculus', 'English Lit', 'History', 'Spanish III', 'Gym'].map(s => (
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
