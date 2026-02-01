'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore, CompareEntity } from '@/lib/stores/compare-store';
import { X, GitCompare, Trash2, School, GraduationCap, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons = {
    school: School,
    teacher: GraduationCap,
    student: Users,
};

// Mock metrics for comparison
function getMetricsForEntity(entity: CompareEntity): Record<string, number> {
    if (entity.metrics) return entity.metrics;

    // Generate mock metrics based on entity type
    const baseMetrics = {
        school: { performance: 85, attendance: 92, enrollment: 1240, alerts: 3 },
        teacher: { rating: 4.2, students: 120, improvement: 12, engagement: 78 },
        student: { gpa: 3.2, attendance: 94, assignments: 87, growth: 15 },
    };

    // Add some variance
    const variance = () => Math.floor(Math.random() * 20) - 10;
    const base = baseMetrics[entity.type];

    return Object.fromEntries(
        Object.entries(base).map(([k, v]) => [k, Math.max(0, v + variance())])
    );
}

function CompareMetric({
    label,
    values,
    reverse = false
}: {
    label: string;
    values: number[];
    reverse?: boolean;
}) {
    const max = Math.max(...values);
    const min = Math.min(...values);

    return (
        <div className="grid gap-2" style={{ gridTemplateColumns: `1fr repeat(${values.length}, 80px)` }}>
            <span className="text-sm text-off-white/60 capitalize">{label}</span>
            {values.map((value, i) => {
                const isHighest = value === max;
                const isLowest = value === min;
                const isBest = reverse ? isLowest : isHighest;
                const isWorst = reverse ? isHighest : isLowest;

                return (
                    <div
                        key={i}
                        className={cn(
                            "flex items-center justify-center gap-1 px-2 py-1 rounded text-sm font-mono",
                            isBest && values.length > 1 && "bg-acid-lime/20 text-acid-lime",
                            isWorst && values.length > 1 && "bg-red-400/20 text-red-400",
                            !isBest && !isWorst && "bg-white/5 text-off-white"
                        )}
                    >
                        {value}
                        {values.length > 1 && (
                            <span className="text-xs">
                                {isBest && <TrendingUp className="w-3 h-3" />}
                                {isWorst && <TrendingDown className="w-3 h-3" />}
                                {!isBest && !isWorst && <Minus className="w-3 h-3 opacity-50" />}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function CompareDrawer() {
    const { entities, isDrawerOpen, closeDrawer, removeFromCompare, clearCompare } = useCompareStore();

    if (entities.length === 0) return null;

    const allMetrics = entities.map(getMetricsForEntity);
    const metricKeys = Object.keys(allMetrics[0] || {});

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDrawer}
                        className="fixed inset-0 bg-stone-black/50 backdrop-blur-sm z-[150]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-warm-charcoal border-l border-white/10 z-[151] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <GitCompare className="w-5 h-5 text-acid-lime" />
                                <h2 className="text-lg font-bold">Compare {entities.length} Items</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearCompare}
                                    className="p-2 rounded-lg hover:bg-white/10 text-off-white/60 hover:text-red-400 transition-colors"
                                    title="Clear all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={closeDrawer}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Entities Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="grid gap-2" style={{ gridTemplateColumns: `1fr repeat(${entities.length}, 80px)` }}>
                                <span className="text-sm text-off-white/40 uppercase tracking-wider">Metric</span>
                                {entities.map((entity) => {
                                    const Icon = typeIcons[entity.type];
                                    return (
                                        <div key={entity.id} className="flex flex-col items-center gap-1">
                                            <div className="relative group">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-acid-lime" />
                                                </div>
                                                <button
                                                    onClick={() => removeFromCompare(entity.id)}
                                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="text-xs text-off-white/60 truncate max-w-[80px] text-center">
                                                {entity.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Metrics Comparison */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-3">
                                {metricKeys.map((key) => (
                                    <CompareMetric
                                        key={key}
                                        label={key}
                                        values={allMetrics.map(m => m[key])}
                                        reverse={key === 'alerts'} // Lower is better for alerts
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 text-center">
                            <p className="text-xs text-off-white/40">
                                Add up to 3 items to compare by clicking "Compare" on any card
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Mini floating indicator when drawer is closed but items are selected
export function CompareIndicator() {
    const { entities, openDrawer } = useCompareStore();

    if (entities.length === 0) return null;

    return (
        <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            onClick={openDrawer}
            className="fixed bottom-24 right-6 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-acid-lime text-stone-black font-bold shadow-lg hover:scale-105 transition-transform"
        >
            <GitCompare className="w-4 h-4" />
            <span>Compare ({entities.length})</span>
        </motion.button>
    );
}
