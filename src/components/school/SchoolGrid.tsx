'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SchoolCard } from './SchoolCard';
import { School } from '@/lib/stores/data-store';

interface SchoolGridProps {
    schools: School[];
}

export function SchoolGrid({ schools }: SchoolGridProps) {
    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 pb-8"
        >
            <AnimatePresence mode="popLayout">
                {schools.map((school, index) => (
                    <SchoolCard
                        key={school.id}
                        school={school}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
