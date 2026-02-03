'use client';

import { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    ReferenceDot,
} from 'recharts';
import type { PerformanceSnapshot } from '@/lib/stores/data-store';

interface PerformanceHistoryProps {
    data: PerformanceSnapshot[];
    primaryLabel?: string;
    secondaryLabel?: string;
    height?: number;
    /** Domain min for y-axis. If not provided, auto-calculated from data. */
    domainMin?: number;
    /** Domain max for y-axis. If not provided, auto-calculated from data. */
    domainMax?: number;
}

export function PerformanceHistory({
    data,
    primaryLabel = 'Performance',
    secondaryLabel,
    height = 200,
    domainMin,
    domainMax,
}: PerformanceHistoryProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!mounted || data.length === 0) {
        return <div className="w-full rounded-lg bg-white/5 animate-pulse" style={{ height }} />;
    }

    // Calculate domain from data
    const allValues = data.flatMap(d => [d.value, ...(d.secondary !== undefined ? [d.secondary] : [])]);
    const minVal = domainMin ?? Math.floor(Math.min(...allValues) - 2);
    const maxVal = domainMax ?? Math.ceil(Math.max(...allValues) + 2);

    const eventPoints = data.filter(d => d.event);
    const hasSecondary = data.some(d => d.secondary !== undefined);
    const uid = `ph-${data[0]?.month}-${data.length}`;

    return (
        <div className="w-full flex flex-col gap-2">
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`grad-primary-${uid}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4F268" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#D4F268" stopOpacity={0} />
                            </linearGradient>
                            {hasSecondary && (
                                <linearGradient id={`grad-secondary-${uid}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                </linearGradient>
                            )}
                        </defs>
                        <XAxis
                            dataKey="month"
                            tick={{ fill: 'rgba(231,229,228,0.4)', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[minVal, maxVal]}
                            tick={{ fill: 'rgba(231,229,228,0.4)', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.[0]) return null;
                                const entry = payload[0].payload as PerformanceSnapshot;
                                return (
                                    <div className="bg-stone-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
                                        <p className="text-off-white/60 mb-1 font-bold">{label}</p>
                                        <p className="text-acid-lime font-mono">
                                            {primaryLabel}: {entry.value.toFixed(1)}
                                        </p>
                                        {entry.secondary !== undefined && secondaryLabel && (
                                            <p className="text-cyan-400 font-mono">
                                                {secondaryLabel}: {entry.secondary}%
                                            </p>
                                        )}
                                        {entry.event && (
                                            <p className="text-orange-300 mt-1 border-t border-white/10 pt-1">
                                                {entry.event}
                                            </p>
                                        )}
                                    </div>
                                );
                            }}
                        />
                        {hasSecondary && (
                            <Area
                                type="monotone"
                                dataKey="secondary"
                                stroke="#22D3EE"
                                strokeWidth={1.5}
                                strokeDasharray="4 4"
                                fillOpacity={1}
                                fill={`url(#grad-secondary-${uid})`}
                                name="secondary"
                            />
                        )}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#D4F268"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#grad-primary-${uid})`}
                            name="value"
                            dot={{ r: 3, fill: '#D4F268', strokeWidth: 0 }}
                        />
                        {/* Event markers */}
                        {eventPoints.map((pt, i) => (
                            <ReferenceDot
                                key={i}
                                x={pt.month}
                                y={pt.value}
                                r={5}
                                fill="#FB923C"
                                stroke="#0C0A09"
                                strokeWidth={2}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] text-off-white/40">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full bg-acid-lime" />
                    {primaryLabel}
                </div>
                {hasSecondary && secondaryLabel && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-0.5 rounded-full bg-cyan-400" style={{ background: 'repeating-linear-gradient(90deg, #22D3EE, #22D3EE 2px, transparent 2px, transparent 4px)' }} />
                        {secondaryLabel}
                    </div>
                )}
                {eventPoints.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        Milestone
                    </div>
                )}
            </div>
        </div>
    );
}
