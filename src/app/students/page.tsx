'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { useDataStore } from '@/lib/stores';
import { GraduationCap, AlertCircle, Filter, Award } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function StudentsPage() {
    const students = useDataStore((state) => Object.values(state.students));
    const schools = useDataStore((state) => state.schools);
    const [filterSchool, setFilterSchool] = useState<string>('all');
    const [filterGrade, setFilterGrade] = useState<string>('all');

    // Sort: at-risk first, then by GPA descending
    const sortedStudents = useMemo(() => {
        let filtered = students;
        if (filterSchool !== 'all') {
            filtered = filtered.filter(s => s.schoolId === filterSchool);
        }
        if (filterGrade !== 'all') {
            filtered = filtered.filter(s => s.grade.toString() === filterGrade);
        }
        return filtered.sort((a, b) => {
            if (a.status === 'at-risk' && b.status !== 'at-risk') return -1;
            if (b.status === 'at-risk' && a.status !== 'at-risk') return 1;
            return b.gpa - a.gpa;
        });
    }, [students, filterSchool, filterGrade]);

    const uniqueSchools = useMemo(() => {
        const schoolIds = [...new Set(students.map(s => s.schoolId))];
        return schoolIds.map(id => schools[id]).filter(Boolean);
    }, [students, schools]);

    const uniqueGrades = useMemo(() => {
        return [...new Set(students.map(s => s.grade))].sort((a, b) => a - b);
    }, [students]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'at-risk': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'on-track': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
            case 'excelling': return 'text-acid-lime bg-acid-lime/10 border-acid-lime/20';
            default: return 'text-off-white/60 bg-white/5 border-white/10';
        }
    };

    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen max-w-7xl mx-auto flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-4">
                <BackLink href="/" label="Back to Dashboard" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-4xl italic">Students</h1>
                        <p className="text-off-white/60 text-sm mt-1">
                            {sortedStudents.length} students • {sortedStudents.filter(s => s.status === 'at-risk').length} at-risk
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
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
                        <select
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-acid-lime/50"
                        >
                            <option value="all">All Grades</option>
                            {uniqueGrades.map(grade => (
                                <option key={grade} value={grade.toString()}>Grade {grade}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedStudents.map((student) => {
                    const school = schools[student.schoolId];
                    const isAtRisk = student.status === 'at-risk';

                    return (
                        <Link key={student.id} href={`/student/${student.id}`}>
                            <BentoCard
                                className={cn(
                                    "h-full min-h-[200px] hover:scale-[1.02] transition-transform cursor-pointer",
                                    isAtRisk && "border-red-400/50"
                                )}
                                glow={isAtRisk}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif italic border",
                                            isAtRisk
                                                ? "bg-red-400/20 border-red-400/40 text-red-200"
                                                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-200"
                                        )}>
                                            {student.initials}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-off-white">{student.name}</h3>
                                            <p className="text-xs text-off-white/60">Grade {student.grade}</p>
                                        </div>
                                    </div>
                                    <div className={cn("px-2 py-1 rounded-full border text-xs capitalize", getStatusColor(student.status))}>
                                        {student.status.replace('-', ' ')}
                                    </div>
                                </div>

                                {/* School */}
                                <p className="text-xs text-off-white/40 mb-3">{school?.name || 'Unknown School'}</p>

                                {/* GPA & Badges */}
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="bg-white/5 rounded-lg px-3 py-2">
                                        <span className="text-xs text-off-white/40 block">GPA</span>
                                        <span className={cn(
                                            "text-xl font-bold",
                                            student.gpa >= 3.5 ? "text-acid-lime" : student.gpa >= 2.5 ? "text-cyan-400" : "text-red-400"
                                        )}>{student.gpa.toFixed(1)}</span>
                                    </div>
                                    {student.badges.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Award className="w-3 h-3 text-yellow-400" />
                                            <span className="text-xs text-yellow-200">{student.badges.length} badge{student.badges.length !== 1 && 's'}</span>
                                        </div>
                                    )}
                                </div>
                            </BentoCard>
                        </Link>
                    );
                })}
            </div>

            {sortedStudents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-off-white/40">
                    <GraduationCap className="w-12 h-12 mb-4" />
                    <p>No students found</p>
                </div>
            )}
        </PageTransition>
    );
}
