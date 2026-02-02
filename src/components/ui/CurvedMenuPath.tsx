'use client';

import { motion } from 'framer-motion';

interface CurvedMenuPathProps {
    height: number;
    color?: string;
}

export function CurvedMenuPath({ height, color = '#1C1917' }: CurvedMenuPathProps) {
    // SVG path commands:
    // M100 0 - Move to top-right (100px from left edge)
    // L100 ${height} - Line straight down to bottom
    // Q-100 ${height/2} 100 0 - Quadratic Bézier curve back to start
    //   Control point at x=-100 (bulging left), y=height/2 (middle)

    const initialPath = `M100 0 L100 ${height} Q-100 ${height / 2} 100 0`;
    const targetPath = `M100 0 L100 ${height} Q100 ${height / 2} 100 0`;

    const curve = {
        initial: {
            d: initialPath,
        },
        enter: {
            d: targetPath,
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
        },
        exit: {
            d: initialPath,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
        },
    };

    return (
        <svg
            className="absolute top-0 left-[-99px] w-[100px] h-full fill-current pointer-events-none"
            style={{ color }}
        >
            <motion.path
                variants={curve}
                initial="initial"
                animate="enter"
                exit="exit"
            />
        </svg>
    );
}
