'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import PerformanceHeatmap from '@/components/school/PerformanceHeatmap';
import ProjectionGraph from '@/components/school/ProjectionGraph';
import { ArrowLeft, Users, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SchoolPage({ params }: { params: { id: string } }) {
    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen flex flex-col gap-8 max-w-7xl mx-auto">

            {/* Header */}
            <header className="flex flex-col gap-4">
                <Link href={`/district/1`} className="flex items-center gap-2 text-sm text-off-white/60 hover:text-acid-lime transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to District
                </Link>
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-serif text-5xl italic">Lincoln High School</h1>
                        <p className="text-off-white/60 font-mono text-sm">ID: {params.id} • PRINCIPAL: DR. S. CARTER</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-bold">A-</span>
                            <span className="text-[10px] text-off-white/40 uppercase tracking-widest">Grade</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Top Insights & Actions */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BentoCard
                    title="Immediate Insights"
                    icon={<Zap className="text-acid-lime" />}
                    className="lg:col-span-2 min-h-[220px]"
                    glow
                >
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-red-200">Math Dept Underperformance</span>
                                <span className="text-xs text-red-200/60">3 teachers flagged for support intervention req.</span>
                            </div>
                            <Link href="/teacher/t1" className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-400 transition-colors">
                                Request Bridge
                            </Link>
                        </div>

                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-purple-200">Science Fair Approaching</span>
                                <span className="text-xs text-purple-200/60">Budget approval pending for 12 kits.</span>
                            </div>
                            <button className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-400 transition-colors">
                                Approve
                            </button>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard
                    title="At a Glance"
                    icon={<Users className="text-blue-400" />}
                    glow
                >
                    <div className="grid grid-cols-2 gap-4 mt-4 h-full">
                        <div className="flex flex-col justify-center bg-white/5 rounded-lg p-3 text-center">
                            <span className="text-2xl font-bold">1,240</span>
                            <span className="text-xs text-off-white/40">Students</span>
                        </div>
                        <div className="flex flex-col justify-center bg-white/5 rounded-lg p-3 text-center">
                            <span className="text-2xl font-bold">54</span>
                            <span className="text-xs text-off-white/40">Teachers</span>
                        </div>
                        <div className="flex flex-col justify-center bg-white/5 rounded-lg p-3 text-center col-span-2">
                            <span className="text-2xl font-bold text-acid-lime">94%</span>
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
                    <ProjectionGraph />
                </BentoCard>

                <BentoCard
                    title="Faculty Performance"
                    description="Active Staff Overview"
                    className="lg:col-span-2 h-[200px]"
                    icon={<BookOpen className="text-purple-400" />}
                    glow
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 h-full overflow-y-auto no-scrollbar">
                        <Link href="/teacher/t1" className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-acid-lime/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-200 font-serif italic border border-purple-500/30">SC</div>
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
            </section>
        </PageTransition>
    );
}
