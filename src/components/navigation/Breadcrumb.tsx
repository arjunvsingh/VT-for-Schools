'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)}>
            <Link
                href="/"
                className="text-off-white/40 hover:text-acid-lime transition-colors"
                aria-label="Dashboard"
            >
                <Home className="w-3.5 h-3.5" />
            </Link>
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={item.href} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-off-white/20" />
                        {isLast ? (
                            <span className="text-off-white/70 truncate max-w-[200px]">{item.label}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-off-white/40 hover:text-acid-lime transition-colors truncate max-w-[200px]"
                            >
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
