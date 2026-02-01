import { Search, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

export function TopBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none mix-blend-difference text-off-white">
            {/* Pointer events auto to interactive elements only, to allow clicking through the clear areas if needed, 
            but usually nav bar captures events. 
            Design system says "Fixed glassmorphism".
            I will use pointer-events-auto on the container itself if it has background, 
            OR on the specific elements if floating.
            Design system: "Pill-shaped navigation bar using #E7E5E4/5 background with heavy backdrop-blur"
        */}
            <div className="pointer-events-auto flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-black border border-white/10">
                    <div className="h-4 w-4 rounded-full bg-acid-lime" />
                </div>
                <span className="font-serif italic text-xl tracking-wide hidden md:block">Orbital Command</span>
            </div>

            <div className="pointer-events-auto absolute left-1/2 top-4 -translate-x-1/2 hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-off-white/5 p-1 backdrop-blur-md">
                {['Dashboard', 'Districts', 'Schools', 'Teachers', 'Students'].map((item) => {
                    const getLink = (name: string) => {
                        switch (name) {
                            case 'Dashboard': return '/';
                            case 'Districts': return '/district/1';
                            case 'Schools': return '/school/s1';
                            case 'Teachers': return '/teachers';
                            case 'Students': return '/students';
                            default: return '/';
                        }
                    };
                    return (
                        <Link
                            key={item}
                            href={getLink(item)}
                            className="rounded-full px-6 py-2 text-sm font-medium transition-colors hover:bg-off-white hover:text-stone-black"
                        >
                            {item}
                        </Link>
                    );
                })}
            </div>

            <div className="pointer-events-auto flex items-center gap-3">
                <button
                    aria-label="Search"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-off-white/5 backdrop-blur-md hover:bg-off-white/10 transition"
                >
                    <Search className="h-4 w-4" />
                </button>
                <button
                    aria-label="Notifications"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-off-white/5 backdrop-blur-md hover:bg-off-white/10 transition"
                >
                    <Bell className="h-4 w-4" />
                </button>
                <button
                    aria-label="Open menu"
                    className="flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-off-white/5 backdrop-blur-md hover:bg-off-white/10 transition"
                >
                    <Menu className="h-4 w-4" />
                </button>
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-acid-lime to-cyan-500" aria-label="User profile" />
            </div>
        </nav>
    );
}
