'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Settings, HelpCircle, Keyboard, LogOut } from 'lucide-react';
import { useInterventionStore } from '@/lib/stores';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenCommandBar?: () => void;
}

export function ProfileDropdown({ isOpen, onClose, onOpenCommandBar }: ProfileDropdownProps) {
    const showToast = useInterventionStore((s) => s.showToast);

    const menuItems = [
        { label: 'Settings', icon: Settings, action: () => showToast({ type: 'info', title: 'Settings', message: 'Settings panel coming soon' }) },
        { label: 'Help & Support', icon: HelpCircle, action: () => showToast({ type: 'info', title: 'Help', message: 'Support resources coming soon' }) },
        { label: 'Keyboard Shortcuts', icon: Keyboard, action: () => { onClose(); onOpenCommandBar?.(); } },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, transformOrigin: 'top right' }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                        className="absolute right-0 top-14 z-[70] w-[260px] rounded-2xl border border-white/10 bg-stone-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                    >
                        {/* Profile Header */}
                        <div className="px-4 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-acid-lime to-cyan-500 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-off-white truncate">Dr. Sarah Chen</p>
                                    <p className="text-xs text-off-white/40">District Administrator</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => { item.action(); onClose(); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-off-white/70 hover:bg-white/5 hover:text-off-white transition-colors"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Divider + Sign Out */}
                        <div className="border-t border-white/5 py-1">
                            <button
                                onClick={() => {
                                    showToast({ type: 'info', title: 'Signed Out', message: 'You have been signed out' });
                                    onClose();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
