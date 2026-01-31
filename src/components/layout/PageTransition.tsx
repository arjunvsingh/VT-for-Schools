'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PageTransition({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className={cn("w-full h-full", className)}
        >
            {children}
        </motion.div>
    )
}
