'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/layout/PageTransition';
import DistrictMap from '@/components/district/DistrictMap';
import { SchoolInsightsPanel } from '@/components/district/SchoolInsightsPanel';
import { BentoCard } from '@/components/ui/BentoCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { BackLink } from '@/components/navigation';
import { TrendingUp, AlertTriangle, Zap, ArrowRight, FileText, Radio as Broadcast, Users } from 'lucide-react';
import { useDataStore } from '@/lib/stores';
import { AnimatePresence, motion } from 'framer-motion';

export default function DistrictPage({ params }: { params: { id: string } }) {
    const district = useDataStore((state) => state.getDistrict(params.id));
    const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

    // Fallback for invalid district ID
    const districtName = district?.name ?? `District ${params.id}`;
    const performance = district?.performance ?? 0;
    const status = district?.status ?? 'good';

    return (
        <PageTransition className="p-4 md:p-8 pt-20 md:pt-24 min-h-screen flex flex-col gap-6">

            {/* Header */}
            <header className="flex items-center justify-between mt-4">
                <div className="flex flex-col gap-2">
                    <BackLink href="/" label="Back to State" />
                    <h1 className="font-serif text-4xl italic">{districtName}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status pill removed as requested */}
                </div>
            </header>

            {/* Canvas & Sidebar Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px] lg:h-[calc(100vh-12rem)]">

                {/* Main Canvas */}
                <div className="lg:col-span-3 h-[500px] lg:h-full relative group">
                    <div className="absolute top-4 left-4 z-10 bg-stone-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded-lg text-xs text-off-white/60">
                        INTERACTIVE MAP • CLICK A SCHOOL FOR INSIGHTS
                    </div>
                    <DistrictMap
                        selectedSchoolId={selectedSchoolId}
                        onSchoolSelect={setSelectedSchoolId}
                    />
                </div>

                {/* Sidebar - Contextual based on selection */}
                <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-10rem)] pb-4">
                    <AnimatePresence mode="wait">
                        {selectedSchoolId ? (
                            <motion.div
                                key="school-panel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <SchoolInsightsPanel
                                    schoolId={selectedSchoolId}
                                    onClose={() => setSelectedSchoolId(null)}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="district-panel"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col gap-6"
                            >
                                <BentoCard
                                    title="Urgent Alerts"
                                    icon={<AlertTriangle className="text-red-400" />}
                                    className="h-auto min-h-[200px]"
                                    glow
                                >
                                    <div className="flex flex-col gap-5 mt-4">
                                        <div className="flex flex-col gap-3 p-4 rounded-xl bg-red-400/5 border border-red-400/10 hover:bg-red-400/10 transition-colors group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-red-200 font-bold uppercase tracking-wider">Math Scores Critical</span>
                                                    <span className="text-xs text-off-white/60">Roosevelt Elem • Drop &gt; 15%</span>
                                                </div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                            </div>
                                            <button
                                                onClick={() => setSelectedSchoolId('s2')}
                                                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-400/10 text-red-300 text-xs font-bold uppercase tracking-wider hover:bg-red-400/20 transition-colors"
                                            >
                                                Investigate <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3 p-4 rounded-xl bg-orange-400/5 border border-orange-400/10 hover:bg-orange-400/10 transition-colors group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-orange-200 font-bold uppercase tracking-wider">Staff Shortage</span>
                                                    <span className="text-xs text-off-white/60">Adams Elem • 3 Unfilled Roles</span>
                                                </div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                            </div>
                                            <button
                                                onClick={() => setSelectedSchoolId('s5')}
                                                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-400/10 text-orange-300 text-xs font-bold uppercase tracking-wider hover:bg-orange-400/20 transition-colors"
                                            >
                                                Review Allocation <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </BentoCard>

                                <BentoCard
                                    title="District Actions"
                                    icon={<Zap className="text-acid-lime" />}
                                    className="h-auto min-h-[180px]"
                                    glow
                                >
                                    <div className="flex flex-col gap-4 mt-4">
                                        <button className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left group">
                                            <div className="bg-acid-lime/10 p-2 rounded-lg text-acid-lime group-hover:text-white group-hover:bg-acid-lime transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-off-white">Generate Board Report</span>
                                                <span className="text-xs text-off-white/50">Export PDF Summary</span>
                                            </div>
                                        </button>

                                        <button className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left group">
                                            <div className="bg-red-400/10 p-2 rounded-lg text-red-400 group-hover:text-white group-hover:bg-red-500 transition-colors">
                                                <Broadcast className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-off-white">Broadcast Alert</span>
                                                <span className="text-xs text-off-white/50">Send to all principals</span>
                                            </div>
                                        </button>

                                        <button className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left group">
                                            <div className="bg-acid-lime/10 p-2 rounded-lg text-acid-lime group-hover:text-white group-hover:bg-acid-lime transition-colors">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-off-white">Staffing Review</span>
                                                <span className="text-xs text-off-white/50">Analyze allocation</span>
                                            </div>
                                        </button>
                                    </div>
                                </BentoCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </PageTransition>
    );
}
