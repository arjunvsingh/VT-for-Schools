'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="text-8xl font-serif italic text-acid-lime">404</div>
        <h1 className="text-2xl font-medium text-off-white">Page not found</h1>
        <p className="text-off-white/50 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-acid-lime text-stone-black font-semibold text-sm hover:bg-acid-lime/90 transition"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-off-white/70 text-sm hover:bg-white/5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>
      </motion.div>
    </main>
  );
}
