'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { useDataStore } from '@/lib/stores';
import { Building2, Users, GraduationCap, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function DistrictsPage() {
    const districts = useDataStore((state) => Object.values(state.districts));
    const schools = useDataStore((state) => state.schools);

    const districtCards = useMemo(() => {
        return districts.map(district => {
            const districtSchools = district.schools
                .map(id => schools[id])
                .filter(Boolean);
            const avgAttendance = districtSchools.length > 0
                ? Math.round(districtSchools.reduce((sum, s) => sum + s.attendance, 0) / districtSchools.length)
                : 0;

            return { ...district, schoolCount: districtSchools.length, avgAttendance };
        });
    }, [districts, schools]);

    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen max-w-7xl mx-auto flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-4">
                <BackLink href="/" label="Back to Dashboard" />
                <div>
                    <h1 className="font-serif text-4xl italic">Districts</h1>
                    <p className="text-off-white/60 text-sm mt-1">
                        {districts.length} districts • {Object.keys(schools).length} schools total
                    </p>
                </div>
            </div>

            {/* District Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {districtCards.map((district) => {
                    const statusColor = district.status === 'alert' ? 'text-red-400'
                        : district.status === 'warning' ? 'text-orange-400'
                        : 'text-acid-lime';

                    return (
                        <Link key={district.id} href={`/district/${district.id}`}>
                            <BentoCard
                                className="h-full hover:scale-[1.01] transition-transform cursor-pointer"
                                glow
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-acid-lime/10 border border-acid-lime/20 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-acid-lime" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl italic text-off-white">{district.name}</h3>
                                            <p className="text-xs text-off-white/40">{district.schoolCount} schools</p>
                                        </div>
                                    </div>
                                    <div className={cn("px-2 py-1 rounded-full border text-xs font-mono uppercase tracking-wider",
                                        district.status === 'good' && "bg-acid-lime/10 border-acid-lime/20 text-acid-lime",
                                        district.status === 'warning' && "bg-orange-400/10 border-orange-400/20 text-orange-400",
                                        district.status === 'alert' && "bg-red-400/10 border-red-400/20 text-red-400",
                                    )}>
                                        {district.status}
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                        <TrendingUp className={cn("w-3.5 h-3.5 mx-auto mb-1", statusColor)} />
                                        <span className={cn("text-lg font-mono font-bold block", statusColor)}>
                                            {district.performance}%
                                        </span>
                                        <span className="text-[10px] text-off-white/40 uppercase">Perf</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                        <GraduationCap className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                                        <span className="text-lg font-mono font-bold block">
                                            {district.totalStudents.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-off-white/40 uppercase">Students</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                        <Users className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                                        <span className="text-lg font-mono font-bold block">
                                            {district.totalTeachers}
                                        </span>
                                        <span className="text-[10px] text-off-white/40 uppercase">Teachers</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                        <Users className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                                        <span className="text-lg font-mono font-bold block">
                                            {district.avgAttendance}%
                                        </span>
                                        <span className="text-[10px] text-off-white/40 uppercase">Attend</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end text-xs text-off-white/40 hover:text-acid-lime transition-colors">
                                    View District <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </BentoCard>
                        </Link>
                    );
                })}
            </div>
        </PageTransition>
    );
}
