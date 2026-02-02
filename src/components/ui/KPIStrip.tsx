'use client';

import { cn } from '@/lib/utils';
import { TrendBadge } from './TrendBadge';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface KPIMetric {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // percentage change
  icon?: ReactNode;
  color?: 'lime' | 'red' | 'orange' | 'cyan' | 'white';
}

interface KPIStripProps {
  metrics: KPIMetric[];
  className?: string;
  compact?: boolean;
}

const colorMap = {
  lime: 'text-acid-lime',
  red: 'text-red-400',
  orange: 'text-orange-400',
  cyan: 'text-cyan-400',
  white: 'text-off-white',
};

const borderColorMap = {
  lime: 'border-acid-lime/20',
  red: 'border-red-400/20',
  orange: 'border-orange-400/20',
  cyan: 'border-cyan-400/20',
  white: 'border-white/10',
};

export function KPIStrip({ metrics, className, compact = false }: KPIStripProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        metrics.length <= 3 && 'grid-cols-1 md:grid-cols-3',
        metrics.length === 4 && 'grid-cols-2 md:grid-cols-4',
        metrics.length === 5 && 'grid-cols-2 md:grid-cols-5',
        metrics.length >= 6 && 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
        className
      )}
    >
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className={cn(
            'relative rounded-xl border bg-white/[0.02] backdrop-blur-sm overflow-hidden group',
            compact ? 'p-3' : 'p-4',
            borderColorMap[metric.color || 'white'],
            'hover:bg-white/[0.04] transition-colors'
          )}
        >
          {/* Subtle top accent line */}
          <div
            className={cn(
              'absolute top-0 left-0 right-0 h-[1px]',
              metric.color === 'lime' && 'bg-gradient-to-r from-transparent via-acid-lime/40 to-transparent',
              metric.color === 'red' && 'bg-gradient-to-r from-transparent via-red-400/40 to-transparent',
              metric.color === 'orange' && 'bg-gradient-to-r from-transparent via-orange-400/40 to-transparent',
              metric.color === 'cyan' && 'bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent',
              (!metric.color || metric.color === 'white') && 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
            )}
          />

          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-off-white/40 font-medium truncate">
                {metric.label}
              </span>
              <span
                className={cn(
                  'font-bold font-mono leading-none',
                  compact ? 'text-xl' : 'text-2xl',
                  colorMap[metric.color || 'white']
                )}
              >
                {metric.value}
              </span>
              {metric.subtitle && (
                <span className="text-[10px] text-off-white/30 mt-0.5">{metric.subtitle}</span>
              )}
            </div>
            {metric.icon && (
              <div className="opacity-40 group-hover:opacity-60 transition-opacity">
                {metric.icon}
              </div>
            )}
          </div>

          {metric.trend !== undefined && (
            <div className="mt-2">
              <TrendBadge value={metric.trend} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
