'use client';

import { motion } from 'framer-motion';
import { Target, BookOpen, Calculator, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SchoolGoals } from '@/lib/stores';

interface GoalsDashboardProps {
    goals: SchoolGoals;
    className?: string;
}

const goalConfig = {
    reading: {
        label: 'Reading',
        icon: BookOpen,
        description: 'Reading proficiency target',
    },
    math: {
        label: 'Math',
        icon: Calculator,
        description: 'Math proficiency target',
    },
    attendance: {
        label: 'Attendance',
        icon: Calendar,
        description: 'Daily attendance rate',
    },
    tutoringEngagement: {
        label: 'Tutoring',
        icon: Users,
        description: 'Student tutoring engagement',
    },
};

export function GoalsDashboard({ goals, className }: GoalsDashboardProps) {
    const goalEntries = Object.entries(goals) as [keyof SchoolGoals, { current: number; target: number }][];

    return (
        <motion.div
            className={cn(
                "p-4 bg-white/5 border border-white/10 rounded-2xl",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-acid-lime" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">School Goals</h3>
                </div>
                <span className="text-[10px] text-off-white/40 uppercase tracking-widest">FY 2025</span>
            </div>

            {/* Goals grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {goalEntries.map(([key, value], index) => {
                    const config = goalConfig[key];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={key}
                            className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: index * 0.1,
                                duration: 0.4,
                                type: 'spring',
                            }}
                        >
                            {/* Progress Ring */}
                            <ProgressRing
                                current={value.current}
                                target={value.target}
                                size={72}
                                strokeWidth={6}
                                showPercentage={true}
                                animate={true}
                                displayValue={value.current}
                            />

                            {/* Label */}
                            <div className="mt-3 flex items-center gap-1.5">
                                <Icon className="w-3.5 h-3.5 text-off-white/40 group-hover:text-acid-lime transition-colors" />
                                <span className="text-xs font-medium">{config.label}</span>
                            </div>

                            {/* Target */}
                            <span className="text-[10px] text-off-white/40 mt-1">
                                Goal: {value.target}%
                            </span>

                            {/* Hover tooltip showing actual values */}
                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-off-white/60">
                                    {value.current}% / {value.target}%
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-off-white/40">
                <span>
                    {goalEntries.filter(([, v]) => v.current >= v.target).length} of {goalEntries.length} goals achieved
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-acid-lime inline-block" />
                    On track for year-end targets
                </span>
            </div>
        </motion.div>
    );
}
