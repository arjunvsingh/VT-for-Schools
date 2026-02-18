'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInterventionStore, interventionLabels } from '@/lib/stores/intervention-store';
import { History, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import { CurvedMenuPath } from '@/components/ui/CurvedMenuPath';

interface ActivityTrackerPanelProps {
    schoolId: string;
}


export function ActivityTrackerPanel({ schoolId }: ActivityTrackerPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [windowHeight, setWindowHeight] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const interventions = useInterventionStore((state) =>
        state.getInterventionsForEntity('school', schoolId)
    );

    // Track when component is mounted for portal
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Track window height for SVG curve
    useEffect(() => {
        const updateHeight = () => setWindowHeight(window.innerHeight);
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    const statusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-acid-lime" />;
            case 'pending':
            case 'in_progress':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4 text-red-400" />;
            default:
                return <Clock className="w-4 h-4 text-off-white/40" />;
        }
    };

    return (
        <>
            {/* Trigger Button - Icon in top right of school page header */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-warm-charcoal border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
                title="View Activity History"
            >
                <History className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                {interventions.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-acid-lime text-stone-black text-xs font-bold flex items-center justify-center">
                        {interventions.length}
                    </span>
                )}
            </button>

            {/* Portal for Backdrop and Panel - renders at document body level */}
            {isMounted && createPortal(
                <>
                    {/* Backdrop */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                            />
                        )}
                    </AnimatePresence>

                    {/* Slide-out Panel */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                className="fixed top-0 right-0 h-screen w-[420px] max-w-[90vw] bg-warm-charcoal z-[101] flex flex-col shadow-2xl"
                            >
                                {/* Curved left edge */}
                                {windowHeight > 0 && (
                                    <CurvedMenuPath height={windowHeight} color="#1C1917" />
                                )}

                                {/* Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="flex items-center justify-between p-6 border-b border-white/10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                            <History className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-2xl italic text-off-white">Activity</h2>
                                            <p className="text-base text-off-white/50">{interventions.length} actions</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5 text-off-white/60" />
                                    </button>
                                </motion.div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {interventions.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-center py-20"
                                        >
                                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                                                <History className="w-10 h-10 text-off-white/30" />
                                            </div>
                                            <p className="text-2xl font-medium text-off-white/60">No actions yet</p>
                                            <p className="text-base text-off-white/40 mt-2 max-w-[200px] mx-auto">
                                                Complete an insight action to see your history here
                                            </p>
                                        </motion.div>
                                    ) : (
                                        interventions.map((intervention, index) => {
                                            const info = interventionLabels[intervention.type];
                                            return (
                                                <motion.div
                                                    key={intervention.id}
                                                    initial={{ opacity: 0, x: 40 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{
                                                        delay: 0.2 + (index * 0.08),
                                                        duration: 0.5,
                                                        ease: [0.76, 0, 0.24, 1]
                                                    }}
                                                    className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
                                                >
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-acid-lime/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                        {info.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-off-white">{info.label}</span>
                                                            {statusIcon(intervention.status)}
                                                        </div>
                                                        <p className="text-base text-off-white/50 truncate">
                                                            {intervention.entityName}
                                                        </p>
                                                        <p className="text-sm text-off-white/30 mt-2">
                                                            {formatTime(intervention.createdAt)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="p-4 border-t border-white/10 bg-stone-black/30"
                                >
                                    <p className="text-sm text-center text-off-white/30">
                                        Actions are logged for compliance
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}
        </>
    );
}
