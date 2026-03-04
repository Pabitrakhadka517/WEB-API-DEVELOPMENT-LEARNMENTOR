'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import Logo from './Logo';

interface NavLink {
    href: string;
    label: string;
    isAnchor?: boolean;
}

interface MobileNavProps {
    links: NavLink[];
    className?: string;
}

export function MobileNav({ links, className }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors",
                    className
                )}
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div 
                className={cn(
                    "md:hidden fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] bg-white dark:bg-slate-900 z-50 shadow-2xl transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                    <Logo containerClassName="w-10 h-10" textClassName="text-lg" />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1">
                    {links.map((link) => (
                        link.isAnchor ? (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                {link.label}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                        <ThemeToggle variant="button" size="sm" />
                    </div>
                    
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full py-3 text-center text-base font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        Sign In
                    </Link>
                    
                    <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="block w-full py-3 text-center text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    );
}

export default MobileNav;
