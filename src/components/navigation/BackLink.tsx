'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackLinkProps {
    href: string;
    label: string;
    className?: string;
}

export function BackLink({ href, label, className }: BackLinkProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 text-sm text-off-white/60 hover:text-acid-lime transition-colors w-fit",
                className
            )}
        >
            <ArrowLeft className="w-4 h-4" />
            {label}
        </Link>
    );
}
