'use client';

import { useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandBarStore, useCommandBar } from '@/lib/hooks/useCommandBar';
import { useDataStore } from '@/lib/stores';
import { useRouter } from 'next/navigation';
import {
    Search, Command, Users, GraduationCap, Building2, School,
    ArrowRight, Sparkles, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    type: 'school' | 'teacher' | 'student' | 'district' | 'action' | 'ai';
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    href?: string;
    action?: () => void;
    highlight?: boolean;
}

const typeIcons = {
    school: <School className="w-4 h-4" />,
    teacher: <GraduationCap className="w-4 h-4" />,
    student: <Users className="w-4 h-4" />,
    district: <Building2 className="w-4 h-4" />,
    action: <Sparkles className="w-4 h-4" />,
    ai: <Sparkles className="w-4 h-4 text-acid-lime" />,
};

// AI responses using live data counts
function getAIResponse(query: string, counts: { atRisk: number; flagged: number; totalSchools: number; avgPerformance: number }): SearchResult | null {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('at-risk') || lowerQuery.includes('at risk') || lowerQuery.includes('struggling')) {
        return {
            id: 'ai-risk',
            type: 'ai',
            title: 'Show at-risk students',
            subtitle: `${counts.atRisk} student${counts.atRisk !== 1 ? 's' : ''} need attention`,
            icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
            href: '/students',
            highlight: true,
        };
    }

    if (lowerQuery.includes('flagged') || (lowerQuery.includes('need') && lowerQuery.includes('support'))) {
        return {
            id: 'ai-flagged',
            type: 'ai',
            title: 'Show flagged teachers',
            subtitle: `${counts.flagged} teacher${counts.flagged !== 1 ? 's' : ''} need attention`,
            icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
            href: '/teachers',
            highlight: true,
        };
    }

    if (lowerQuery.includes('compare')) {
        return {
            id: 'ai-compare',
            type: 'ai',
            title: 'Compare schools on Analytics',
            subtitle: 'View side-by-side performance metrics',
            icon: <Sparkles className="w-4 h-4 text-acid-lime" />,
            href: '/analytics',
            highlight: true,
        };
    }

    if (lowerQuery.includes('how') && lowerQuery.includes('district')) {
        return {
            id: 'ai-district',
            type: 'ai',
            title: `District performing at ${counts.avgPerformance}%`,
            subtitle: `${counts.totalSchools} schools operational`,
            icon: <Sparkles className="w-4 h-4 text-acid-lime" />,
            href: '/district/1',
            highlight: true,
        };
    }

    if (lowerQuery.includes('analytics') || lowerQuery.includes('metrics') || lowerQuery.includes('performance')) {
        return {
            id: 'ai-analytics',
            type: 'ai',
            title: 'View District Analytics',
            subtitle: 'KPIs, trends, and subject mastery breakdown',
            icon: <Sparkles className="w-4 h-4 text-acid-lime" />,
            href: '/analytics',
            highlight: true,
        };
    }

    return null;
}

export function CommandBar() {
    const { isOpen, query, close, setQuery } = useCommandBar();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const schools = useDataStore((state) => Object.values(state.schools));
    const teachers = useDataStore((state) => Object.values(state.teachers));
    const students = useDataStore((state) => Object.values(state.students));

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Compute live counts for AI responses
    const aiCounts = useMemo(() => ({
        atRisk: students.filter(s => s.status === 'at-risk').length,
        flagged: teachers.filter(t => t.status === 'flagged').length,
        totalSchools: schools.length,
        avgPerformance: Math.round(schools.reduce((sum, s) => sum + s.performance, 0) / (schools.length || 1)),
    }), [students, teachers, schools]);

    // Generate search results
    const results = useMemo((): SearchResult[] => {
        if (!query.trim()) {
            // Show quick actions when no query
            return [
                { id: 'quick-schools', type: 'action', title: 'View all schools', href: '/schools', icon: typeIcons.school },
                { id: 'quick-teachers', type: 'action', title: 'View all teachers', href: '/teachers', icon: typeIcons.teacher },
                { id: 'quick-students', type: 'action', title: 'View all students', href: '/students', icon: typeIcons.student },
                { id: 'quick-analytics', type: 'action', title: 'View analytics', href: '/analytics', icon: typeIcons.ai },
                { id: 'quick-district', type: 'action', title: 'View district overview', href: '/district/1', icon: typeIcons.district },
            ];
        }

        const searchResults: SearchResult[] = [];
        const lowerQuery = query.toLowerCase();

        // Check for AI response first
        const aiResponse = getAIResponse(query, aiCounts);
        if (aiResponse) {
            searchResults.push(aiResponse);
        }

        // Search schools
        schools
            .filter(s => s.name.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .forEach(s => {
                searchResults.push({
                    id: `school-${s.id}`,
                    type: 'school',
                    title: s.name,
                    subtitle: `${s.students} students • ${s.grade} grade`,
                    icon: typeIcons.school,
                    href: `/school/${s.id}`,
                });
            });

        // Search teachers
        teachers
            .filter(t => t.name.toLowerCase().includes(lowerQuery) || t.department.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .forEach(t => {
                searchResults.push({
                    id: `teacher-${t.id}`,
                    type: 'teacher',
                    title: t.name,
                    subtitle: `${t.department} • ${t.role}`,
                    icon: typeIcons.teacher,
                    href: `/teacher/${t.id}`,
                    highlight: t.status === 'flagged',
                });
            });

        // Search students
        students
            .filter(s => s.name.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .forEach(s => {
                searchResults.push({
                    id: `student-${s.id}`,
                    type: 'student',
                    title: s.name,
                    subtitle: `Grade ${s.grade} • ${s.gpa} GPA`,
                    icon: typeIcons.student,
                    href: `/student/${s.id}`,
                    highlight: s.status === 'at-risk',
                });
            });

        return searchResults.slice(0, 8);
    }, [query, schools, teachers, students, aiCounts]);

    const handleSelect = (result: SearchResult) => {
        if (result.action) {
            result.action();
        } else if (result.href) {
            router.push(result.href);
        }
        close();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={close}
                        className="fixed inset-0 bg-stone-black/80 backdrop-blur-sm z-[200]"
                    />

                    {/* Command Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[201]"
                    >
                        <div className="bg-warm-charcoal border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                                <Search className="w-5 h-5 text-off-white/40 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search or ask a question..."
                                    className="flex-1 bg-transparent text-off-white placeholder:text-off-white/40 focus:outline-none text-lg"
                                />
                                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-off-white/40">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[400px] overflow-y-auto py-2">
                                {results.length === 0 ? (
                                    <div className="px-4 py-8 text-center text-off-white/40">
                                        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No results found</p>
                                        <p className="text-xs mt-1">Try searching for a school, teacher, or student</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {results.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleSelect(result)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors group",
                                                    result.highlight && "bg-acid-lime/5"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                    result.type === 'ai' ? "bg-acid-lime/20" :
                                                        result.highlight ? "bg-orange-400/20" : "bg-white/5"
                                                )}>
                                                    {result.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "font-medium truncate",
                                                        result.type === 'ai' && "text-acid-lime"
                                                    )}>
                                                        {result.title}
                                                    </p>
                                                    {result.subtitle && (
                                                        <p className="text-xs text-off-white/40 truncate">{result.subtitle}</p>
                                                    )}
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-off-white/20 group-hover:text-acid-lime transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-xs text-off-white/40">
                                <span>Type to search • Ask questions in natural language</span>
                                <span>ESC to close</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
