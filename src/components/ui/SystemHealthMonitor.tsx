'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Building2, GraduationCap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Types derived from store but kept local for component flexibility
interface HealthSchool {
    id: string;
    name: string;
    status: 'good' | 'warning' | 'alert';
    principal: string;
    performance: number; // 0-100
    issue?: string;
}

interface HealthTeacher {
    id: string;
    name: string;
    schoolName: string;
    status: 'active' | 'flagged' | 'inactive';
    rating: number; // 0-5
    issue?: string;
}

interface SystemHealthMonitorProps {
    schools: HealthSchool[];
    teachers: HealthTeacher[];
    className?: string;
}

type Tab = 'schools' | 'teachers';

export function SystemHealthMonitor({ schools, teachers, className }: SystemHealthMonitorProps) {
    const [activeTab, setActiveTab] = useState<Tab>('schools');

    // Filter for critical entities
    const criticalSchools = useMemo(() => {
        return schools
            .filter(s => s.status === 'alert' || s.status === 'warning')
            .sort((a, b) => (a.status === 'alert' ? -1 : 1)); // Alert first
    }, [schools]);

    const criticalTeachers = useMemo(() => {
        return teachers
            .filter(t => t.status === 'flagged')
            .sort((a, b) => a.rating - b.rating); // Lowest rating first
    }, [teachers]);

    const stats = useMemo(() => {
        return {
            schools: criticalSchools.length,
            teachers: criticalTeachers.length,
        };
    }, [criticalSchools, criticalTeachers]);

    const activeList = activeTab === 'schools' ? criticalSchools : criticalTeachers;

    return (
        <div className={cn("w-full h-full flex flex-col gap-4", className)}>

            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-1">
                <div className="flex gap-1 p-0.5 bg-white/5 rounded-lg">
                    <button
                        onClick={() => setActiveTab('schools')}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                            activeTab === 'schools'
                                ? "bg-stone-800 text-off-white shadow-sm"
                                : "text-off-white/40 hover:text-off-white/60"
                        )}
                    >
                        <Building2 className="w-3 h-3" />
                        Schools
                        {stats.schools > 0 && (
                            <span className="bg-red-500/20 text-red-300 px-1.5 rounded-full text-[10px]">
                                {stats.schools}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={cn(
                            "px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                            activeTab === 'teachers'
                                ? "bg-stone-800 text-off-white shadow-sm"
                                : "text-off-white/40 hover:text-off-white/60"
                        )}
                    >
                        <GraduationCap className="w-3 h-3" />
                        Teachers
                        {stats.teachers > 0 && (
                            <span className="bg-orange-500/20 text-orange-300 px-1.5 rounded-full text-[10px]">
                                {stats.teachers}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* List - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {activeList.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                        >
                            {/* Status Line */}
                            <div className={cn(
                                "absolute left-0 top-3 bottom-3 w-0.5 rounded-full",
                                activeTab === 'schools'
                                    ? (item as HealthSchool).status === 'alert' ? 'bg-red-500' : 'bg-orange-500'
                                    : 'bg-orange-500' // Teachers generally warning level
                            )} />

                            {/* Icon */}
                            <div className="w-8 h-8 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center text-xs text-off-white font-medium shrink-0 group-hover:border-acid-lime/50 transition-colors">
                                {activeTab === 'schools' ? (
                                    <Building2 className="w-4 h-4 text-off-white/40" />
                                ) : (
                                    <div className="text-[10px] font-bold">{(item as HealthTeacher).rating}</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-off-white truncate group-hover:text-acid-lime transition-colors">
                                        {item.name}
                                    </h4>
                                </div>
                                <p className="text-xs text-off-white/40 truncate">
                                    {activeTab === 'schools'
                                        ? `Principal: ${(item as HealthSchool).principal}`
                                        : `${(item as HealthTeacher).schoolName}`}
                                </p>
                            </div>

                            {/* Issue Tag */}
                            <div className={cn(
                                "text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-off-white/50 whitespace-nowrap",
                                activeTab === 'schools' && (item as HealthSchool).status === 'alert' && "bg-red-500/10 text-red-300 border-red-500/20"
                            )}>
                                {item.issue || 'Requires Review'}
                            </div>

                            {/* Hover Action */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-stone-900 shadow-xl rounded-md border border-white/10 p-1 flex gap-1 z-10">
                                <Link href={activeTab === 'schools' ? `/school/${item.id}` : `/teacher/${item.id}`}>
                                    <button className="p-1.5 hover:bg-white/10 rounded text-off-white/80 hover:text-white">
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {activeList.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-off-white/30 py-8">
                        <span className="text-2xl mb-2">🎉</span>
                        <span className="text-xs">No issues detected</span>
                    </div>
                )}
            </div>

            {/* View All */}
            <Link
                href={activeTab === 'schools' ? "/schools" : "/teachers"}
                className="text-xs text-center text-off-white/40 hover:text-acid-lime transition-colors mt-auto py-1 flex items-center justify-center gap-1 group"
            >
                View all {activeTab}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>
    );
}
