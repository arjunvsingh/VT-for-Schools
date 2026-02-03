'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const FloatingLines = dynamic(() => import('./FloatingLines'), { ssr: false });

export function PageBackground() {
  const pathname = usePathname();

  // Don't show on the dashboard home page
  if (pathname === '/') return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
      style={{
        maskImage: 'radial-gradient(ellipse 50% 50% at center, transparent 0%, black 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at center, transparent 0%, black 100%)',
      }}
    >
      <FloatingLines
        enabledWaves={['top', 'bottom']}
        linesGradient={['#D4F268', '#4a7a20', '#1a3a0a']}
        animationSpeed={0.5}
        lineCount={[4, 4]}
        lineDistance={[6, 6]}
        interactive={false}
        parallax={false}
        mixBlendMode="screen"
      />
    </div>
  );
}
