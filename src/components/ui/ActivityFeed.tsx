'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle, Lightbulb, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActivityStore, ActivityItem, ActivityType } from '@/lib/stores/activity-store';
import { ActionButton } from './ActionButton';
import Link from 'next/link';

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const typeConfig: Record<ActivityType, {
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    label: string;
    borderColor: string;
}> = {
    win: {
        icon: <Trophy className="w-4 h-4" />,
        iconBg: 'bg-acid-lime/20',
        iconColor: 'text-acid-lime',
        label: 'Win',
        borderColor: 'border-acid-lime/20',
    },
    alert: {
        icon: <AlertTriangle className="w-4 h-4" />,
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        label: 'Alert',
        borderColor: 'border-red-500/20',
    },
    insight: {
        icon: <Lightbulb className="w-4 h-4" />,
        iconBg: 'bg-cyan-500/20',
        iconColor: 'text-cyan-400',
        label: 'Insight',
        borderColor: 'border-cyan-500/20',
    },
    action: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        iconBg: 'bg-orange-500/20',
        iconColor: 'text-orange-400',
        label: 'Action',
        borderColor: 'border-orange-500/20',
    },
};

function ActivityCard({ item, index, onDismiss }: { item: ActivityItem; index: number; onDismiss: () => void }) {
    const config = typeConfig[item.type];
    const entityLink = item.entityType && item.entityId
        ? `/${item.entityType}/${item.entityId}`
        : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: index * 0.05,
            }}
            className={cn(
                "group p-3 rounded-lg border bg-white/5 hover:bg-white/[0.07] transition-colors relative",
                config.borderColor,
                !item.isRead && "ring-1 ring-white/10"
            )}
        >
            <div className="relative flex items-start gap-3">
                {/* Dismiss Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDismiss();
                    }}
                    className="absolute -top-1 -right-1 text-off-white/20 hover:text-white hover:bg-white/10 rounded-full p-0.5 transition-all opacity-0 group-hover:opacity-100"
                >
                    <X className="w-3 h-3" />
                </button>
                {/* Icon */}
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    config.iconBg,
                    config.iconColor
                )}>
                    {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-xs font-medium", config.iconColor)}>
                            {config.label}
                        </span>
                        <span className="text-[10px] text-off-white/40">
                            {formatRelativeTime(item.timestamp)}
                        </span>
                    </div>

                    <h4 className="font-medium text-sm mt-0.5 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-off-white/60 mt-0.5 line-clamp-2">{item.description}</p>

                    {/* Actions row */}
                    <div className="mt-2 flex items-center gap-2">
                        {/* Action button for any item with interventionType */}
                        {item.interventionType && item.entityId && item.entityType && (
                            <ActionButton
                                type={item.interventionType}
                                entityType={item.entityType}
                                entityId={item.entityId}
                                entityName={item.entityName || 'Entity'}
                                size="sm"
                                variant="secondary"
                            />
                        )}

                        {/* Link to entity */}
                        {entityLink && (
                            <Link
                                href={entityLink}
                                className="text-xs text-off-white/40 hover:text-acid-lime flex items-center gap-1 ml-auto transition-colors"
                            >
                                View <ExternalLink className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface ActivityFeedProps {
    maxItems?: number;
    className?: string;
    showHeader?: boolean;
}

export function ActivityFeed({
    maxItems = 20,
    className,
    showHeader = true,
}: ActivityFeedProps) {
    const activities = useActivityStore((state) => state.activities);
    const unreadCount = useActivityStore((state) => state.getUnreadCount());
    const markAllAsRead = useActivityStore((state) => state.markAllAsRead);
    const removeActivity = useActivityStore((state) => state.removeActivity);

    // Fix hydration mismatch for relative times
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const recentActivities = useMemo(() => {
        return activities.slice(0, maxItems);
    }, [activities, maxItems]);

    if (!mounted) return null;

    return (
        <div className={cn("flex flex-col", className)}>
            {/* Header */}
            {showHeader && (
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-off-white/60">
                            Activity Feed
                        </h3>
                        {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-acid-lime/20 text-acid-lime rounded-full font-bold">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-off-white/40 hover:text-acid-lime transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            )}

            {/* Activity list */}
            <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                <AnimatePresence mode="popLayout">
                    {recentActivities.map((item, index) => (
                        <ActivityCard
                            key={item.id}
                            item={item}
                            index={index}
                            onDismiss={() => removeActivity(item.id)}
                        />
                    ))}
                </AnimatePresence>

                {recentActivities.length === 0 && (
                    <div className="text-center py-8 text-off-white/40">
                        <p className="text-sm">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
}
