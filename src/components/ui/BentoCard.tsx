import { cn } from '@/lib/utils';
import React from 'react';

interface BentoCardProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
    glow?: boolean;
}

export function BentoCard({
    title,
    description,
    icon,
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    glow = false,
}: BentoCardProps) {
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--glow-x', `${x}px`);
        e.currentTarget.style.setProperty('--glow-y', `${y}px`);
        e.currentTarget.style.setProperty('--glow-intensity', '1');
    };

    return (
        <div
            className={cn(
                'magic-bento-card group',
                glow && 'magic-bento-card--border-glow',
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--glow-intensity', '0');
            }}
            style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
            }}
        >
            <div className="magic-bento-card__header z-10">
                {icon && <div className="magic-bento-card__icon mb-2">{icon}</div>}
                <div className="flex flex-col">
                    {title && <h3 className="magic-bento-card__title font-serif italic text-xl">{title}</h3>}
                    {description && <p className="magic-bento-card__description text-off-white/60 font-sans">{description}</p>}
                </div>
            </div>

            <div className="magic-bento-card__content z-10 mt-4 flex-1">
                {children}
            </div>

            {/* Background/Decorations can go here */}
        </div>
    );
}
