'use client';

import { useInterventionStore, useDataStore, interventionLabels } from '@/lib/stores';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Clock, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationsDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
    const interventions = useInterventionStore((s) => s.interventions);
    const insights = useDataStore((s) => s.insights);

    const recentInterventions = interventions.slice(0, 8);
    const criticalInsights = insights
        .filter((i) => i.severity === 'critical' || i.severity === 'warning')
        .slice(0, 5);

    const hasItems = recentInterventions.length > 0 || criticalInsights.length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="absolute right-0 top-14 z-[70] w-[380px] max-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-stone-900/95 backdrop-blur-xl shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-acid-lime" />
                                <span className="text-sm font-medium">Notifications</span>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 transition-colors">
                                <X className="w-3.5 h-3.5 text-off-white/40" />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                            {/* System Alerts */}
                            {criticalInsights.length > 0 && (
                                <div className="px-4 py-2">
                                    <span className="text-[10px] uppercase tracking-wider text-off-white/30 font-medium">System Alerts</span>
                                    <div className="mt-2 flex flex-col gap-1">
                                        {criticalInsights.map((insight) => (
                                            <div key={insight.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                                                <div className={cn(
                                                    "mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                                    insight.severity === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'
                                                )}>
                                                    <AlertTriangle className={cn(
                                                        "w-3 h-3",
                                                        insight.severity === 'critical' ? 'text-red-400' : 'text-orange-400'
                                                    )} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-off-white truncate">{insight.title}</p>
                                                    <p className="text-[10px] text-off-white/40 mt-0.5 line-clamp-1">{insight.description}</p>
                                                </div>
                                                <span className={cn(
                                                    "text-[9px] px-1.5 py-0.5 rounded-full shrink-0",
                                                    insight.severity === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                                                )}>
                                                    {insight.severity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Actions */}
                            {recentInterventions.length > 0 && (
                                <div className="px-4 py-2">
                                    <span className="text-[10px] uppercase tracking-wider text-off-white/30 font-medium">Recent Actions</span>
                                    <div className="mt-2 flex flex-col gap-1">
                                        {recentInterventions.map((intervention) => {
                                            const info = interventionLabels[intervention.type];
                                            return (
                                                <div key={intervention.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                                                    <div className={cn(
                                                        "mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                                        intervention.status === 'completed' ? 'bg-emerald-500/20' : 'bg-cyan-500/20'
                                                    )}>
                                                        {intervention.status === 'completed'
                                                            ? <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                            : <Clock className="w-3 h-3 text-cyan-400" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-medium text-off-white truncate">
                                                            {info.icon} {info.label}
                                                        </p>
                                                        <p className="text-[10px] text-off-white/40 mt-0.5 truncate">{intervention.entityName}</p>
                                                    </div>
                                                    <span className="text-[10px] text-off-white/30 shrink-0">
                                                        {timeAgo(intervention.createdAt)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {!hasItems && (
                                <div className="flex flex-col items-center justify-center py-12 text-off-white/30">
                                    <Info className="w-8 h-8 mb-2" />
                                    <p className="text-xs">No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
