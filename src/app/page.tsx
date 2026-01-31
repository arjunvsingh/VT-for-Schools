'use client';

import CaliforniaCubes from '@/components/visuals/CaliforniaCubes';
import { BentoCard } from '@/components/ui/BentoCard';
import { TrendingUp, Users, AlertCircle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen w-full pt-24 pb-8 px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">

      {/* Left Column: Header + Map (Fixed/Sticky feel) */}
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

        {/* Scaled Down Map Container - Aligned Left/Center */}
        <div className="flex-1 w-full relative perspective-1000 -ml-10">
          <CaliforniaCubes
            gridSize={20}
            cubeSize={20} // Smaller cubes
            cellGap={4}   // Tighter gap
            rippleOnClick={true}
            autoAnimate={true}
          />

          {/* Floating Label moved to not overlap cards */}
          <div className="absolute bottom-4 left-20 backdrop-blur-md bg-stone-black/40 border border-white/10 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-acid-lime animate-pulse" />
            <span>LIVE FEED • CA-GRID</span>
          </div>
        </div>
      </section>

      {/* Right Column: Scrollable Bento Stack */}
      <section className="lg:col-span-5 h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-20 no-scrollbar">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-stone-black/80 backdrop-blur-md py-2 z-20 border-b border-white/5">
          <h2 className="font-serif text-2xl italic">System Overview</h2>
          <div className="flex gap-2 text-xs font-mono opacity-50">
            <span>UPDATED</span>
            <span>JUST NOW</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">

          <BentoCard
            title="District Health"
            description="Performance across 24 registered zones."
            icon={<TrendingUp className="text-acid-lime" />}
            className="min-h-[200px]"
            glow
          >
            <div className="flex-1 w-full h-full bg-gradient-to-br from-acid-lime/10 to-transparent rounded-xl flex items-end p-4">
              <div className="flex items-end gap-1 w-full h-1/2">
                {[40, 60, 45, 80, 70, 90, 85, 60, 75, 50].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-acid-lime/40 rounded-t-sm hover:bg-acid-lime transition-colors duration-300" />
                ))}
              </div>
            </div>
          </BentoCard>

          <div className="grid grid-cols-2 gap-4">
            <BentoCard
              title="Critical Alerts"
              description="Action Required"
              icon={<AlertCircle className="text-red-400" />}
              className="aspect-square"
            >
              <div className="mt-2 text-2xl font-serif text-red-400">3</div>
              <div className="text-xs text-red-400/60">Districts</div>
            </BentoCard>

            <BentoCard
              title="Enrollment"
              description="+2.4% YoY"
              icon={<Users className="text-blue-400" />}
              className="aspect-square"
            >
              <div className="mt-2 text-2xl font-serif text-blue-400">4.2M</div>
              <div className="text-xs text-blue-400/60">Students</div>
            </BentoCard>
          </div>

          <BentoCard
            title="Teacher Retention"
            description="Average tenure per district"
            icon={<GraduationCap className="text-purple-400" />}
            className="min-h-[160px]"
          >
            <div className="flex items-center gap-6 h-full">
              <div className="h-20 w-20 rounded-full border-4 border-purple-500/30 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold">8.2y</span>
              </div>
              <div className="flex flex-col gap-2 text-sm text-off-white/60">
                <div className="flex justify-between w-full gap-8"><span>Metro</span> <span>7.1y</span></div>
                <div className="flex justify-between w-full gap-8"><span>Coastal</span> <span>9.4y</span></div>
                <div className="flex justify-between w-full gap-8"><span>Rural</span> <span>8.8y</span></div>
              </div>
            </div>
          </BentoCard>

          <BentoCard
            title="Budget Utilization"
            description="Fiscal Year 2026"
            className="min-h-[140px]"
          >
            <div className="h-full w-full flex flex-col justify-center gap-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
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
      </section>

    </main>
  );
}
