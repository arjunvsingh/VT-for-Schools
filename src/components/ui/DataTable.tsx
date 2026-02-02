'use client';

import { useState, useMemo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => ReactNode;
  getValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  pageSize?: number;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  compact?: boolean;
  stickyHeader?: boolean;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  pageSize = 10,
  emptyMessage = 'No data found',
  emptyIcon,
  className,
  compact = false,
  stickyHeader = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Filter by search
  const filtered = useMemo(() => {
    if (!searchQuery.trim() || searchKeys.length === 0) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(row =>
      searchKeys.some(key => {
        const val = (row as Record<string, unknown>)[key];
        if (typeof val === 'string') return val.toLowerCase().includes(q);
        if (typeof val === 'number') return val.toString().includes(q);
        return false;
      })
    );
  }, [data, searchQuery, searchKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const col = columns.find(c => c.key === sortKey);
    return [...filtered].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      if (col?.getValue) {
        aVal = col.getValue(a);
        bVal = col.getValue(b);
      } else {
        aVal = ((a as Record<string, unknown>)[sortKey] as string | number) ?? '';
        bVal = ((b as Record<string, unknown>)[sortKey] as string | number) ?? '';
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filtered, sortKey, sortDir, columns]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null); }
      else setSortDir('asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setCurrentPage(0);
  };

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3 h-3 opacity-30" />;
    if (sortDir === 'asc') return <ChevronUp className="w-3 h-3 text-acid-lime" />;
    return <ChevronDown className="w-3 h-3 text-acid-lime" />;
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-off-white/30" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-off-white focus:outline-none focus:border-acid-lime/30 transition-colors placeholder:text-off-white/20"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className={cn(
                'border-b border-white/10',
                stickyHeader && 'sticky top-0 z-10 bg-stone-black'
              )}>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={cn(
                      'text-[10px] uppercase tracking-wider text-off-white/40 font-medium',
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.sortable !== false && 'cursor-pointer hover:text-off-white/70 transition-colors select-none',
                    )}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className={cn(
                      'flex items-center gap-1',
                      col.align === 'center' && 'justify-center',
                      col.align === 'right' && 'justify-end',
                    )}>
                      {col.header}
                      {col.sortable !== false && <SortIcon colKey={col.key} />}
                    </div>
                  </th>
                ))}
                {onRowClick && <th className={compact ? 'w-8 px-2' : 'w-10 px-3'} />}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.map((row, i) => (
                  <motion.tr
                    key={keyExtractor(row)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-b border-white/5 last:border-0 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-white/[0.04]'
                    )}
                  >
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={cn(
                          'text-sm text-off-white/90',
                          compact ? 'px-3 py-2' : 'px-4 py-3',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                        )}
                      >
                        {col.render
                          ? col.render(row, i)
                          : String((row as Record<string, unknown>)[col.key] ?? '-')
                        }
                      </td>
                    ))}
                    {onRowClick && (
                      <td className={cn('text-right', compact ? 'px-2' : 'px-3')}>
                        <ChevronRight className="w-4 h-4 text-off-white/20" />
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-off-white/30">
            {emptyIcon}
            <p className="text-sm mt-2">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-off-white/40">
          <span>
            Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  'w-7 h-7 rounded-md flex items-center justify-center transition-colors',
                  i === currentPage
                    ? 'bg-acid-lime/20 text-acid-lime border border-acid-lime/30'
                    : 'hover:bg-white/5 text-off-white/40'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
