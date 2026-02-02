'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

// Empty component - no overlay needed
export function TransitionOverlay() {
    return null;
}
