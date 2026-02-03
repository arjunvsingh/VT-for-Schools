'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Simple hook for smooth navigation - fades out current page before navigating
export function useTransitionNavigate() {
    const router = useRouter();
    const isNavigating = useRef(false);

    const navigate = useCallback((url: string) => {
        if (isNavigating.current) return;
        isNavigating.current = true;

        // Find the main content wrapper and fade it out
        const mainContent = document.querySelector('main') || document.body;
        mainContent.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'scale(0.98)';

        // Navigate after the fade-out completes
        setTimeout(() => {
            router.push(url);
            isNavigating.current = false;
            // Reset styles for next navigation
            mainContent.style.opacity = '';
            mainContent.style.transform = '';
        }, 250);
    }, [router]);

    return navigate;
}

// Full-screen overlay that shows during route transitions
export function TransitionOverlay() {
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        if (prevPathRef.current !== pathname) {
            // Route changed — show overlay briefly
            setIsTransitioning(true);
            prevPathRef.current = pathname;

            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [pathname]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
                    className="fixed inset-0 z-[200] pointer-events-none"
                >
                    {/* Dark fade */}
                    <div className="absolute inset-0 bg-stone-black/40" />

                    {/* Acid-lime sweep line */}
                    <motion.div
                        initial={{ left: '-10%' }}
                        animate={{ left: '110%' }}
                        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                        className="absolute top-0 bottom-0 w-[2px]"
                    >
                        <div className="h-full w-full bg-gradient-to-b from-transparent via-acid-lime/60 to-transparent" />
                        <div className="absolute top-0 bottom-0 -left-8 w-16 bg-gradient-to-r from-transparent via-acid-lime/10 to-transparent" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
