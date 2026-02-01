'use client';

import { useInterventionStore, Toast as ToastType } from '@/lib/stores/intervention-store';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const colorMap = {
    success: 'bg-acid-lime/10 border-acid-lime/30 text-acid-lime',
    error: 'bg-red-400/10 border-red-400/30 text-red-400',
    warning: 'bg-orange-400/10 border-orange-400/30 text-orange-400',
    info: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400',
};

function ToastItem({ toast }: { toast: ToastType }) {
    const dismissToast = useInterventionStore((state) => state.dismissToast);
    const Icon = iconMap[toast.type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
                'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] max-w-[400px]',
                colorMap[toast.type]
            )}
        >
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
            >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            </motion.div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-off-white/60 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function ToastProvider() {
    const toasts = useInterventionStore((state) => state.toasts);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-auto">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
}
