'use client';

import { motion } from 'framer-motion';
import { Building2, Users, GraduationCap, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { School } from '@/lib/stores/data-store';

interface SchoolCardProps {
    school: School;
    index: number;
}

export function SchoolCard({ school, index }: SchoolCardProps) {
    // Determine status color
    const statusColor = school.status === 'alert' ? 'text-red-400' :
        school.status === 'warning' ? 'text-orange-400' :
            'text-acid-lime';

    const statusBg = school.status === 'alert' ? 'bg-red-500/10 border-red-500/20' :
        school.status === 'warning' ? 'bg-orange-500/10 border-orange-500/20' :
            'bg-acid-lime/10 border-acid-lime/20';

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--glow-x', `${x}px`);
        e.currentTarget.style.setProperty('--glow-y', `${y}px`);
        e.currentTarget.style.setProperty('--glow-intensity', '1');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="group relative h-[320px] w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--glow-intensity', '0');
            }}
            style={{
                '--glow-radius': '300px',
            } as React.CSSProperties}
        >
            <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(212,242,104,0.1)]">

                {/* Glow Element */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
                    style={{
                        padding: '1px',
                        background: `radial-gradient(
                            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                            rgba(212, 242, 104, calc(var(--glow-intensity) * 0.5)) 0%,
                            rgba(212, 242, 104, calc(var(--glow-intensity) * 0.1)) 40%,
                            transparent 80%
                        )`,
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        borderRadius: 'inherit'
                    }}
                />

                {/* Header Image / Pattern Area */}
                <div className="h-28 w-full bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden z-10">
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '16px 16px' }}
                    />

                    {/* Status Badge */}
                    <div className={cn("absolute top-4 right-4 px-2 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5", statusBg, statusColor)}>
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", school.status === 'alert' ? 'bg-red-500' : school.status === 'warning' ? 'bg-orange-500' : 'bg-acid-lime')} />
                        {school.status}
                    </div>

                    {/* School Icon */}
                    <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-xl bg-stone-900 border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="w-6 h-6 text-off-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="pt-8 px-6 pb-6 flex flex-col h-[calc(100%-7rem)] relative z-10">
                    <div className="mb-4">
                        <h3 className="font-serif text-xl text-off-white group-hover:text-acid-lime transition-colors truncate">
                            {school.name}
                        </h3>
                        <p className="text-xs text-off-white/40 mt-1 flex items-center gap-2">
                            <span>Principal {school.principal}</span>
                            <span>•</span>
                            <span>Grade {school.grade}</span>
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-auto">
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                            <div className="flex items-center gap-1.5 text-off-white/40 mb-1">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-[10px] uppercase">Perf</span>
                            </div>
                            <span className={cn("text-lg font-mono font-medium", statusColor)}>
                                {school.performance}%
                            </span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                            <div className="flex items-center gap-1.5 text-off-white/40 mb-1">
                                <Users className="w-3 h-3" />
                                <span className="text-[10px] uppercase">Students</span>
                            </div>
                            <span className="text-lg font-mono font-medium text-off-white">
                                {school.students}
                            </span>
                        </div>
                    </div>

                    {/* Action */}
                    <Link
                        href={`/school/${school.id}`}
                        className="mt-4 w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-xs text-off-white group-hover:text-acid-lime"
                    >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
