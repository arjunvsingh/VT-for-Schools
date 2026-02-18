'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useDataStore, Student } from '@/lib/stores';
import { GraduationCap, Filter, Award, LayoutGrid, TableProperties } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function StudentsPage() {
    const students = useDataStore((state) => Object.values(state.students));
    const schools = useDataStore((state) => state.schools);
    const router = useRouter();
    const [filterSchool, setFilterSchool] = useState<string>('all');
    const [filterGrade, setFilterGrade] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    // Sort: at-risk first, then by GPA descending
    const sortedStudents = useMemo(() => {
        let filtered = students;
        if (filterSchool !== 'all') {
            filtered = filtered.filter(s => s.schoolId === filterSchool);
        }
        if (filterGrade !== 'all') {
            filtered = filtered.filter(s => s.grade.toString() === filterGrade);
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(s => s.status === filterStatus);
        }
        return filtered.sort((a, b) => {
            if (a.status === 'at-risk' && b.status !== 'at-risk') return -1;
            if (b.status === 'at-risk' && a.status !== 'at-risk') return 1;
            return b.gpa - a.gpa;
        });
    }, [students, filterSchool, filterGrade, filterStatus]);

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

    const tableColumns: Column<Student>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Student',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif italic border",
                        row.status === 'at-risk'
                            ? "bg-red-400/20 border-red-400/40 text-red-200"
                            : row.status === 'excelling'
                                ? "bg-acid-lime/20 border-acid-lime/40 text-acid-lime"
                                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-200"
                    )}>
                        {row.initials}
                    </div>
                    <div>
                        <span className="font-medium text-off-white">{row.name}</span>
                        <p className="text-[10px] text-off-white/40">{schools[row.schoolId]?.name}</p>
                    </div>
                </div>
            ),
            getValue: (row) => row.name,
        },
        {
            key: 'grade',
            header: 'Grade',
            width: '80px',
            align: 'center',
            render: (row) => <span className="text-off-white/70">{row.grade}</span>,
            getValue: (row) => row.grade,
        },
        {
            key: 'gpa',
            header: 'GPA',
            width: '90px',
            align: 'center',
            render: (row) => (
                <span className={cn(
                    "font-mono font-bold",
                    row.gpa >= 3.5 ? "text-acid-lime" : row.gpa >= 2.5 ? "text-cyan-400" : "text-red-400"
                )}>
                    {row.gpa.toFixed(1)}
                </span>
            ),
            getValue: (row) => row.gpa,
        },
        {
            key: 'status',
            header: 'Status',
            width: '120px',
            align: 'center',
            render: (row) => (
                <span className={cn("px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide", getStatusColor(row.status))}>
                    {row.status.replace('-', ' ')}
                </span>
            ),
            getValue: (row) => row.status,
        },
        {
            key: 'riskScore',
            header: 'Risk',
            width: '100px',
            align: 'center',
            render: (row) => {
                const risk = row.riskScore ?? 0;
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full", risk >= 70 ? "bg-red-400" : risk >= 40 ? "bg-orange-400" : "bg-acid-lime")}
                                style={{ width: `${risk}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono text-off-white/50 w-6 text-right">{risk}</span>
                    </div>
                );
            },
            getValue: (row) => row.riskScore ?? 0,
        },
        {
            key: 'badges',
            header: 'Badges',
            width: '80px',
            align: 'center',
            render: (row) => row.badges.length > 0 ? (
                <div className="flex items-center justify-center gap-1">
                    <Award className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-200">{row.badges.length}</span>
                </div>
            ) : <span className="text-off-white/20">—</span>,
            getValue: (row) => row.badges.length,
        },
    ], [schools]);

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

                    {/* Filters + View Toggle */}
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
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-acid-lime/50"
                        >
                            <option value="all">All Statuses</option>
                            <option value="at-risk">At Risk</option>
                            <option value="on-track">On Track</option>
                            <option value="excelling">Excelling</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex rounded-lg border border-white/10 overflow-hidden ml-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === 'grid' ? "bg-acid-lime/20 text-acid-lime" : "text-off-white/40 hover:bg-white/5"
                                )}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === 'table' ? "bg-acid-lime/20 text-acid-lime" : "text-off-white/40 hover:bg-white/5"
                                )}
                                aria-label="Table view"
                            >
                                <TableProperties className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Students View */}
            {viewMode === 'table' ? (
                <DataTable<Student>
                    data={sortedStudents}
                    columns={tableColumns}
                    keyExtractor={(row) => row.id}
                    onRowClick={(row) => router.push(`/student/${row.id}`)}
                    searchable
                    searchPlaceholder="Search students..."
                    searchKeys={['name']}
                    pageSize={15}
                    emptyMessage="No students found"
                    emptyIcon={<GraduationCap className="w-10 h-10" />}
                />
            ) : (
                <>
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
                </>
            )}
        </PageTransition>
    );
}
