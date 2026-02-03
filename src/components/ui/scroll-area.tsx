'use client';

import * as React from 'react';
import { ScrollArea } from '@base-ui-components/react/scroll-area';
import { cn } from '@/lib/utils';

interface AppScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
}

export function AppScrollArea({ children, className, viewportClassName }: AppScrollAreaProps) {
  return (
    <ScrollArea.Root className={cn('relative', className)}>
      <ScrollArea.Viewport
        className={cn(
          'h-full overscroll-contain rounded-md',
          viewportClassName,
        )}
      >
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="m-0.5 flex w-1 justify-center rounded bg-white/10 opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75"
      >
        <ScrollArea.Thumb className="w-full rounded bg-white/40" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
