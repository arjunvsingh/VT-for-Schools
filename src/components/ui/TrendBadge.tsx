'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendBadgeProps {
  value: number; // percentage change, e.g. 5.2 or -3.1
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function TrendBadge({ value, label, className, size = 'sm' }: TrendBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-mono',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        isNeutral && 'text-off-white/60 bg-white/5 border-white/10',
        isPositive && 'text-acid-lime bg-acid-lime/10 border-acid-lime/20',
        !isPositive && !isNeutral && 'text-red-400 bg-red-400/10 border-red-400/20',
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{isPositive ? '+' : ''}{value.toFixed(1)}%</span>
      {label && <span className="opacity-60">{label}</span>}
    </div>
  );
}
