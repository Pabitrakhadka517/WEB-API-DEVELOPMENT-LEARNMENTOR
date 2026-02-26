'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string; // Classes for the root div
    containerClassName?: string; // Classes for the icon container
    textClassName?: string; // Classes for the text
    showText?: boolean;
}

/**
 * Logo Component
 * 
 * A responsive, visually prominent logo component.
 * Uses 'fill' for optimization and Tailwind for responsive sizing.
 */
export default function Logo({ 
    className, 
    containerClassName,
    textClassName,
    showText = true 
}: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3 md:gap-4", className)}>
            <div
                className={cn(
                    "relative bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 p-2 shrink-0 transition-transform duration-300 hover:scale-105",
                    "w-12 h-12 md:w-14 md:h-14", // Default sizes: 48px -> 56px
                    containerClassName
                )}
            >
                <div className="relative w-full h-full"> 
                    <Image
                        src="/learnmentor.png"
                        alt="LearnMentor Logo"
                        fill
                        sizes="(max-width: 768px) 48px, 56px"
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            {showText && (
                <span className={cn(
                    "text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300",
                    textClassName
                )}>
                    LearnMentor
                </span>
            )}
        </div>
    );
}
