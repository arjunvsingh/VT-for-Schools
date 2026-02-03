'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Arts', 'PE'];
const GRADES = ['9th', '10th', '11th', '12th'];

// Mock data generation
const generateHeatmapData = () => {
    return GRADES.map((grade, gIdx) => ({
        grade,
        scores: SUBJECTS.map((subject, sIdx) => ({
            subject,
            // Deterministic pseudo-random pattern based on indices
            value: 65 + ((gIdx * 7 + sIdx * 13) % 35)
        }))
    }));
};

const DATA = generateHeatmapData();

export default function PerformanceHeatmap() {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2 text-xs text-off-white/40">
                    <span>LOW</span>
                    <div className="w-16 h-2 rounded bg-gradient-to-r from-red-500/40 via-amber-400/35 to-emerald-400/40" />
                    <span>HIGH</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-[auto_1fr] gap-4">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-around text-xs font-mono text-off-white/60 text-right pr-2 border-r border-white/10">
                    {GRADES.map(g => <span key={g}>{g}</span>)}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-6 gap-2">
                    {/* X-Axis Labels (Top) */}
                    {SUBJECTS.map(s => (
                        <div key={s} className="text-center text-xs font-mono text-off-white/40">{s.slice(0, 3)}</div>
                    ))}

                    {/* Data Cells */}
                    {DATA.flatMap((row, rIdx) =>
                        row.scores.map((cell, cIdx) => {
                            // Color logic
                            let colorClass = "bg-emerald-400/30";
                            if (cell.value < 70) colorClass = "bg-red-500/30";
                            else if (cell.value < 85) colorClass = "bg-amber-400/25";

                            return (
                                <motion.div
                                    key={`${rIdx}-${cIdx}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (rIdx * 6 + cIdx) * 0.05 }}
                                    className={cn(
                                        "rounded-md relative group cursor-pointer h-10 lg:h-12 border border-white/5",
                                        colorClass,
                                        "hover:opacity-100 hover:scale-105 transition-all"
                                    )}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-xs font-bold text-off-white">
                                        {cell.value}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
