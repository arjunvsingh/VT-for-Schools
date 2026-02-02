'use client';
import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProjectionGraphProps {
    schoolId?: string;
}

// Generate school-specific data based on ID
function generateSchoolData(schoolId: string) {
    // Use schoolId to create variation in the data
    const seed = schoolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePerformance = 70 + (seed % 20); // 70-90 base
    const volatility = 2 + (seed % 4); // How much it fluctuates
    const growthRate = 0.5 + (seed % 10) / 10; // Growth per month
    const isStruggling = seed % 3 === 0; // Some schools are declining

    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const currentMonthIndex = 4; // December is current (index 4)

    return months.map((month, i) => {
        const trend = isStruggling ? -growthRate : growthRate;
        const noise = Math.sin(seed + i * 2) * volatility;
        const baseValue = basePerformance + (i * trend) + noise;

        // Actual data only for past months
        const actual = i <= currentMonthIndex ? Math.round(Math.max(50, Math.min(100, baseValue))) : null;

        // Projected continues the trend
        const projected = Math.round(Math.max(50, Math.min(100, basePerformance + (i * Math.abs(trend)) + noise * 0.5)));

        // Target line (consistent goal)
        const target = basePerformance + 10;

        return { month, actual, projected, target: Math.round(target) };
    });
}

function getTrend(data: ReturnType<typeof generateSchoolData>) {
    const actualValues = data.filter(d => d.actual !== null).map(d => d.actual as number);
    if (actualValues.length < 2) return 'stable';
    const first = actualValues[0];
    const last = actualValues[actualValues.length - 1];
    const diff = last - first;
    if (diff > 3) return 'up';
    if (diff < -3) return 'down';
    return 'stable';
}

export default function ProjectionGraph({ schoolId = 's1' }: ProjectionGraphProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const data = useMemo(() => generateSchoolData(schoolId), [schoolId]);
    const trend = useMemo(() => getTrend(data), [data]);

    // Calculate key metrics
    const currentScore = data.find(d => d.actual !== null && data.indexOf(d) === 4)?.actual ?? 0;
    const projectedEnd = data[data.length - 1].projected;
    const target = data[0].target;

    if (!mounted) return <div className="w-full h-full bg-stone-black/50 rounded-lg animate-pulse" />;

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header with metrics */}
            <div className="flex items-center justify-between mb-4">
                {/* What the chart measures */}
                <div className="flex flex-col">
                    <span className="text-xs text-off-white/50 uppercase tracking-wider">Overall Academic Score</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-off-white">{currentScore}%</span>
                        <span className="text-xs text-off-white/40">current</span>
                    </div>
                </div>

                {/* Trend indicator */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${trend === 'up'
                    ? 'bg-acid-lime/10 text-acid-lime border border-acid-lime/20'
                    : trend === 'down'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                    {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    {trend === 'stable' && <Minus className="w-4 h-4" />}
                    {trend === 'up' ? 'Trending Up' : trend === 'down' ? 'Needs Attention' : 'Stable'}
                </div>
            </div>

            {/* Projection summary */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 p-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-[10px] text-off-white/40 uppercase">Projected EOY</span>
                    <div className="text-lg font-bold text-cyan-400">{projectedEnd}%</div>
                </div>
                <div className="flex-1 p-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-[10px] text-off-white/40 uppercase">Target</span>
                    <div className="text-lg font-bold text-off-white">{target}%</div>
                </div>
                <div className="flex-1 p-2 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-[10px] text-off-white/40 uppercase">Gap</span>
                    <div className={`text-lg font-bold ${projectedEnd >= target ? 'text-acid-lime' : 'text-orange-400'}`}>
                        {projectedEnd >= target ? '+' : ''}{projectedEnd - target}%
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`colorActual-${schoolId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4F268" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#D4F268" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id={`colorProjected-${schoolId}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="month"
                            stroke="#E7E5E4"
                            opacity={0.3}
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#E7E5E4"
                            opacity={0.3}
                            tick={{ fontSize: 10 }}
                            domain={[50, 100]}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0C0A09',
                                borderColor: '#333',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                            labelStyle={{ color: '#E7E5E4', marginBottom: '8px', fontWeight: 'bold' }}
                            formatter={(value, name) => {
                                if (value === null || value === undefined) return ['-', String(name)];
                                const label = name === 'actual' ? 'Actual Score' : name === 'projected' ? 'Projected Score' : 'Target';
                                return [`${value}%`, label];
                            }}
                        />
                        {/* Target reference line */}
                        <ReferenceLine
                            y={target}
                            stroke="#E7E5E4"
                            strokeDasharray="3 3"
                            strokeOpacity={0.3}
                        />
                        {/* Projected area (shown first, behind actual) */}
                        <Area
                            type="monotone"
                            dataKey="projected"
                            stroke="#22D3EE"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill={`url(#colorProjected-${schoolId})`}
                            name="projected"
                        />
                        {/* Actual data area */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#D4F268"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#colorActual-${schoolId})`}
                            name="actual"
                            connectNulls={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-3 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-acid-lime rounded"></div>
                    <span className="text-off-white/60">Actual Performance</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-cyan-400 rounded" style={{ background: 'repeating-linear-gradient(90deg, #22D3EE, #22D3EE 3px, transparent 3px, transparent 6px)' }}></div>
                    <span className="text-off-white/60">Projected Trend</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-off-white/30 rounded" style={{ background: 'repeating-linear-gradient(90deg, #E7E5E4, #E7E5E4 2px, transparent 2px, transparent 4px)' }}></div>
                    <span className="text-off-white/60">Target</span>
                </div>
            </div>
        </div>
    );
}
