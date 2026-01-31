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
                    <div className="w-24 h-24 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-3xl font-mono text-blue-200">
                        JS
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif italic">John Smith</h1>
                        <p className="text-off-white/60">Grade 11 • ID: {params.id}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded textxs bg-white/5 border border-white/10 text-xs">Honor Roll</span>
                            <span className="px-2 py-0.5 rounded textxs bg-white/5 border border-white/10 text-xs">Varsity Team</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-sm text-off-white/40 uppercase tracking-widest">GPA</span>
                    <span className="text-4xl font-bold">3.8</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                <BentoCard title="Performance Insights" icon={<CheckCircle className="text-green-400" />} glow>
                    <div className="mt-4 flex flex-col gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <h4 className="font-bold text-green-200 text-sm mb-1">Excelling in Physics</h4>
                            <p className="text-xs text-green-200/70">Top 5% of class for 3 consecutive terms. Recommended for AP Track.</p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <h4 className="font-bold text-blue-200 text-sm mb-1">Consistent Attendance</h4>
                            <p className="text-xs text-blue-200/70">Zero unexcused absences this semester.</p>
                        </div>
                    </div>
                </BentoCard>

                <div className="flex flex-col gap-6">
                    <BentoCard title="Current Enrollement" icon={<Book className="text-acid-lime" />}>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {['AP Physics', 'Calculus', 'English Lit', 'History', 'Spanish III', 'Gym'].map(s => (
                                <div key={s} className="bg-white/5 p-2 rounded text-sm hover:bg-white/10 transition-colors">
                                    {s}
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    <BentoCard title="Areas of Focus" icon={<AlertCircle className="text-orange-400" />}>
                        <div className="mt-2 text-sm text-orange-200/80">
                            <p>• English Lit essays submitted late (2 occurrences).</p>
                        </div>
                    </BentoCard>
                </div>

            </div>
        </PageTransition>
    );
}
