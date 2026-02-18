'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { BackLink } from '@/components/navigation';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useDataStore, Teacher } from '@/lib/stores';
import { Users, AlertCircle, Star, Filter, LayoutGrid, TableProperties } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function TeachersPage() {
    const teachers = useDataStore((state) => Object.values(state.teachers));
    const schools = useDataStore((state) => state.schools);
    const router = useRouter();
    const [filterSchool, setFilterSchool] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

    const tableColumns: Column<Teacher>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Teacher',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif italic border",
                        row.status === 'flagged'
                            ? "bg-orange-400/20 border-orange-400/40 text-orange-200"
                            : "bg-acid-lime/20 border-acid-lime/40 text-acid-lime"
                    )}>
                        {row.initials}
                    </div>
                    <div>
                        <span className="font-medium text-off-white">{row.name}</span>
                        <p className="text-[10px] text-off-white/40">{row.role}</p>
                    </div>
                </div>
            ),
            getValue: (row) => row.name,
        },
        {
            key: 'school',
            header: 'School',
            render: (row) => <span className="text-off-white/70 text-sm">{schools[row.schoolId]?.name ?? '—'}</span>,
            getValue: (row) => schools[row.schoolId]?.name ?? '',
        },
        {
            key: 'rating',
            header: 'Rating',
            width: '100px',
            align: 'center',
            render: (row) => (
                <div className="flex items-center justify-center gap-1">
                    <Star className={cn("w-3 h-3", row.status === 'flagged' ? "text-orange-400" : "text-acid-lime")} />
                    <span className="font-mono text-sm">{row.rating.toFixed(1)}</span>
                </div>
            ),
            getValue: (row) => row.rating,
        },
        {
            key: 'classes',
            header: 'Classes',
            width: '80px',
            align: 'center',
            render: (row) => <span className="text-off-white/70">{row.classes}</span>,
            getValue: (row) => row.classes,
        },
        {
            key: 'students',
            header: 'Students',
            width: '90px',
            align: 'center',
            render: (row) => <span className="text-off-white/70">{row.studentCount}</span>,
            getValue: (row) => row.studentCount,
        },
        {
            key: 'status',
            header: 'Status',
            width: '130px',
            align: 'center',
            render: (row) => {
                const statusMap: Record<string, string> = {
                    'active': 'text-green-400 bg-green-400/10 border-green-400/20',
                    'flagged': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
                    'inactive': 'text-off-white/40 bg-white/5 border-white/10',
                };
                return (
                    <span className={cn("px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide", statusMap[row.status] ?? statusMap.inactive)}>
                        {row.status === 'flagged' ? 'Needs Attention' : row.status}
                    </span>
                );
            },
            getValue: (row) => row.status,
        },
    ], [schools]);

    return (
        <PageTransition className="p-4 md:p-8 pt-32 min-h-screen max-w-7xl mx-auto flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-4">
                <BackLink href="/" label="Back to Dashboard" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-4xl italic">Teachers</h1>
                        <p className="text-off-white/60 text-sm mt-1">
                            {sortedTeachers.length} teachers • {sortedTeachers.filter(t => t.status === 'flagged').length} require attention
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

            {/* Teachers View */}
            {viewMode === 'table' ? (
                <DataTable<Teacher>
                    data={sortedTeachers}
                    columns={tableColumns}
                    keyExtractor={(row) => row.id}
                    onRowClick={(row) => router.push(`/teacher/${row.id}`)}
                    searchable
                    searchPlaceholder="Search teachers..."
                    searchKeys={['name', 'role']}
                    pageSize={15}
                    emptyMessage="No teachers found"
                    emptyIcon={<Users className="w-10 h-10" />}
                />
            ) : (
                <>
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
                </>
            )}
        </PageTransition>
    );
}
