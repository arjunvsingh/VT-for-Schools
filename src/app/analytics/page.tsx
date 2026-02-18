'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { BentoCard } from '@/components/ui/BentoCard';
import { KPIStrip } from '@/components/ui/KPIStrip';
import { DataTable, Column } from '@/components/ui/DataTable';
import { TrendBadge } from '@/components/ui/TrendBadge';
import { FilterBar, TIME_RANGE_OPTIONS } from '@/components/ui/FilterBar';
import { BackLink } from '@/components/navigation';
import { useDataStore } from '@/lib/stores';
import type { Student, SubjectMastery } from '@/lib/stores';
import { useTransitionNavigate } from '@/components/layout/TransitionOverlay';
import {
    Users, AlertTriangle, TrendingUp, GraduationCap,
    BarChart3, BookOpen, Target, Activity, Brain, ArrowRight, X
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
    const navigate = useTransitionNavigate();
    const metrics = useDataStore((state) => state.getDistrictMetrics());
    const atRiskStudents = useDataStore((state) => state.getAtRiskStudents());
    const topSkills = useDataStore((state) => state.getTopSkills(5));
    const weakestSkills = useDataStore((state) => state.getWeakestSkills(5));
    const trendData = useDataStore((state) => state.trendData);
    const schools = useDataStore((state) => state.schools);
    const subjectMastery = useDataStore((state) => state.subjectMastery);

    // Filter state
    const [timeRange, setTimeRange] = useState('last30');
    const [filterSchool, setFilterSchool] = useState('all');
    const [filterGrade, setFilterGrade] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const selectedSubjectData = selectedSubject
        ? subjectMastery.find(s => s.subject === selectedSubject)
        : null;

    const schoolOptions = useMemo(() => [
        { value: 'all', label: 'All Schools' },
        ...Object.values(schools).map(s => ({ value: s.id, label: s.name })),
    ], [schools]);

    const gradeOptions = [
        { value: 'all', label: 'All Grades' },
        { value: '7', label: 'Grade 7' },
        { value: '8', label: 'Grade 8' },
        { value: '9', label: 'Grade 9' },
        { value: '10', label: 'Grade 10' },
        { value: '11', label: 'Grade 11' },
        { value: '12', label: 'Grade 12' },
    ];

    // KPI metrics for the strip
    const kpiMetrics = useMemo(() => [
        {
            label: 'Total Students',
            value: metrics.totalStudents.toLocaleString(),
            subtitle: 'Across all schools',
            icon: <Users className="w-4 h-4" />,
            color: 'white' as const,
        },
        {
            label: 'At-Risk',
            value: metrics.atRiskCount,
            subtitle: `${((metrics.atRiskCount / metrics.totalStudents) * 100).toFixed(0)}% of enrollment`,
            trend: -2.4,
            icon: <AlertTriangle className="w-4 h-4" />,
            color: 'red' as const,
        },
        {
            label: 'Avg Performance',
            value: `${metrics.avgPerformance}%`,
            subtitle: 'District-wide score',
            trend: metrics.performanceTrend,
            icon: <TrendingUp className="w-4 h-4" />,
            color: 'lime' as const,
        },
        {
            label: 'Attendance',
            value: `${metrics.avgAttendance}%`,
            subtitle: 'Average across schools',
            trend: metrics.attendanceTrend,
            icon: <Activity className="w-4 h-4" />,
            color: 'cyan' as const,
        },
        {
            label: 'Interventions',
            value: metrics.activeInterventions,
            subtitle: 'Active risk factors',
            icon: <Target className="w-4 h-4" />,
            color: 'orange' as const,
        },
        {
            label: 'Avg GPA',
            value: metrics.avgGPA.toFixed(1),
            subtitle: 'Student average',
            icon: <GraduationCap className="w-4 h-4" />,
            color: metrics.avgGPA >= 2.5 ? 'lime' as const : 'red' as const,
        },
    ], [metrics]);

    // At-risk student table columns
    const atRiskColumns: Column<Student>[] = [
        {
            key: 'name',
            header: 'Student',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border",
                        "bg-red-400/20 border-red-400/40 text-red-200"
                    )}>
                        {row.initials}
                    </div>
                    <div>
                        <span className="font-medium text-off-white">{row.name}</span>
                        <span className="block text-[10px] text-off-white/40">Grade {row.grade}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'schoolId',
            header: 'School',
            render: (row) => (
                <span className="text-off-white/60 text-xs">{schools[row.schoolId]?.name || '-'}</span>
            ),
        },
        {
            key: 'gpa',
            header: 'GPA',
            align: 'center',
            render: (row) => (
                <span className={cn(
                    "font-mono font-bold",
                    row.gpa >= 2.5 ? "text-off-white" : "text-red-400"
                )}>
                    {row.gpa.toFixed(1)}
                </span>
            ),
        },
        {
            key: 'riskScore',
            header: 'Risk Score',
            align: 'center',
            getValue: (row) => row.riskScore || 0,
            render: (row) => {
                const score = row.riskScore || 0;
                return (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full",
                                    score >= 75 ? "bg-red-500" : score >= 50 ? "bg-orange-500" : "bg-yellow-500"
                                )}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                        <span className={cn(
                            "text-xs font-mono",
                            score >= 75 ? "text-red-400" : score >= 50 ? "text-orange-400" : "text-yellow-400"
                        )}>
                            {score}
                        </span>
                    </div>
                );
            },
        },
        {
            key: 'riskFactors',
            header: 'Issues',
            align: 'center',
            sortable: false,
            render: (row) => (
                <span className="text-xs text-red-300/60 font-mono">
                    {row.riskFactors?.length || 0}
                </span>
            ),
        },
    ];

    // Custom tooltip for area chart
    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) => {
        if (!active || !payload) return null;
        return (
            <div className="bg-stone-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
                <p className="text-off-white/60 mb-1">{label}</p>
                {payload.map((p) => (
                    <p key={p.dataKey} className="text-off-white">
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
                        {p.dataKey}: <span className="font-mono font-bold">{p.value}%</span>
                    </p>
                ))}
            </div>
        );
    };

    // Bar chart color per mastery level
    const getMasteryColor = (mastery: number) => {
        if (mastery >= 85) return '#D4F268';
        if (mastery >= 70) return '#22D3EE';
        if (mastery >= 55) return '#FB923C';
        return '#F87171';
    };

    return (
        <PageTransition className="p-4 md:p-8 pt-24 min-h-screen max-w-7xl mx-auto flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-4">
                <BackLink href="/" label="Back to Dashboard" />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl italic">
                            District <span className="text-acid-lime">Analytics</span>
                        </h1>
                        <p className="text-off-white/60 text-sm mt-1">
                            Cross-cutting performance insights across {metrics.totalSchools} schools
                        </p>
                    </div>
                    <div className="text-[10px] text-off-white/30 font-mono uppercase tracking-wider">
                        Data from: Last 30 Days
                    </div>
                </div>
            </div>

            {/* KPI Strip */}
            <KPIStrip metrics={kpiMetrics} />

            {/* Filters */}
            <FilterBar
                filters={[
                    {
                        key: 'timeRange',
                        label: 'Time Range',
                        options: TIME_RANGE_OPTIONS,
                        value: timeRange,
                        onChange: setTimeRange,
                    },
                    {
                        key: 'school',
                        label: 'School',
                        options: schoolOptions,
                        value: filterSchool,
                        onChange: setFilterSchool,
                    },
                    {
                        key: 'grade',
                        label: 'Grade',
                        options: gradeOptions,
                        value: filterGrade,
                        onChange: setFilterGrade,
                    },
                ]}
            />

            {/* At-Risk Table + Top Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* At-Risk Students Table */}
                <BentoCard
                    title="At-Risk Attention Needed"
                    icon={<AlertTriangle className="text-red-400" />}
                    className="lg:col-span-2"
                    glow
                >
                    <div className="mt-2">
                        <DataTable
                            data={atRiskStudents}
                            columns={atRiskColumns}
                            keyExtractor={(row) => row.id}
                            onRowClick={(row) => navigate(`/student/${row.id}`)}
                            pageSize={6}
                            compact
                            emptyMessage="No at-risk students found"
                            emptyIcon={<GraduationCap className="w-8 h-8 mb-2" />}
                        />
                    </div>
                </BentoCard>

                {/* Skills Panels */}
                <div className="flex flex-col gap-6">
                    {/* Top Skills */}
                    <BentoCard
                        title="Top Performing Skills"
                        icon={<Brain className="text-acid-lime" />}
                        glow
                    >
                        <div className="flex flex-col gap-2 mt-2">
                            {topSkills.map((skill, i) => (
                                <motion.div
                                    key={skill.subject}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-off-white truncate">{skill.subject}</span>
                                        <span className="text-[10px] text-off-white/30">{skill.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendBadge value={skill.trend} />
                                        <span className="text-sm font-mono font-bold text-acid-lime">{skill.mastery}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* Weakest Skills */}
                    <BentoCard
                        title="Needs Improvement"
                        icon={<Target className="text-orange-400" />}
                        glow
                    >
                        <div className="flex flex-col gap-2 mt-2">
                            {weakestSkills.map((skill, i) => (
                                <motion.div
                                    key={skill.subject}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-off-white truncate">{skill.subject}</span>
                                        <span className="text-[10px] text-off-white/30">{skill.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendBadge value={skill.trend} />
                                        <span className={cn(
                                            "text-sm font-mono font-bold",
                                            skill.mastery < 65 ? "text-red-400" : "text-orange-400"
                                        )}>
                                            {skill.mastery}%
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </BentoCard>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend Chart */}
                <BentoCard
                    title="Performance & Attendance Trends"
                    description="District-wide monthly averages"
                    icon={<TrendingUp className="text-acid-lime" />}
                    className="min-h-[350px]"
                    glow
                >
                    <div className="mt-4 h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4F268" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4F268" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" tick={{ fill: 'rgba(231,229,228,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis domain={[70, 100]} tick={{ fill: 'rgba(231,229,228,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="performance" stroke="#D4F268" fill="url(#perfGradient)" strokeWidth={2} dot={{ r: 3, fill: '#D4F268' }} />
                                <Area type="monotone" dataKey="attendance" stroke="#22D3EE" fill="url(#attGradient)" strokeWidth={2} dot={{ r: 3, fill: '#22D3EE' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-6 mt-2 text-xs text-off-white/40">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1 rounded-full bg-acid-lime" />
                            Performance
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1 rounded-full bg-cyan-400" />
                            Attendance
                        </div>
                    </div>
                </BentoCard>

                {/* Subject Mastery Bar Chart */}
                <BentoCard
                    title="Subject Mastery Breakdown"
                    description="Click a bar to drill into sub-skills"
                    icon={<BarChart3 className="text-cyan-400" />}
                    className="min-h-[350px]"
                    glow
                >
                    <div className="mt-4 h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={subjectMastery}
                                margin={{ top: 5, right: 10, left: -20, bottom: 40 }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                onClick={(state: any) => {
                                    if (state?.activePayload?.[0]) {
                                        const subject = (state.activePayload[0].payload as SubjectMastery).subject;
                                        setSelectedSubject(prev => prev === subject ? null : subject);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="subject"
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    tick={(props: any) => {
                                        const { x, y, payload } = props;
                                        const label = payload.value.length > 14 ? payload.value.slice(0, 12) + '...' : payload.value;
                                        return (
                                            <text x={x} y={y + 8} textAnchor="end" fill="rgba(231,229,228,0.4)" fontSize={9} transform={`rotate(-45, ${x}, ${y + 8})`}>
                                                {label}
                                            </text>
                                        );
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    height={70}
                                    interval={0}
                                />
                                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(231,229,228,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.[0]) return null;
                                        const data = payload[0].payload as SubjectMastery;
                                        return (
                                            <div className="bg-stone-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
                                                <p className="font-medium text-off-white mb-1">{data.subject}</p>
                                                <p className="text-off-white/60">{data.category}</p>
                                                <p className="font-mono font-bold mt-1" style={{ color: getMasteryColor(data.mastery) }}>
                                                    {data.mastery}% mastery
                                                </p>
                                                <p className="text-off-white/40">{data.studentCount} students</p>
                                                {data.skills && <p className="text-off-white/30 mt-1">Click to see {data.skills.length} sub-skills</p>}
                                            </div>
                                        );
                                    }}
                                />
                                <Bar dataKey="mastery" radius={[4, 4, 0, 0]}>
                                    {subjectMastery.map((entry, i) => (
                                        <Cell
                                            key={i}
                                            fill={getMasteryColor(entry.mastery)}
                                            fillOpacity={selectedSubject && selectedSubject !== entry.subject ? 0.3 : 0.8}
                                            stroke={selectedSubject === entry.subject ? '#E7E5E4' : 'none'}
                                            strokeWidth={selectedSubject === entry.subject ? 2 : 0}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-off-white/30">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-acid-lime/80" /> 85%+</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-cyan-400/80" /> 70-84%</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-orange-400/80" /> 55-69%</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-400/80" /> &lt;55%</div>
                    </div>

                    {/* Skill Drill-Down Panel */}
                    <AnimatePresence>
                        {selectedSubjectData?.skills && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-off-white">{selectedSubjectData.subject}</h4>
                                            <span className="text-[10px] text-off-white/30 bg-white/5 px-1.5 py-0.5 rounded">{selectedSubjectData.category}</span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSubject(null)}
                                            className="p-1 rounded-full hover:bg-white/10 transition-colors text-off-white/40 hover:text-off-white"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        {selectedSubjectData.skills.map((skill, i) => (
                                            <motion.div
                                                key={skill.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="text-xs text-off-white/70 w-40 shrink-0 truncate">{skill.name}</span>
                                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${skill.mastery}%` }}
                                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: getMasteryColor(skill.mastery) }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-bold w-10 text-right" style={{ color: getMasteryColor(skill.mastery) }}>
                                                    {skill.mastery}%
                                                </span>
                                                <TrendBadge value={skill.trend} />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-off-white/20 mt-3 text-right">
                                        {selectedSubjectData.studentCount} students enrolled
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </BentoCard>
            </div>

            {/* School Comparison */}
            <BentoCard
                title="School Performance Comparison"
                description="Side-by-side metrics across all schools"
                icon={<BookOpen className="text-cyan-400" />}
                glow
            >
                <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {Object.values(schools).map((school, i) => (
                            <motion.div
                                key={school.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/school/${school.id}`)}
                                className={cn(
                                    "p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]",
                                    school.status === 'alert' && "border-red-400/30 bg-red-400/5 hover:bg-red-400/10",
                                    school.status === 'warning' && "border-orange-400/30 bg-orange-400/5 hover:bg-orange-400/10",
                                    school.status === 'good' && "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]",
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-off-white truncate">{school.name}</span>
                                    <span className={cn(
                                        "text-lg font-bold font-mono",
                                        school.performance >= 90 ? "text-acid-lime" :
                                            school.performance >= 80 ? "text-cyan-400" :
                                                school.performance >= 70 ? "text-orange-400" : "text-red-400"
                                    )}>
                                        {school.grade}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <MetricRow label="Performance" value={`${school.performance}%`} color={school.performance >= 85 ? 'lime' : school.performance >= 75 ? 'cyan' : 'red'} />
                                    <MetricRow label="Attendance" value={`${school.attendance}%`} color={school.attendance >= 92 ? 'lime' : school.attendance >= 88 ? 'cyan' : 'orange'} />
                                    <MetricRow label="Students" value={school.students.toLocaleString()} color="white" />
                                </div>
                                <div className="flex items-center justify-end mt-3 text-[10px] text-off-white/30 hover:text-acid-lime transition-colors">
                                    View Details <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </BentoCard>

        </PageTransition>
    );
}

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
    const colorClass =
        color === 'lime' ? 'text-acid-lime' :
            color === 'cyan' ? 'text-cyan-400' :
                color === 'orange' ? 'text-orange-400' :
                    color === 'red' ? 'text-red-400' : 'text-off-white/80';
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-off-white/40">{label}</span>
            <span className={cn("text-xs font-mono font-bold", colorClass)}>{value}</span>
        </div>
    );
}
