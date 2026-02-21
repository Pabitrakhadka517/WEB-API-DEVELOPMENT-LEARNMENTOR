'use client';

import React, { createContext, useContext } from 'react';
import { useThemeStore } from '../store/theme-store';

interface ThemeContextType {
    theme: 'light' | 'dark' | 'system';
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeStore();

    // Theme is managed entirely by the local theme-store (persisted in localStorage).
    // The store already syncs changes to the backend via PATCH /api/profile/theme.
    // We intentionally do NOT sync user.theme from backend on profile fetch,
    // as that would override the user's local preference every time they visit profile.

    const contextValue: ThemeContextType = {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;