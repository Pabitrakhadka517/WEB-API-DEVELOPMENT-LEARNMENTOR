import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Theme-aware utility functions
export const themeClasses = {
    // Background classes
    bg: {
        primary: "bg-white dark:bg-gray-900",
        secondary: "bg-gray-50 dark:bg-gray-800",
        tertiary: "bg-gray-100 dark:bg-gray-700",
        card: "bg-white dark:bg-gray-800",
        overlay: "bg-black/50 dark:bg-black/70",
    },
    
    // Text classes
    text: {
        primary: "text-gray-900 dark:text-gray-100",
        secondary: "text-gray-700 dark:text-gray-300",
        tertiary: "text-gray-600 dark:text-gray-400",
        muted: "text-gray-500 dark:text-gray-400",
        inverse: "text-white dark:text-gray-900",
    },
    
    // Border classes
    border: {
        primary: "border-gray-200 dark:border-gray-700",
        secondary: "border-gray-300 dark:border-gray-600",
        accent: "border-blue-200 dark:border-blue-800",
    },
    
    // Button classes
    button: {
        primary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
        secondary: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100",
        danger: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white",
    },
    
    // Input classes
    input: {
        base: "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400",
        error: "border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400",
    },
    
    // Navigation classes
    nav: {
        item: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
        active: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    },
    
    // Status indicator classes
    status: {
        success: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800",
        warning: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        error: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800",
        info: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    }
};

// Generate theme-aware className helper
export function themeClass(category: keyof typeof themeClasses, variant: string, additionalClasses?: string) {
    const baseClass = (themeClasses[category] as any)?.[variant] || "";
    return cn(baseClass, additionalClasses);
}

// Responsive theme-aware grid helper
export function responsiveGrid(cols: { mobile?: number; tablet?: number; desktop?: number } = {}) {
    const mobile = cols.mobile || 1;
    const tablet = cols.tablet || 2;
    const desktop = cols.desktop || 3;
    
    return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} gap-4`;
}

// Theme-aware shadow classes
export const shadows = {
    sm: "shadow-sm dark:shadow-gray-800/20",
    base: "shadow dark:shadow-gray-800/40",
    md: "shadow-md dark:shadow-gray-800/40",
    lg: "shadow-lg dark:shadow-gray-800/50",
    xl: "shadow-xl dark:shadow-gray-800/60",
};

// Animation classes that respect user preferences
export const animations = {
    fade: "transition-opacity duration-300 ease-in-out",
    slide: "transition-transform duration-300 ease-in-out",
    scale: "transition-transform duration-200 ease-in-out hover:scale-105",
    bounce: "motion-safe:animate-bounce",
    spin: "motion-safe:animate-spin",
    pulse: "motion-safe:animate-pulse",
};

export default {
    cn,
    themeClasses,
    themeClass,
    responsiveGrid,
    shadows,
    animations,
};