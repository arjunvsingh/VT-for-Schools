'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { useDataStore } from '@/lib/stores';
import { Users, AlertCircle, Star, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function TeachersPage() {
    const teachers = useDataStore((state) => Object.values(state.teachers));
    const schools = useDataStore((state) => state.schools);
    const [filterSchool, setFilterSchool] = useState<string>('all');

    // Sort: flagged first, then by rating descending
    const sortedTeachers = useMemo(() => {
        let filtered = teachers;
        if (filterSchool !== 'all') {
            filtered = teachers.filter(t => t.schoolId === filterSchool);
        }
        return filtered.sort((a, b) => {
            if (a.status === 'flagged' && b.status !== 'flagged') return -1;
            if (b.status === 'flagged' && a.status !== 'flagged') return 1;
            return b.rating - a.rating;
        });
    }, [teachers, filterSchool]);

    const uniqueSchools = useMemo(() => {
        const schoolIds = [...new Set(teachers.map(t => t.schoolId))];
        return schoolIds.map(id => schools[id]).filter(Boolean);
    }, [teachers, schools]);

    return (
        <PageTransition className="p-4 md:p-8 pt-32 min-h-screen max-w-7xl mx-auto flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-4">
                <BackLink href="/" label="Back to Dashboard" />
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-4xl italic">Teachers</h1>
                        <p className="text-off-white/60 text-sm mt-1">
                            {sortedTeachers.length} teachers • {sortedTeachers.filter(t => t.status === 'flagged').length} require attention
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-off-white/40" />
                        <select
                            value={filterSchool}
                            onChange={(e) => setFilterSchool(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-acid-lime/50"
                        >
                            <option value="all">All Schools</option>
                            {uniqueSchools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTeachers.map((teacher) => {
                    const school = schools[teacher.schoolId];
                    const isFlagged = teacher.status === 'flagged';

                    return (
                        <Link key={teacher.id} href={`/teacher/${teacher.id}`}>
                            <BentoCard
                                className={cn(
                                    "h-full min-h-[200px] hover:scale-[1.02] transition-transform cursor-pointer",
                                    isFlagged && "border-orange-400/50"
                                )}
                                glow={isFlagged}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif italic border",
                                            isFlagged
                                                ? "bg-orange-400/20 border-orange-400/40 text-orange-200"
                                                : "bg-acid-lime/20 border-acid-lime/40 text-acid-lime"
                                        )}>
                                            {teacher.initials}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-off-white">{teacher.name}</h3>
                                            <p className="text-xs text-off-white/60">{teacher.role}</p>
                                        </div>
                                    </div>
                                    {isFlagged && (
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-400/10 border border-orange-400/20">
                                            <AlertCircle className="w-3 h-3 text-orange-400" />
                                            <span className="text-xs text-orange-400">Needs Attention</span>
                                        </div>
                                    )}
                                </div>

                                {/* School */}
                                <p className="text-xs text-off-white/40 mb-3">{school?.name || 'Unknown School'}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 mt-auto">
                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                        <span className="text-xs text-off-white/40 block">Rating</span>
                                        <div className="flex items-center justify-center gap-1 mt-1">
                                            <Star className={cn("w-3 h-3", isFlagged ? "text-orange-400" : "text-acid-lime")} />
                                            <span className="text-sm font-mono">{teacher.rating}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                        <span className="text-xs text-off-white/40 block">Classes</span>
                                        <span className="text-sm font-mono block mt-1">{teacher.classes}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                        <span className="text-xs text-off-white/40 block">Students</span>
                                        <span className="text-sm font-mono block mt-1">{teacher.studentCount}</span>
                                    </div>
                                </div>
                            </BentoCard>
                        </Link>
                    );
                })}
            </div>

            {sortedTeachers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-off-white/40">
                    <Users className="w-12 h-12 mb-4" />
                    <p>No teachers found</p>
                </div>
            )}
        </PageTransition>
    );
}
