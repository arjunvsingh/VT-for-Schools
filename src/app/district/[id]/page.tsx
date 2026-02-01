'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import DistrictMap from '@/components/district/DistrictMap';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { TrendingUp, AlertTriangle, Users } from 'lucide-react';
import Link from 'next/link';
import { useDataStore } from '@/lib/stores';

export default function DistrictPage({ params }: { params: { id: string } }) {
    const district = useDataStore((state) => state.getDistrict(params.id));
    const schools = useDataStore((state) => state.getSchoolsForDistrict(params.id));

    // Fallback for invalid district ID
    const districtName = district?.name ?? `District ${params.id}`;
    const performance = district?.performance ?? 0;
    const totalStudents = district?.totalStudents ?? 0;
    const status = district?.status ?? 'good';

    // Get schools with alerts
    const alertSchools = schools.filter(s => s.status === 'alert' || s.status === 'warning');

    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen flex flex-col gap-6">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <BackLink href="/" label="Back to State" />
                    <h1 className="font-serif text-4xl italic">{districtName}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-mono flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                        Status: {status === 'good' ? 'Operational' : status === 'warning' ? 'Needs Attention' : 'Critical'}
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
                        className="h-[180px]"
                        glow
                    >
                        <div className="flex-1 w-full h-full bg-gradient-to-br from-acid-lime/5 to-transparent rounded-xl flex flex-col justify-end p-2 gap-2">
                            <div className="flex justify-between items-end">
                                <span className="text-4xl font-serif text-acid-lime">{performance}%</span>
                                <span className="text-xs text-off-white/60 mb-1">Avg. Performance</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-acid-lime shadow-[0_0_10px_rgba(212,242,104,0.5)]" style={{ width: `${performance}%` }} />
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard
                        title="Active Alerts"
                        icon={<AlertTriangle className="text-red-400" />}
                        className="h-[160px]"
                        glow
                    >
                        <div className="flex flex-col gap-2 mt-auto">
                            <Link href="/school/s2" className="flex items-center gap-3 p-2 rounded-lg bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-red-100 font-medium">Roosevelt Elem</span>
                                    <span className="text-[10px] text-red-400/60">Low Math Scores</span>
                                </div>
                            </Link>
                            <Link href="/school/s5" className="flex items-center gap-3 p-2 rounded-lg bg-orange-400/5 border border-orange-400/10 hover:bg-orange-400/10 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-orange-100 font-medium">Adams Element</span>
                                    <span className="text-[10px] text-orange-400/60">Staff Shortage</span>
                                </div>
                            </Link>
                        </div>
                    </BentoCard>

                    <BentoCard
                        title="Quick Actions"
                        icon={<Users className="text-blue-400" />}
                        className="h-[140px]"
                        glow
                    >
                        <div className="grid grid-cols-2 gap-2 mt-auto h-full content-end">
                            <button className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 hover:text-acid-lime rounded-lg text-xs transition-all border border-white/5">
                                Report
                            </button>
                            <button className="flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 hover:text-acid-lime rounded-lg text-xs transition-all border border-white/5">
                                Email
                            </button>
                            <button className="col-span-2 flex items-center justify-center p-2 bg-acid-lime/10 hover:bg-acid-lime/20 text-acid-lime border border-acid-lime/20 rounded-lg text-xs transition-all">
                                Schedule Review
                            </button>
                        </div>
                    </BentoCard>
                </div>

            </div>
        </PageTransition>
    );
}
