'use client';
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SchoolNodeData {
    id: string;
    label: string;
    students: number;
    performance: number;
    status: 'good' | 'warning' | 'alert';
}

export default memo(function SchoolNode({ data }: { data: SchoolNodeData }) {
    const router = useRouter();
    const isAlert = data.status === 'alert';

    const handleClick = () => {
        router.push(`/school/${data.id.toLowerCase().replace('sch-', 's')}`);
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "min-w-[240px] bg-stone-black border rounded-xl p-4 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer",
                isAlert ? "border-red-500/50 shadow-red-500/20" : "border-white/10 hover:border-acid-lime/50"
            )}>
            {/* Target Handle */}
            <Handle type="target" position={Position.Top} className="!bg-off-white/20 !w-3 !h-1 !rounded-full !min-h-[4px]" />

            <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col">
                    <span className="text-xs font-mono text-off-white/40 uppercase tracking-widest">{data.id}</span>
                    <h3 className="text-lg font-serif italic text-off-white">{data.label}</h3>
                </div>
                {isAlert && <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />}
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
                        <TrendingUp className={cn("w-3 h-3", isAlert ? "text-red-400" : "text-acid-lime")} />
                        <span className="text-sm font-mono">{data.performance}%</span>
                    </div>
                </div>
            </div>

            {/* Source Handle */}
            <Handle type="source" position={Position.Bottom} className="!bg-off-white/20 !w-3 !h-1 !rounded-full !min-h-[4px]" />
        </div>
    );
});

