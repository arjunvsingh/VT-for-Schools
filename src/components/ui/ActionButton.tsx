'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    useInterventionStore,
    InterventionType,
    interventionLabels
} from '@/lib/stores/intervention-store';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface ActionButtonProps {
    type: InterventionType;
    entityType: 'school' | 'teacher' | 'student' | 'district';
    entityId: string;
    entityName: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showIcon?: boolean;
    customLabel?: string;
}

export function ActionButton({
    type,
    entityType,
    entityId,
    entityName,
    variant = 'primary',
    size = 'md',
    className,
    showIcon = true,
    customLabel,
}: ActionButtonProps) {
    const triggerIntervention = useInterventionStore((state) => state.triggerIntervention);
    const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');

    const info = interventionLabels[type];

    const handleClick = async () => {
        if (state !== 'idle') return;

        setState('loading');

        // Trigger the intervention
        triggerIntervention(type, entityType, entityId, entityName);

        // Simulate async action
        setTimeout(() => {
            setState('success');

            // Reset after showing success
            setTimeout(() => {
                setState('idle');
            }, 2000);
        }, 800);
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5',
    };

    const variantClasses = {
        primary: 'bg-acid-lime text-stone-black hover:bg-acid-lime/90 font-bold',
        secondary: 'bg-white/10 text-off-white hover:bg-white/20 border border-white/10',
        ghost: 'text-acid-lime hover:bg-acid-lime/10',
    };

    return (
        <motion.button
            onClick={handleClick}
            disabled={state !== 'idle'}
            whileHover={{ scale: state === 'idle' ? 1.02 : 1 }}
            whileTap={{ scale: state === 'idle' ? 0.98 : 1 }}
            className={cn(
                'relative flex items-center justify-center rounded-lg font-medium transition-all duration-200 overflow-hidden',
                sizeClasses[size],
                variantClasses[variant],
                state !== 'idle' && 'cursor-not-allowed',
                className
            )}
        >
            {/* Background pulse on success */}
            {state === 'success' && (
                <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-acid-lime rounded-full"
                />
            )}

            {/* Icon */}
            <span className="relative">
                {state === 'loading' ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <Loader2 className={cn(size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
                    </motion.div>
                ) : state === 'success' ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    >
                        <Check className={cn(size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
                    </motion.div>
                ) : showIcon ? (
                    <span>{info.icon}</span>
                ) : null}
            </span>

            {/* Label */}
            <span className="relative">
                {state === 'loading'
                    ? 'Processing...'
                    : state === 'success'
                        ? 'Done!'
                        : (customLabel || info.label)}
            </span>
        </motion.button>
    );
}
