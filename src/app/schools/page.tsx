'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Sparkles, AlertTriangle, ArrowRight, MessageSquare, UserCheck, TrendingDown, Zap } from 'lucide-react';
import { useDataStore } from '@/lib/stores/data-store';
import { SchoolGrid } from '@/components/school/SchoolGrid';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTransitionNavigate } from '@/components/layout/TransitionOverlay';

export default function SchoolsPage() {
    const schools = useDataStore((state) => state.schools);
    const navigate = useTransitionNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'good' | 'warning' | 'alert'>('all');

    // Filter logic
    const filteredSchools = useMemo(() => {
        return Object.values(schools).filter(school => {
            const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                school.principal.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || school.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [schools, searchQuery, filterStatus]);

    // Count stats
    const stats = useMemo(() => {
        const total = Object.values(schools).length;
        const alert = Object.values(schools).filter(s => s.status === 'alert').length;
        const warning = Object.values(schools).filter(s => s.status === 'warning').length;
        return { total, alert, warning };
    }, [schools]);

    // Get schools that need attention for AI insights
    const alertSchools = useMemo(() => Object.values(schools).filter(s => s.status === 'alert'), [schools]);
    const warningSchools = useMemo(() => Object.values(schools).filter(s => s.status === 'warning'), [schools]);

    return (
        <main className="min-h-screen w-full bg-stone-black text-off-white flex flex-col pt-24 pb-8 px-4 md:px-8 overflow-x-hidden">

            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8 relative z-10 max-w-7xl mx-auto w-full">

                <Link href="/" className="inline-flex items-center gap-2 text-off-white/40 hover:text-acid-lime transition-colors w-fit group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="font-serif text-4xl md:text-6xl italic leading-tight mb-2">
                            District <span className="text-acid-lime">Schools</span>
                        </h1>
                        <p className="text-off-white/60 max-w-md">
                            Monitor performance, attendance, and resource allocation across {stats.total} campuses.
                        </p>
                    </div>

                    {/* Stats Pills - Clickable Filters */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilterStatus(filterStatus === 'alert' ? 'all' : 'alert')}
                            className={cn(
                                "px-4 py-2 rounded-lg border flex flex-col items-center min-w-[80px] transition-all duration-200 cursor-pointer",
                                filterStatus === 'alert'
                                    ? "bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                    : "bg-red-500/10 border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30"
                            )}
                        >
                            <span className="text-xl font-mono font-bold text-red-400 leading-none">{stats.alert}</span>
                            <span className="text-[10px] uppercase text-red-300/60">Critical</span>
                        </button>
                        <button
                            onClick={() => setFilterStatus(filterStatus === 'warning' ? 'all' : 'warning')}
                            className={cn(
                                "px-4 py-2 rounded-lg border flex flex-col items-center min-w-[80px] transition-all duration-200 cursor-pointer",
                                filterStatus === 'warning'
                                    ? "bg-orange-500/20 border-orange-500/50 shadow-[0_0_15px_rgba(251,146,60,0.3)]"
                                    : "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15 hover:border-orange-500/30"
                            )}
                        >
                            <span className="text-xl font-mono font-bold text-orange-400 leading-none">{stats.warning}</span>
                            <span className="text-[10px] uppercase text-orange-300/60">Warning</span>
                        </button>
                    </div>
                </div>

                {/* AI Insights Summary */}
                {(stats.alert > 0 || stats.warning > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-900/50 border border-white/10 backdrop-blur-md relative overflow-hidden"
                    >
                        {/* Background glow effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-acid-lime/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-acid-lime/10">
                                <Sparkles className="w-4 h-4 text-acid-lime" />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-off-white/80">AI Insights</h2>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-acid-lime/10 text-acid-lime border border-acid-lime/20">
                                {stats.alert + stats.warning} Actions Recommended
                            </span>
                        </div>

                        {/* Insights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {/* Critical Alert Insight */}
                            {alertSchools.length > 0 && (
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                            <span className="text-xs font-bold uppercase text-red-300">Critical Alert</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    </div>
                                    <p className="text-sm text-off-white/80 mb-3">
                                        <span className="font-semibold text-red-200">{alertSchools[0]?.name}</span> is experiencing a significant performance drop.
                                        Math scores have declined by 15% this quarter.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/school/${alertSchools[0]?.id}`)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/20 text-red-200 text-xs font-bold hover:bg-red-500/30 transition-colors"
                                        >
                                            <TrendingDown className="w-3 h-3" />
                                            View Details
                                        </button>
                                        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-off-white/60 text-xs hover:bg-white/10 transition-colors">
                                            <MessageSquare className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Staffing Insight */}
                            {warningSchools.length > 0 && (
                                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 hover:bg-orange-500/10 transition-colors group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-orange-400" />
                                            <span className="text-xs font-bold uppercase text-orange-300">Staffing Review</span>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                    </div>
                                    <p className="text-sm text-off-white/80 mb-3">
                                        <span className="font-semibold text-orange-200">{warningSchools[0]?.name}</span> has 3 unfilled teaching positions
                                        affecting student-teacher ratios.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/school/${warningSchools[0]?.id}`)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/20 text-orange-200 text-xs font-bold hover:bg-orange-500/30 transition-colors"
                                        >
                                            <ArrowRight className="w-3 h-3" />
                                            Review Allocation
                                        </button>
                                        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-off-white/60 text-xs hover:bg-white/10 transition-colors">
                                            <MessageSquare className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Quick Action Card */}
                            <div className="p-4 rounded-xl bg-acid-lime/5 border border-acid-lime/20 hover:bg-acid-lime/10 transition-colors group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-acid-lime" />
                                        <span className="text-xs font-bold uppercase text-acid-lime">Quick Actions</span>
                                    </div>
                                </div>
                                <p className="text-sm text-off-white/80 mb-3">
                                    Generate a comprehensive district report or broadcast an alert to all school principals.
                                </p>
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-acid-lime/20 text-acid-lime text-xs font-bold hover:bg-acid-lime/30 transition-colors">
                                        Generate Report
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-off-white/60 text-xs font-bold hover:bg-white/10 transition-colors">
                                        Broadcast Alert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm mt-4">

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-off-white/40" />
                        <input
                            type="text"
                            placeholder="Search by school name or principal..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-stone-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-off-white focus:outline-none focus:border-acid-lime/50 transition-colors placeholder:text-off-white/20"
                        />
                    </div>

                    {/* Filter Toggles */}
                    <div className="flex gap-1 bg-stone-900/50 p-1 rounded-lg border border-white/10 overflow-x-auto">
                        <FilterButton
                            active={filterStatus === 'all'}
                            onClick={() => setFilterStatus('all')}
                            label="All"
                        />
                        <FilterButton
                            active={filterStatus === 'alert'}
                            onClick={() => setFilterStatus('alert')}
                            label="Critical"
                            color="red"
                        />
                        <FilterButton
                            active={filterStatus === 'warning'}
                            onClick={() => setFilterStatus('warning')}
                            label="Warning"
                            color="orange"
                        />
                        <FilterButton
                            active={filterStatus === 'good'}
                            onClick={() => setFilterStatus('good')}
                            label="Good"
                            color="green"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto w-full flex-1 min-h-0">
                <SchoolGrid schools={filteredSchools} />
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-acid-lime/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        </main>
    );
}

function FilterButton({ active, onClick, label, color = 'gray' }: { active: boolean; onClick: () => void; label: string; color?: string }) {
    const activeStyles =
        color === 'red' ? 'bg-red-500/20 text-red-200 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
            color === 'orange' ? 'bg-orange-500/20 text-orange-200 border-orange-500/30' :
                color === 'green' ? 'bg-acid-lime/20 text-acid-lime border-acid-lime/30' :
                    'bg-white/10 text-white border-white/20';

    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 border border-transparent whitespace-nowrap",
                active ? activeStyles : "text-off-white/40 hover:text-off-white hover:bg-white/5"
            )}
        >
            {label}
        </button>
    );
}
