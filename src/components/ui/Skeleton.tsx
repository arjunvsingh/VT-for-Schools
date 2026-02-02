'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'rectangular', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/[0.06]',
        variant === 'text' && 'rounded h-4',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
      style={{ width, height }}
    />
  );
}

export function SkeletonKPIStrip({ count = 6 }: { count?: number }) {
  return (
    <div className={cn(
      'grid gap-3',
      count <= 3 && 'grid-cols-1 md:grid-cols-3',
      count === 4 && 'grid-cols-2 md:grid-cols-4',
      count >= 5 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 p-4 flex flex-col gap-2">
          <Skeleton variant="text" className="w-16 h-2.5" />
          <Skeleton variant="text" className="w-20 h-6" />
          <Skeleton variant="text" className="w-12 h-3 mt-1" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-white/10">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3 border-b border-white/5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-white/10 p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" className="w-5 h-5" />
        <Skeleton variant="text" className="w-24 h-4" />
      </div>
      <Skeleton variant="text" className="w-full h-3" />
      <Skeleton variant="text" className="w-3/4 h-3" />
      <Skeleton className="w-full h-32 mt-2" />
    </div>
  );
}
