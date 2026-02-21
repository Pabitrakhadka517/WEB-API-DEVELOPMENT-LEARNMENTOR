'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '../store/theme-store';
import { useAuthStore } from '../store/auth-store';

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
    const { user } = useAuthStore();

    // Sync user theme preference when user logs in
    useEffect(() => {
        if (user?.theme && user.theme !== theme) {
            setTheme(user.theme as 'light' | 'dark' | 'system');
        }
    }, [user?.theme, theme, setTheme]);

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