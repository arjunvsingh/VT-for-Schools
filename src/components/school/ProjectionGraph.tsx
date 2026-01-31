'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { month: 'Aug', actual: 82, projected: 82 },
    { month: 'Sep', actual: 84, projected: 83 },
    { month: 'Oct', actual: 83, projected: 85 },
    { month: 'Nov', actual: 86, projected: 86 },
    { month: 'Dec', actual: 85, projected: 88 },
    { month: 'Jan', actual: null, projected: 89 },
    { month: 'Feb', actual: null, projected: 91 },
    { month: 'Mar', actual: null, projected: 92 },
    { month: 'Apr', actual: null, projected: 94 },
    { month: 'May', actual: null, projected: 95 },
];

export default function ProjectionGraph() {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-end mb-4">
                <div className="px-2 py-1 bg-acid-lime/10 text-acid-lime text-xs rounded border border-acid-lime/20 animate-pulse">
                    Trending Up
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D4F268" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#D4F268" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E7E5E4" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#E7E5E4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#E7E5E4" opacity={0.3} tick={{ fontSize: 10 }} />
                        <YAxis stroke="#E7E5E4" opacity={0.3} tick={{ fontSize: 10 }} domain={[60, 100]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0C0A09', borderColor: '#333' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="projected"
                            stroke="#E7E5E4"
                            strokeDasharray="5 5"
                            fillOpacity={1}
                            fill="url(#colorProjected)"
                        />
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#D4F268"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
