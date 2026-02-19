'use client';

import CaliforniaCubes from '@/components/visuals/CaliforniaCubes';
import { BentoCard } from '@/components/ui/BentoCard';
import { SystemHealthMonitor } from '@/components/ui/SystemHealthMonitor';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataStore } from '@/lib/stores';
import { useMemo } from 'react';

export default function Home() {
  // Get data for System Health Monitor
  const schools = useDataStore((state) => state.schools);
  const teachers = useDataStore((state) => state.teachers);
  const insights = useDataStore((state) => state.insights);
  // Transform data for the health monitor
  const { healthSchools, healthTeachers } = useMemo(() => {
    // Transform Schools
    const s = Object.values(schools).map(school => {
      // Find top priority insight for this school to use as the issue
      const schoolInsights = insights.filter(i => i.entityId === school.id && (i.severity === 'critical' || i.severity === 'warning'));
      const topInsight = schoolInsights.length > 0 ? schoolInsights[0].title : undefined;

      return {
        id: school.id,
        name: school.name,
        status: school.status as 'good' | 'warning' | 'alert',
        principal: school.principal,
        performance: school.performance,
        issue: topInsight || (school.status === 'alert' ? 'Critical Performance' : school.status === 'warning' ? 'Below Average' : undefined)
      };
    });

    // Transform Teachers
    const t = Object.values(teachers).map(teacher => {
      const teacherInsights = insights.filter(i => i.entityId === teacher.id && (i.severity === 'critical' || i.severity === 'warning'));
      const topInsight = teacherInsights.length > 0 ? teacherInsights[0].title : undefined;

      return {
        id: teacher.id,
        name: teacher.name,
        schoolName: schools[teacher.schoolId]?.name || 'Unknown',
        status: teacher.status as 'active' | 'flagged' | 'inactive',
        rating: teacher.rating,
        issue: topInsight || (teacher.status === 'flagged' ? 'Performance Review Req.' : undefined)
      };
    });

    return { healthSchools: s, healthTeachers: t };
  }, [schools, teachers, insights]);

  return (
    <main className="min-h-screen w-full pt-24 pb-8 px-4 md:px-6 lg:px-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* Left Column: Header + Map */}
      <section className="lg:col-span-7 flex flex-col min-h-[calc(100vh-14rem)] relative">
        <div className="flex flex-col gap-4 mb-8 z-10 pointer-events-none">
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight">
            {['State of', 'California', 'Schools'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className={`block ${i === 1 ? 'italic text-acid-lime' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-off-white/60 text-lg max-w-md"
          >
            Real-time district performance monitoring.
          </motion.p>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full relative perspective-1000 flex items-start justify-center -mt-24 translate-x-36">
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
      <section className="lg:col-span-5 flex flex-col gap-6 lg:min-h-[calc(100vh-14rem)]">

        {/* System Overview Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl italic">District Overview</h2>
          <div className="flex gap-2 text-xs font-mono opacity-50">
            <span>UPDATED</span>
            <span>JUST NOW</span>
          </div>
        </div>

        {/* Critical Focus Card (Replaced Radar) */}
        <BentoCard
          title="Critical Focus"
          description="High priority alerts"
          icon={<AlertTriangle className="text-red-400" />}
          className="h-[350px]"
          glow
        >
          <div className="flex-1 pt-4 min-h-0 flex flex-col">
            <SystemHealthMonitor
              schools={healthSchools}
              teachers={healthTeachers}
            />
          </div>
        </BentoCard>

        <BentoCard
          className="min-h-0 flex-1"
          glow
        >
          <ActivityFeed showHeader={true} className="h-full" />
        </BentoCard>

      </section>

      </div>
    </main>
  );
}
