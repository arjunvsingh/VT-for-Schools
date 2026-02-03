'use client';

import { Search, Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useCommandBarStore } from '@/lib/hooks/useCommandBar';
import { NotificationsDropdown } from '@/components/ui/NotificationsDropdown';
import { ProfileDropdown } from '@/components/ui/ProfileDropdown';
import { useInterventionStore } from '@/lib/stores';

export function TopBar() {
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const openCommandBar = useCommandBarStore((s) => s.open);
    const pendingCount = useInterventionStore((s) => s.getPendingInterventions().length);

    const handleSearch = useCallback(() => {
        setNotifOpen(false);
        setProfileOpen(false);
        openCommandBar();
    }, [openCommandBar]);

    const handleNotif = useCallback(() => {
        setProfileOpen(false);
        setNotifOpen((prev) => !prev);
    }, []);

    const handleProfile = useCallback(() => {
        setNotifOpen(false);
        setProfileOpen((prev) => !prev);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 pointer-events-none mix-blend-difference text-off-white">
            <Link href="/" className="pointer-events-auto flex items-center gap-4 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-black border border-white/10">
                    <div className="h-4 w-4 rounded-full bg-acid-lime" />
                </div>
                <span className="font-serif italic text-xl tracking-wide hidden md:block">Varsity Tutors</span>
            </Link>

            <div className="pointer-events-auto absolute left-1/2 top-4 -translate-x-1/2 hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-off-white/5 p-1 backdrop-blur-md">
                {['Dashboard', 'Districts', 'Schools', 'Teachers', 'Students', 'Analytics'].map((item) => {
                    const getLink = (name: string) => {
                        switch (name) {
                            case 'Dashboard': return '/';
                            case 'Analytics': return '/analytics';
                            case 'Districts': return '/district/1';
                            case 'Schools': return '/schools';
                            case 'Teachers': return '/teachers';
                            case 'Students': return '/students';
                            default: return '/';
                        }
                    };
                    return (
                        <Link
                            key={item}
                            href={getLink(item)}
                            className="relative rounded-full px-6 py-2 text-sm font-medium transition-colors hover:bg-off-white hover:text-stone-black group"
                        >
                            {item}
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-acid-lime rounded-full transition-all duration-300 group-hover:w-4" />
                        </Link>
                    );
                })}
            </div>

            <div className="pointer-events-auto flex items-center gap-3 relative">
                <button
                    aria-label="Search"
                    onClick={handleSearch}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-off-white/5 backdrop-blur-md hover:bg-off-white/10 transition active:scale-95"
                >
                    <Search className="h-4 w-4" />
                </button>
                <button
                    aria-label="Notifications"
                    onClick={handleNotif}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-off-white/5 backdrop-blur-md hover:bg-off-white/10 transition active:scale-95"
                >
                    <Bell className="h-4 w-4" />
                    {pendingCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">
                            {pendingCount}
                        </span>
                    )}
                </button>
                <button
                    aria-label="Open menu"
                    className="flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-off-white/5 backdrop-blur-md hover:bg-off-white/10 transition active:scale-95"
                >
                    <Menu className="h-4 w-4" />
                </button>
                <button
                    aria-label="User profile"
                    onClick={handleProfile}
                    className="h-10 w-10 rounded-full bg-gradient-to-tr from-acid-lime to-cyan-500 cursor-pointer hover:shadow-lg hover:shadow-acid-lime/20 transition active:scale-95"
                />

                <NotificationsDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                <ProfileDropdown isOpen={profileOpen} onClose={() => setProfileOpen(false)} onOpenCommandBar={openCommandBar} />
            </div>
        </nav>
    );
}
