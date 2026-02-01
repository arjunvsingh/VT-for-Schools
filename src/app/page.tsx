'use client';

import CaliforniaCubes from '@/components/visuals/CaliforniaCubes';
import { BentoCard } from '@/components/ui/BentoCard';
import { EarlyWarningRadar } from '@/components/ui/EarlyWarningRadar';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { TrendingUp, Users, GraduationCap, Radar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataStore } from '@/lib/stores';
import { useMemo } from 'react';

export default function Home() {
  // Get all students with risk scores for the Early Warning Radar
  const students = useDataStore((state) => state.students);
  const schools = useDataStore((state) => state.schools);

  // Transform students for the radar
  const earlyWarningStudents = useMemo(() => {
    return Object.values(students)
      .filter((s) => s.riskScore && s.riskScore > 30)
      .map((s) => ({
        id: s.id,
        name: s.name,
        initials: s.initials,
        schoolId: s.schoolId,
        schoolName: schools[s.schoolId]?.name || 'Unknown School',
        riskScore: s.riskScore || 0,
        riskFactors: s.riskFactors || [],
        grade: s.grade,
      }));
  }, [students, schools]);

  return (
    <main className="min-h-screen w-full pt-24 pb-8 px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">

      {/* Left Column: Header + Map */}
      <section className="lg:col-span-7 flex flex-col h-[calc(100vh-8rem)] relative">
        <div className="flex flex-col gap-4 mb-8 z-10 pointer-events-none">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight">
            State of <br />
            <span className="italic text-acid-lime">California</span> <br />
            Schools
          </h1>
          <p className="text-off-white/60 text-lg max-w-md">
            Real-time district performance monitoring.
          </p>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full relative perspective-1000 flex items-center justify-center">
          <CaliforniaCubes
            gridSize={20}
            cubeSize={32}
            cellGap={4}
            rippleOnClick={true}
            autoAnimate={true}
          />

          {/* Floating Label */}
          <div className="absolute bottom-20 left-20 backdrop-blur-md bg-stone-black/40 border border-white/10 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-acid-lime animate-pulse" />
            <span>LIVE FEED • CA-GRID</span>
          </div>
        </div>
      </section>

      {/* Right Column: Bento Stack with Early Warning + Activity Feed */}
      <section className="lg:col-span-5 flex flex-col gap-6 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">

        {/* System Overview Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl italic">System Overview</h2>
          <div className="flex gap-2 text-xs font-mono opacity-50">
            <span>UPDATED</span>
            <span>JUST NOW</span>
          </div>
        </div>

        {/* Early Warning Radar Card */}
        <BentoCard
          title="Early Warning Radar"
          description="Students requiring attention"
          icon={<Radar className="text-red-400" />}
          className="min-h-[320px]"
          glow
        >
          <div className="flex-1 flex items-center justify-center pt-4 pb-8">
            <EarlyWarningRadar
              students={earlyWarningStudents}
              maxStudents={15}
              className="max-w-[280px]"
            />
          </div>
        </BentoCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">

          {/* District Health */}
          <BentoCard
            title="District Health"
            colSpan={2}
            description="Performance across 24 zones."
            icon={<TrendingUp className="text-acid-lime" />}
            className="h-[160px]"
            glow
          >
            <div className="flex-1 w-full h-full bg-gradient-to-br from-acid-lime/10 to-transparent rounded-xl flex items-end p-4">
              <div className="flex items-end gap-1 w-full h-1/2">
                {[40, 60, 45, 80, 70, 90, 85, 60, 75, 50, 65, 80].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-acid-lime/40 rounded-t-sm hover:bg-acid-lime transition-colors duration-300" />
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Enrollment */}
          <BentoCard
            title="Enrollment"
            description="+2.4% YoY"
            icon={<Users className="text-blue-400" />}
            className="h-[120px]"
            glow
          >
            <div className="mt-auto flex items-baseline gap-2">
              <span className="text-3xl font-serif text-blue-400">4.2M</span>
              <span className="text-xs text-blue-400/60">Active Students</span>
            </div>
          </BentoCard>

          {/* Teacher Retention */}
          <BentoCard
            title="Teacher Retention"
            colSpan={1}
            description="Avg. Tenure"
            icon={<GraduationCap className="text-cyan-400" />}
            className="h-[120px]"
            glow
          >
            <div className="flex flex-col h-full mt-2 justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">8.2y</span>
                <span className="text-xs text-off-white/40">Avg</span>
              </div>
              <div className="flex justify-between text-[10px] text-off-white/60 w-full">
                <span>Metro 7.1y</span>
                <span>Rural 8.8y</span>
              </div>
            </div>
          </BentoCard>

          {/* Budget Utilization */}
          <BentoCard
            title="Budget Utilization"
            colSpan={2}
            description="FY 2026"
            className="h-[100px]"
            glow
          >
            <div className="h-full w-full flex flex-col justify-end gap-2 pb-1">
              <div className="flex justify-between text-xs">
                <span>Allocated</span>
                <span className="font-mono">72%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-off-white"
                />
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Activity Feed */}
        <BentoCard
          className="min-h-[280px] flex-1"
          glow
        >
          <ActivityFeed maxItems={5} showHeader={true} className="h-full" />
        </BentoCard>

      </section>

    </main>
  );
}
