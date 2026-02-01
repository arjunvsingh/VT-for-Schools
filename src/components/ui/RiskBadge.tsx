'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RiskBadgeProps {
    score: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    showScore?: boolean;
    factors?: string[];
    className?: string;
    pulse?: boolean;
}

const riskLevels = [
    { max: 30, label: 'Low Risk', color: 'text-acid-lime', bg: 'bg-acid-lime/10', border: 'border-acid-lime/30' },
    { max: 50, label: 'Moderate', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
    { max: 70, label: 'Elevated', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
    { max: 100, label: 'High Risk', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
];

function getRiskLevel(score: number) {
    return riskLevels.find(level => score <= level.max) || riskLevels[riskLevels.length - 1];
}

export function RiskBadge({
    score,
    size = 'md',
    showScore = true,
    factors = [],
    className,
    pulse = true,
}: RiskBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const level = getRiskLevel(score);
    const isHighRisk = score > 70;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-3 py-1 text-sm gap-1.5',
        lg: 'px-4 py-2 text-base gap-2',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <div className="relative inline-block">
            <motion.div
                className={cn(
                    "inline-flex items-center rounded-full border font-medium relative",
                    sizeClasses[size],
                    level.bg,
                    level.border,
                    level.color,
                    className
                )}
                onMouseEnter={() => factors.length > 0 && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
                {/* Pulse animation for high risk */}
                {isHighRisk && pulse && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-red-400/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}

                {/* Icon */}
                <span className="relative">
                    {isHighRisk ? (
                        <AlertTriangle className={iconSizes[size]} />
                    ) : score > 50 ? (
                        <TrendingDown className={iconSizes[size]} />
                    ) : (
                        <TrendingUp className={iconSizes[size]} />
                    )}
                </span>

                {/* Label and Score */}
                <span className="relative">
                    {level.label}
                    {showScore && ` (${score}%)`}
                </span>

                {/* Info icon for tooltip */}
                {factors.length > 0 && (
                    <Info className={cn(iconSizes[size], "opacity-50")} />
                )}
            </motion.div>

            {/* Tooltip with risk factors */}
            <AnimatePresence>
                {showTooltip && factors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
                    >
                        <div className="bg-warm-charcoal border border-white/10 rounded-lg shadow-xl p-3 min-w-[200px]">
                            <p className="text-xs text-off-white/60 mb-2">Risk Factors:</p>
                            <ul className="space-y-1">
                                {factors.map((factor, i) => (
                                    <li key={i} className="text-sm text-off-white flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        {factor}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
