'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTimeTravelStore } from '@/lib/stores/time-travel-store';
import { Play, Pause, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSliderProps {
    className?: string;
    showLabels?: boolean;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date: string): string {
    const [year, month] = date.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}

export function TimeSlider({ className, showLabels = true }: TimeSliderProps) {
    const {
        currentDate,
        isPlaying,
        availableDates,
        setDate,
        play,
        pause,
        nextDate,
        prevDate,
        getDateIndex,
    } = useTimeTravelStore();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentIndex = getDateIndex();

    // Auto-play effect
    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                nextDate();
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, nextDate]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const index = parseInt(e.target.value);
        setDate(availableDates[index]);
    };

    const isAtStart = currentIndex === 0;
    const isAtEnd = currentIndex === availableDates.length - 1;
    const isHistorical = currentDate !== availableDates[availableDates.length - 1];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-[90]",
                className
            )}
        >
            <div className={cn(
                "flex items-center gap-4 px-6 py-3 rounded-full border backdrop-blur-xl shadow-2xl",
                isHistorical
                    ? "bg-orange-500/10 border-orange-400/30"
                    : "bg-stone-black/90 border-white/10"
            )}>
                {/* Time Machine Icon */}
                <div className="flex items-center gap-2">
                    <Clock className={cn(
                        "w-4 h-4",
                        isHistorical ? "text-orange-400" : "text-off-white/40"
                    )} />
                    {isHistorical && (
                        <span className="text-xs text-orange-400 font-medium">TIME MACHINE</span>
                    )}
                </div>

                {/* Prev Button */}
                <button
                    onClick={prevDate}
                    disabled={isAtStart}
                    className={cn(
                        "p-1.5 rounded-full transition-colors",
                        isAtStart ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
                    )}
                    aria-label="Previous month"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Play/Pause Button */}
                <button
                    onClick={isPlaying ? pause : play}
                    className={cn(
                        "p-2 rounded-full transition-all",
                        isPlaying
                            ? "bg-acid-lime text-stone-black"
                            : "bg-white/10 hover:bg-white/20"
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4" />
                    ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                    )}
                </button>

                {/* Slider */}
                <div className="flex flex-col gap-1">
                    <input
                        type="range"
                        min={0}
                        max={availableDates.length - 1}
                        value={currentIndex}
                        onChange={handleSliderChange}
                        className="w-48 h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4
                            [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-acid-lime
                            [&::-webkit-slider-thumb]:shadow-lg
                            [&::-webkit-slider-thumb]:cursor-grab
                            [&::-webkit-slider-thumb]:active:cursor-grabbing
                            [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-110"
                    />

                    {showLabels && (
                        <div className="flex justify-between text-[10px] text-off-white/40 w-48">
                            <span>{formatDate(availableDates[0])}</span>
                            <span>{formatDate(availableDates[availableDates.length - 1])}</span>
                        </div>
                    )}
                </div>

                {/* Current Date Display */}
                <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-mono",
                    isHistorical
                        ? "bg-orange-400/20 text-orange-200"
                        : "bg-acid-lime/10 text-acid-lime"
                )}>
                    {formatDate(currentDate)}
                </div>

                {/* Next Button */}
                <button
                    onClick={nextDate}
                    disabled={isAtEnd}
                    className={cn(
                        "p-1.5 rounded-full transition-colors",
                        isAtEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"
                    )}
                    aria-label="Next month"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
