import { motion } from 'framer-motion';
import { useRef } from 'react';
import { TimelineEvent } from '@/lib/stores/data-store';

interface TeacherTimelineProps {
    timeline?: TimelineEvent[];
}

export default function TeacherTimeline({ timeline = [] }: TeacherTimelineProps) {
    const containerRef = useRef(null);

    return (
        <div className="relative h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="font-serif italic text-2xl">Career Timeline</h3>
                <div className="h-px bg-white/10 flex-1" />
            </div>

            <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar relative min-h-[400px]">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

                <div className="flex flex-col gap-8 pb-20">
                    {timeline.length > 0 ? timeline.map((event, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="pl-12 relative"
                        >
                            {/* Dot */}
                            <div className="absolute left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-acid-lime outline outline-4 outline-stone-black" />

                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-mono text-off-white/40">{event.year}</span>
                                <h4 className="text-lg font-bold">{event.title}</h4>
                                <p className="text-sm text-off-white/60 max-w-sm">{event.text}</p>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="pl-12 text-sm text-off-white/40 italic">
                            No timeline events recorded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
