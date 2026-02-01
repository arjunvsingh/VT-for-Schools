'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
    current: number;
    target: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showPercentage?: boolean;
    animate?: boolean;
    colorThresholds?: { good: number; warning: number }; // percentages
    displayValue?: number; // Optional: show this value in center instead of calculated percentage
}

export function ProgressRing({
    current,
    target,
    size = 80,
    strokeWidth = 8,
    className,
    showPercentage = true,
    animate = true,
    colorThresholds = { good: 80, warning: 60 },
    displayValue,
}: ProgressRingProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const percentage = Math.min((current / target) * 100, 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    // Determine color based on progress
    const getColor = () => {
        if (percentage >= 100) return { stroke: '#D4F268', glow: 'rgba(212, 242, 104, 0.4)' }; // acid-lime
        if (percentage >= colorThresholds.good) return { stroke: '#22d3ee', glow: 'rgba(34, 211, 238, 0.3)' }; // cyan
        if (percentage >= colorThresholds.warning) return { stroke: '#fb923c', glow: 'rgba(251, 146, 60, 0.3)' }; // orange
        return { stroke: '#f87171', glow: 'rgba(248, 113, 113, 0.3)' }; // red
    };

    const color = getColor();
    const isComplete = percentage >= 100;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
                    animate={mounted ? { strokeDashoffset: offset } : {}}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color.glow})`,
                    }}
                />
            </svg>

            {/* Center content */}
            {showPercentage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={animate ? { opacity: 0, scale: 0.5 } : {}}
                        animate={mounted ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className={cn(
                            "text-lg font-bold",
                            isComplete && "text-acid-lime"
                        )}
                    >
                        {displayValue !== undefined ? displayValue : Math.round(percentage)}%
                    </motion.span>

                    {isComplete && (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="text-[10px] text-acid-lime"
                        >
                            ACHIEVED
                        </motion.span>
                    )}
                </div>
            )}

            {/* Completion celebration effect */}
            {isComplete && mounted && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="absolute inset-0 rounded-full border-2 border-acid-lime"
                />
            )}
        </div>
    );
}
