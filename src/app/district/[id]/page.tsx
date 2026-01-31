'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import DistrictMap from '@/components/district/DistrictMap';
import { BentoCard } from '@/components/ui/BentoCard';
import { ArrowLeft, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';

export default function DistrictPage({ params }: { params: { id: string } }) {
    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen flex flex-col gap-6">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <Link href="/" className="flex items-center gap-2 text-sm text-off-white/60 hover:text-acid-lime transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" /> Back to State
                    </Link>
                    <h1 className="font-serif text-4xl italic">District {params.id}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-mono flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Status: Operational
                    </div>
                </div>
            </header>

            {/* Canvas & Sidebar Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">

                {/* Main Canvas */}
                <div className="lg:col-span-3 h-full relative group">
                    <div className="absolute top-4 left-4 z-10 bg-stone-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded-lg text-xs text-off-white/60">
                        INTERACTIVE MAP • ZOOM/PAN ENABLED
                    </div>
                    <DistrictMap />
                </div>

                {/* Sidebar Stats */}
                <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    <BentoCard
                        title="District Insights"
                        icon={<TrendingUp className="text-acid-lime" />}
                        className="min-h-[180px]"
                        glow
                    >
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-off-white/60">Avg. Performance</span>
                                <span className="font-mono text-xl">88%</span>
                            </div>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-acid-lime w-[88%]" />
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard
                        title="Active Alerts"
                        icon={<AlertTriangle className="text-red-400" />}
                        className="min-h-[160px]"
                    >
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg text-xs flex items-center gap-2 text-red-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                Roosevelt Elem: Low Math Scores
                            </div>
                            <div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded-lg text-xs flex items-center gap-2 text-orange-200">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                Adams Element: Staff Shortage
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard
                        title="Quick Actions"
                        icon={<Users className="text-blue-400" />}
                        className="flex-1"
                    >
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors border border-white/5">
                                Generate Report
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors border border-white/5">
                                Email Principals
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-colors border border-white/5 col-span-2">
                                Schedule Review
                            </button>
                        </div>
                    </BentoCard>
                </div>

            </div>
        </PageTransition>
    );
}
