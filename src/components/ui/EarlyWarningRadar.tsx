'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionButton } from './ActionButton';
import Link from 'next/link';

interface EarlyWarningStudent {
    id: string;
    name: string;
    initials: string;
    schoolId: string;
    schoolName: string;
    riskScore: number; // 0-100
    riskFactors: string[];
    grade: number;
}

interface EarlyWarningRadarProps {
    students: EarlyWarningStudent[];
    maxStudents?: number;
    className?: string;
    onStudentClick?: (student: EarlyWarningStudent) => void;
}

// Generate position on radar based on risk score
function getRadarPosition(riskScore: number, index: number, total: number): { x: number; y: number } {
    // Higher risk = closer to center
    // Risk 100 = radius 20%, Risk 0 = radius 95%
    const normalizedRadius = 0.95 - (riskScore / 100) * 0.75;

    // Spread students in a spiral pattern
    const angle = (index / total) * Math.PI * 2 + (riskScore / 100) * Math.PI * 0.5;

    const x = 50 + normalizedRadius * 40 * Math.cos(angle);
    const y = 50 + normalizedRadius * 40 * Math.sin(angle);

    return { x, y };
}

function getRiskColor(score: number): { bg: string; border: string; text: string; glow: string } {
    if (score >= 75) return {
        bg: 'bg-red-500',
        border: 'border-red-400',
        text: 'text-red-200',
        glow: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]',
    };
    if (score >= 50) return {
        bg: 'bg-orange-500',
        border: 'border-orange-400',
        text: 'text-orange-200',
        glow: 'shadow-[0_0_8px_rgba(251,146,60,0.5)]',
    };
    if (score >= 30) return {
        bg: 'bg-yellow-500',
        border: 'border-yellow-400',
        text: 'text-yellow-200',
        glow: '',
    };
    return {
        bg: 'bg-cyan-500',
        border: 'border-cyan-400',
        text: 'text-cyan-200',
        glow: '',
    };
}

function StudentDot({
    student,
    position,
    index,
    onHover,
    isActive,
}: {
    student: EarlyWarningStudent;
    position: { x: number; y: number };
    index: number;
    onHover: (student: EarlyWarningStudent | null) => void;
    isActive: boolean;
}) {
    const color = getRiskColor(student.riskScore);
    const isHighRisk = student.riskScore >= 75;

    return (
        <motion.div
            className="absolute"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: index * 0.05,
            }}
        >
            {/* Pulse ring for high risk */}
            {isHighRisk && (
                <motion.div
                    className={cn("absolute inset-0 rounded-full", color.bg, "opacity-30")}
                    animate={{
                        scale: [1, 2, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{ width: '100%', height: '100%' }}
                />
            )}

            {/* Main dot */}
            <motion.button
                className={cn(
                    "relative w-4 h-4 rounded-full border-2 cursor-pointer z-10 transition-transform",
                    color.bg,
                    color.border,
                    color.glow,
                    isActive && "scale-150 ring-2 ring-white/30"
                )}
                whileHover={{ scale: 1.5 }}
                onMouseEnter={() => onHover(student)}
                onMouseLeave={() => onHover(null)}
            >
                {isActive && (
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {student.initials}
                    </motion.span>
                )}
            </motion.button>
        </motion.div>
    );
}

export function EarlyWarningRadar({
    students,
    maxStudents = 20,
    className,
}: EarlyWarningRadarProps) {
    const [hoveredStudent, setHoveredStudent] = useState<EarlyWarningStudent | null>(null);

    // Sort by risk score (highest first) and limit
    const sortedStudents = useMemo(() => {
        return [...students]
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, maxStudents);
    }, [students, maxStudents]);

    // Count by risk level
    const riskCounts = useMemo(() => {
        return {
            high: sortedStudents.filter((s) => s.riskScore >= 75).length,
            elevated: sortedStudents.filter((s) => s.riskScore >= 50 && s.riskScore < 75).length,
            moderate: sortedStudents.filter((s) => s.riskScore >= 30 && s.riskScore < 50).length,
            low: sortedStudents.filter((s) => s.riskScore < 30).length,
        };
    }, [sortedStudents]);

    return (
        <div className={cn("relative w-full aspect-square max-w-[400px]", className)}>
            {/* Radar circles */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* Concentric circles */}
                {[0.85, 0.65, 0.45, 0.25].map((radius, i) => (
                    <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r={radius * 45}
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.5"
                        strokeDasharray={i === 0 ? "none" : "2,2"}
                    />
                ))}

                {/* Cross lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {/* Rotating sweep line */}
                <motion.line
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="5"
                    stroke="url(#sweepGradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{ transformOrigin: '50px 50px' }}
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(212, 242, 104, 0.8)" />
                        <stop offset="100%" stopColor="rgba(212, 242, 104, 0)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
                <AlertTriangle className="w-6 h-6 text-red-400/50 mx-auto mb-1" />
                <span className="text-xs text-off-white/30 uppercase tracking-widest">High Risk</span>
            </div>

            {/* Student dots */}
            {sortedStudents.map((student, index) => {
                const position = getRadarPosition(student.riskScore, index, sortedStudents.length);
                return (
                    <StudentDot
                        key={student.id}
                        student={student}
                        position={position}
                        index={index}
                        onHover={setHoveredStudent}
                        isActive={hoveredStudent?.id === student.id}
                    />
                );
            })}

            {/* Hover tooltip */}
            <AnimatePresence>
                {hoveredStudent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-warm-charcoal/95 backdrop-blur border border-white/10 rounded-xl z-50"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border",
                                    getRiskColor(hoveredStudent.riskScore).bg,
                                    getRiskColor(hoveredStudent.riskScore).border
                                )}>
                                    {hoveredStudent.initials}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{hoveredStudent.name}</h4>
                                    <p className="text-xs text-off-white/60">
                                        Grade {hoveredStudent.grade} • {hoveredStudent.schoolName}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={cn(
                                    "text-2xl font-bold",
                                    getRiskColor(hoveredStudent.riskScore).text
                                )}>
                                    {hoveredStudent.riskScore}
                                </span>
                                <span className="text-xs text-off-white/40 block">Risk Score</span>
                            </div>
                        </div>

                        {/* Risk factors */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {hoveredStudent.riskFactors.slice(0, 3).map((factor, i) => (
                                <span
                                    key={i}
                                    className="text-[10px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-200"
                                >
                                    {factor}
                                </span>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-2">
                            <ActionButton
                                type="schedule_tutoring"
                                entityType="student"
                                entityId={hoveredStudent.id}
                                entityName={hoveredStudent.name}
                                size="sm"
                                variant="secondary"
                            />
                            <ActionButton
                                type="parent_outreach"
                                entityType="student"
                                entityId={hoveredStudent.id}
                                entityName={hoveredStudent.name}
                                size="sm"
                                variant="secondary"
                            />
                            <Link
                                href={`/student/${hoveredStudent.id}`}
                                className="ml-auto flex items-center gap-1 text-xs text-acid-lime hover:underline"
                            >
                                View Profile <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Legend */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    High ({riskCounts.high})
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Elevated ({riskCounts.elevated})
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Moderate ({riskCounts.moderate})
                </span>
            </div>
        </div>
    );
}
