'use client';
import { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users, TrendingUp, AlertCircle, Eye, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolNodeData {
    id: string; // display ID (SCH-01)
    schoolId: string; // actual store ID (s1)
    label: string;
    students: number;
    performance: number;
    status: 'good' | 'warning' | 'alert';
    aiSummary?: {
        headline: string;
        details: string[];
    };
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

export default memo(function SchoolNode({ data }: { data: SchoolNodeData }) {
    const router = useRouter();
    const isAlert = data.status === 'alert';
    const isWarning = data.status === 'warning';
    const isSelected = data.isSelected ?? false;

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onSelect) {
            data.onSelect(data.schoolId);
        }
    }, [data]);

    const handleViewDetails = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/school/${data.schoolId}`);
    }, [router, data.schoolId]);

    return (
        <motion.div
            onClick={handleClick}
            layout
            animate={{
                scale: isSelected ? 1.08 : 1,
                zIndex: isSelected ? 50 : 1,
            }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
            }}
            className={cn(
                "min-w-[240px] bg-stone-black border rounded-xl shadow-xl transition-colors duration-300 cursor-pointer",
                isAlert && isSelected
                    ? "border-red-500 shadow-red-500/30"
                    : isAlert
                        ? "border-red-500/50 shadow-red-500/20"
                        : isWarning && isSelected
                            ? "border-orange-500 shadow-orange-500/30"
                            : isWarning
                                ? "border-orange-400/30"
                                : isSelected
                                    ? "border-acid-lime shadow-acid-lime/20"
                                    : "border-white/10 hover:border-acid-lime/50"
            )}
        >
            {/* Target Handle */}
            <Handle type="target" position={Position.Top} className="!bg-off-white/20 !w-3 !h-1 !rounded-full !min-h-[4px]" />

            {/* Main Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-mono text-off-white/40 uppercase tracking-widest">{data.id}</span>
                        <h3 className="text-lg font-serif italic text-off-white">{data.label}</h3>
                    </div>
                    {isAlert && <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />}
                    {isWarning && !isAlert && <AlertCircle className="w-5 h-5 text-orange-400" />}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white/5 rounded-lg p-2 flex flex-col">
                        <span className="text-[10px] text-off-white/40 mb-1">STUDENTS</span>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-acid-lime" />
                            <span className="text-sm font-mono">{data.students}</span>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex flex-col">
                        <span className="text-[10px] text-off-white/40 mb-1">PERF</span>
                        <div className="flex items-center gap-1">
                            <TrendingUp className={cn("w-3 h-3", isAlert ? "text-red-400" : isWarning ? "text-orange-400" : "text-acid-lime")} />
                            <span className="text-sm font-mono">{data.performance}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 border-t border-white/5">
                            {/* AI Summary */}
                            {data.aiSummary && (
                                <div className="mb-3">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Sparkles className={cn(
                                            "w-3 h-3",
                                            isAlert ? "text-red-400" : isWarning ? "text-orange-400" : "text-acid-lime"
                                        )} />
                                        <span className="text-[10px] font-medium text-off-white/60 uppercase">AI Summary</span>
                                    </div>
                                    <p className={cn(
                                        "text-xs leading-relaxed",
                                        isAlert ? "text-red-300" : isWarning ? "text-orange-300" : "text-off-white/80"
                                    )}>
                                        {data.aiSummary.headline}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleViewDetails}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-acid-lime text-stone-black text-xs font-bold hover:bg-acid-lime/90 transition-colors"
                                >
                                    <Eye className="w-3 h-3" />
                                    Details
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // This will trigger via the sidebar's ActionButton
                                    }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                        isAlert
                                            ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
                                            : "bg-white/10 text-off-white hover:bg-white/20 border border-white/10"
                                    )}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    Contact
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Source Handle */}
            <Handle type="source" position={Position.Bottom} className="!bg-off-white/20 !w-3 !h-1 !rounded-full !min-h-[4px]" />
        </motion.div>
    );
});
