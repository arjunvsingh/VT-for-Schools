'use client';

import { cn } from '@/lib/utils';
import { Filter, Calendar } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  filters: FilterConfig[];
  className?: string;
}

export function FilterBar({ filters, className }: FilterBarProps) {
  return (
    <div className={cn(
      'flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm',
      className
    )}>
      <div className="flex items-center gap-1.5 text-off-white/40 mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-wider font-medium">Filters</span>
      </div>

      {filters.map(filter => (
        <div key={filter.key} className="flex flex-col gap-0.5">
          <label className="text-[9px] uppercase tracking-wider text-off-white/30 font-medium px-1">
            {filter.label}
          </label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-off-white focus:outline-none focus:border-acid-lime/30 transition-colors appearance-none cursor-pointer min-w-[120px] hover:bg-white/[0.08]"
          >
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-stone-900 text-off-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

// Commonly used time range options
export const TIME_RANGE_OPTIONS: FilterOption[] = [
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'thisQuarter', label: 'This Quarter' },
  { value: 'thisSemester', label: 'This Semester' },
  { value: 'thisYear', label: 'This Year' },
];
