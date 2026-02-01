'use client';

import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { useDataStore } from '@/lib/stores';
import { useGoalsStore } from '@/lib/stores/goals-store';
import {
    Sun, Moon, AlertTriangle, TrendingUp, Users, School,
    Calendar, CheckCircle2, ArrowRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function getGreeting(): { text: string; icon: React.ReactNode } {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: <Sun className="w-6 h-6 text-yellow-400" /> };
    if (hour < 17) return { text: 'Good afternoon', icon: <Sun className="w-6 h-6 text-orange-400" /> };
    return { text: 'Good evening', icon: <Moon className="w-6 h-6 text-indigo-400" /> };
}

export default function DigestPage() {
    const greeting = getGreeting();
    const students = useDataStore((state) => Object.values(state.students));
    const teachers = useDataStore((state) => Object.values(state.teachers));
    const schools = useDataStore((state) => Object.values(state.schools));
    const goals = useGoalsStore((state) => state.goals);

    const atRiskStudents = students.filter(s => s.status === 'at-risk');
    const flaggedTeachers = teachers.filter(t => t.status === 'flagged');
    const goalsAtRisk = goals.filter(g => g.status === 'at-risk');

    const priorities = [
        ...(atRiskStudents.length > 0 ? [{
            id: 'students',
            title: `${atRiskStudents.length} students at risk`,
            description: atRiskStudents.map(s => s.name).join(', '),
            type: 'critical' as const,
            href: '/students?filter=at-risk',
            action: 'Review Students',
        }] : []),
        ...(flaggedTeachers.length > 0 ? [{
            id: 'teachers',
            title: `${flaggedTeachers.length} teachers need support`,
            description: flaggedTeachers.map(t => t.name).join(', '),
            type: 'warning' as const,
            href: '/teachers?filter=flagged',
            action: 'View Teachers',
        }] : []),
        ...(goalsAtRisk.length > 0 ? [{
            id: 'goals',
            title: `${goalsAtRisk.length} goals at risk`,
            description: goalsAtRisk.map(g => g.title).join(', '),
            type: 'warning' as const,
            href: '#goals',
            action: 'Check Goals',
        }] : []),
    ].slice(0, 3);

    const typeColors = {
        critical: 'border-red-500/30 bg-red-500/10',
        warning: 'border-orange-400/30 bg-orange-400/10',
        info: 'border-cyan-400/30 bg-cyan-400/10',
    };

    const typeIcons = {
        critical: <AlertTriangle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        info: <Sparkles className="w-5 h-5 text-cyan-400" />,
    };

    return (
        <PageTransition className="min-h-screen p-4 md:p-8 pt-24 max-w-5xl mx-auto pb-32">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    {greeting.icon}
                    <h1 className="font-serif text-4xl md:text-5xl italic">{greeting.text}, Admin</h1>
                </div>
                <p className="text-off-white/60 text-lg">
                    Here&apos;s your daily briefing for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </motion.header>

            {/* Quick Stats */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <School className="w-6 h-6 text-acid-lime mx-auto mb-2" />
                    <span className="text-2xl font-bold">{schools.length}</span>
                    <p className="text-xs text-off-white/40">Schools</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <span className="text-2xl font-bold">{students.length}</span>
                    <p className="text-xs text-off-white/40">Students</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <TrendingUp className="w-6 h-6 text-acid-lime mx-auto mb-2" />
                    <span className="text-2xl font-bold">88%</span>
                    <p className="text-xs text-off-white/40">Avg Performance</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <span className="text-2xl font-bold">92%</span>
                    <p className="text-xs text-off-white/40">Attendance</p>
                </div>
            </motion.section>

            {/* Priorities */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Today&apos;s Priorities
                </h2>

                {priorities.length === 0 ? (
                    <div className="bg-acid-lime/10 border border-acid-lime/30 rounded-xl p-6 text-center">
                        <CheckCircle2 className="w-12 h-12 text-acid-lime mx-auto mb-3" />
                        <p className="text-lg font-medium text-acid-lime">All clear!</p>
                        <p className="text-sm text-off-white/60 mt-1">No urgent items need your attention today.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {priorities.map((priority, i) => (
                            <motion.div
                                key={priority.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className={`flex items-center justify-between p-4 rounded-xl border ${typeColors[priority.type]}`}
                            >
                                <div className="flex items-center gap-4">
                                    {typeIcons[priority.type]}
                                    <div>
                                        <p className="font-medium">{priority.title}</p>
                                        <p className="text-sm text-off-white/60">{priority.description}</p>
                                    </div>
                                </div>
                                <Link
                                    href={priority.href}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                                >
                                    {priority.action}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>

            {/* Goals Progress */}
            <motion.section
                id="goals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-acid-lime" />
                    Goal Progress
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4"
                        >
                            <ProgressRing
                                current={goal.current}
                                target={goal.target}
                                size={64}
                                strokeWidth={6}
                            />
                            <div className="flex-1">
                                <p className="font-medium">{goal.title}</p>
                                <p className="text-sm text-off-white/60">
                                    {goal.current}{goal.unit} / {goal.target}{goal.unit}
                                </p>
                                <p className="text-xs text-off-white/40 mt-1">
                                    Due: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <RiskBadge
                                score={goal.status === 'achieved' ? 0 : goal.status === 'at-risk' ? 75 : 30}
                                size="sm"
                                showScore={false}
                                pulse={goal.status === 'at-risk'}
                            />
                        </div>
                    ))}
                </div>
            </motion.section>
        </PageTransition>
    );
}
