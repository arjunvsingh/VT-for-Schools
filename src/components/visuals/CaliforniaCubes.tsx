'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import gsap from 'gsap';
import { CALIFORNIA_GRID } from '@/data/california-shape';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface CubesProps {
    gridSize?: number; // Ignored if using shape
    cubeSize?: number;
    maxAngle?: number;
    radius?: number;
    easing?: string;
    duration?: { enter: number; leave: number };
    cellGap?: number | { row: number; col: number };
    borderStyle?: string;
    faceColor?: string;
    shadow?: boolean | string;
    autoAnimate?: boolean;
    rippleOnClick?: boolean;
    rippleColor?: string;
    rippleSpeed?: number;
}

export default function CaliforniaCubes({
    cubeSize,
    maxAngle = 45,
    radius = 3,
    easing = 'power3.out',
    duration = { enter: 0.3, leave: 0.6 },
    cellGap,
    borderStyle = '1px solid rgba(212, 242, 104, 0.3)', // Default to acid-lime tint
    faceColor = 'rgba(12, 10, 9, 0.9)', // stone-black
    shadow = false,
    autoAnimate = true,
    rippleOnClick = true,
    rippleColor = '#D4F268', // acid-lime
    rippleSpeed = 2,
}: CubesProps) {
    // Tooltip state
    const [tooltip, setTooltip] = React.useState<{ x: number; y: number; content: string } | null>(null);

    const sceneRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const userActiveRef = useRef(false);
    const simPosRef = useRef({ x: 0, y: 0 });
    const simTargetRef = useRef({ x: 0, y: 0 });
    const simRAFRef = useRef<number | null>(null);
    const router = useRouter();

    const gridRows = CALIFORNIA_GRID.length;
    const gridCols = CALIFORNIA_GRID[0].length;

    const colGap =
        typeof cellGap === 'number'
            ? `${cellGap}px`
            : cellGap?.col !== undefined
                ? `${cellGap.col}px`
                : '5%';
    const rowGap =
        typeof cellGap === 'number'
            ? `${cellGap}px`
            : cellGap?.row !== undefined
                ? `${cellGap.row}px`
                : '5%';

    const enterDur = duration.enter;
    const leaveDur = duration.leave;

    const tiltAt = useCallback(
        (rowCenter: number, colCenter: number) => {
            if (!sceneRef.current) return;
            sceneRef.current.querySelectorAll('.cube').forEach((cube) => {
                const r = Number((cube as HTMLElement).dataset.row);
                const c = Number((cube as HTMLElement).dataset.col);
                const dist = Math.hypot(r - rowCenter, c - colCenter);
                if (dist <= radius) {
                    const pct = 1 - dist / radius;
                    const angle = pct * maxAngle;
                    gsap.to(cube, {
                        duration: enterDur,
                        ease: easing,
                        overwrite: true,
                        rotateX: -angle,
                        rotateY: angle,
                    });
                } else {
                    gsap.to(cube, {
                        duration: leaveDur,
                        ease: 'power3.out',
                        overwrite: true,
                        rotateX: 0,
                        rotateY: 0,
                    });
                }
            });
        },
        [radius, maxAngle, enterDur, leaveDur, easing]
    );

    const onPointerMove = useCallback(
        (e: PointerEvent) => {
            userActiveRef.current = true;
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

            if (!sceneRef.current) return;
            const rect = sceneRef.current.getBoundingClientRect();
            const cellW = rect.width / gridCols;
            const cellH = rect.height / gridRows;
            const col = Math.floor((e.clientX - rect.left) / cellW);
            const row = Math.floor((e.clientY - rect.top) / cellH);

            // Animation logic
            const colCenter = (e.clientX - rect.left) / cellW;
            const rowCenter = (e.clientY - rect.top) / cellH;

            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));

            idleTimerRef.current = setTimeout(() => {
                userActiveRef.current = false;
            }, 3000);

            // Tooltip logic
            if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
                if (CALIFORNIA_GRID[row] && CALIFORNIA_GRID[row][col] === 1) {
                    setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        content: `District ${row * gridCols + col} • ${(row * col) % 20 + 5} Schools`
                    });
                } else {
                    setTooltip(null);
                }
            } else {
                setTooltip(null);
            }
        },
        [gridCols, gridRows, tiltAt, setTooltip]
    );

    const resetAll = useCallback(() => {
        if (!sceneRef.current) return;
        sceneRef.current.querySelectorAll('.cube').forEach((cube) =>
            gsap.to(cube, {
                duration: leaveDur,
                rotateX: 0,
                rotateY: 0,
                ease: 'power3.out',
            })
        );
    }, [leaveDur]);

    const onLeave = useCallback(() => {
        resetAll();
        setTooltip(null);
    }, [resetAll, setTooltip]);

    const onClick = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!rippleOnClick || !sceneRef.current) return;
            const rect = sceneRef.current.getBoundingClientRect();
            const cellW = rect.width / gridCols;
            const cellH = rect.height / gridRows;

            // Extract clientX/Y properly
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

            const colHit = Math.floor((clientX - rect.left) / cellW);
            const rowHit = Math.floor((clientY - rect.top) / cellH);

            // Check if valid cube was clicked (exists in grid)
            // Implementation: find the specific cube element and verify it exists
            // But we can just animate visible cubes

            // Navigate to district page on click
            // Simulate zoom first? For now, direct route push after short delay?
            // User asked: "poll page should zoom in... open a new page which leads to district page"
            // We will trigger animation and then route.

            const baseRingDelay = 0.15;
            const baseAnimDur = 0.3;
            const baseHold = 0.6;

            const spreadDelay = baseRingDelay / rippleSpeed;
            const animDuration = baseAnimDur / rippleSpeed;
            const holdTime = baseHold / rippleSpeed;

            const rings: Record<number, Element[]> = {};
            sceneRef.current.querySelectorAll('.cube').forEach((cube) => {
                const r = Number((cube as HTMLElement).dataset.row);
                const c = Number((cube as HTMLElement).dataset.col);
                const dist = Math.hypot(r - rowHit, c - colHit);
                const ring = Math.round(dist);
                if (!rings[ring]) rings[ring] = [];
                rings[ring].push(cube);
            });

            Object.keys(rings)
                .map(Number)
                .sort((a, b) => a - b)
                .forEach((ring) => {
                    const delay = ring * spreadDelay;
                    const faces = rings[ring].flatMap((cube) =>
                        Array.from(cube.querySelectorAll('.cube-face'))
                    );

                    gsap.to(faces, {
                        backgroundColor: rippleColor,
                        duration: animDuration,
                        delay,
                        ease: 'power3.out',
                    });
                    gsap.to(faces, {
                        backgroundColor: faceColor,
                        duration: animDuration,
                        delay: delay + animDuration + holdTime,
                        ease: 'power3.out',
                    });
                });

            // Navigation after effect
            // NOTE: Hardcoded to district 1 for demo
            setTimeout(() => {
                router.push('/district/1');
            }, 200);
        },
        [rippleOnClick, gridCols, gridRows, faceColor, rippleColor, rippleSpeed, router]
    );

    useEffect(() => {
        if (!autoAnimate || !sceneRef.current) return;
        simPosRef.current = {
            x: Math.random() * gridCols,
            y: Math.random() * gridRows,
        };
        simTargetRef.current = {
            x: Math.random() * gridCols,
            y: Math.random() * gridRows,
        };
        const speed = 0.02;
        const loop = () => {
            if (!userActiveRef.current) {
                const pos = simPosRef.current;
                const tgt = simTargetRef.current;
                pos.x += (tgt.x - pos.x) * speed;
                pos.y += (tgt.y - pos.y) * speed;
                tiltAt(pos.y, pos.x);
                if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
                    simTargetRef.current = {
                        x: Math.random() * gridCols,
                        y: Math.random() * gridRows,
                    };
                }
            }
            simRAFRef.current = requestAnimationFrame(loop);
        };
        simRAFRef.current = requestAnimationFrame(loop);
        return () => {
            if (simRAFRef.current != null) {
                cancelAnimationFrame(simRAFRef.current);
            }
        };
    }, [autoAnimate, gridCols, gridRows, tiltAt]);

    useEffect(() => {
        const el = sceneRef.current;
        if (!el) return;

        // Use specific event types for TS
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerleave', onLeave); // usage update
        // Cast to EventListener because our handler logic handles both mouse/touch via checking properties
        el.addEventListener('click', onClick as EventListener);

        // Manual touch handling not strictly needed if pointer events work, but keeping for compatibility

        return () => {
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerleave', onLeave);
            el.removeEventListener('click', onClick as EventListener);

            rafRef.current != null && cancelAnimationFrame(rafRef.current);
            idleTimerRef.current && clearTimeout(idleTimerRef.current);
        };
    }, [onPointerMove, onLeave, onClick]);


    const sceneStyle = {
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        columnGap: colGap,
        rowGap: rowGap,
    };

    const wrapperStyle = {
        '--cube-face-border': borderStyle,
        '--cube-face-bg': faceColor,
        '--cube-face-shadow': shadow === true ? '0 0 6px rgba(0,0,0,.5)' : shadow || 'none',
        ...(cubeSize ? {
            width: `${gridCols * cubeSize + (gridCols - 1) * (typeof cellGap === 'number' ? cellGap : 0)}px`,
            height: `${gridRows * cubeSize + (gridRows - 1) * (typeof cellGap === 'number' ? cellGap : 0)}px`,
        } : {})
    } as React.CSSProperties;

    return (
        <div className={cn("default-animation relative", !cubeSize && "h-full w-full")} style={wrapperStyle}>
            <div ref={sceneRef} className="default-animation--scene" style={sceneStyle}>
                {CALIFORNIA_GRID.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                        if (cell === 0) return <div key={`${rIdx}-${cIdx}`} />; // Empty space

                        return (
                            <div key={`${rIdx}-${cIdx}`} className="cube cursor-pointer" data-row={rIdx} data-col={cIdx}>
                                <div className="cube-face cube-face--top" />
                                <div className="cube-face cube-face--bottom" />
                                <div className="cube-face cube-face--left" />
                                <div className="cube-face cube-face--right" />
                                <div className="cube-face cube-face--front" />
                                <div className="cube-face cube-face--back" />
                            </div>
                        );
                    })
                )}
            </div>

            {/* Tooltip Portal or Absolute Position */}
            {tooltip && (
                <div
                    className="fixed z-50 pointer-events-none px-3 py-2 bg-stone-black/90 border border-white/10 backdrop-blur-md rounded-lg text-xs font-mono text-off-white shadow-xl"
                    style={{
                        left: tooltip.x + 16,
                        top: tooltip.y + 16,
                        transform: 'translate(0, 0)'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-acid-lime" />
                        {tooltip.content}
                    </div>
                </div>
            )}
        </div>
    );
}
