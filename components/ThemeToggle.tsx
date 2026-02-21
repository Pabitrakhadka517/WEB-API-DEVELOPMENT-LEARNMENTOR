'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor, Settings, Palette } from 'lucide-react';

interface ThemeToggleProps {
    variant?: 'button' | 'dropdown' | 'settings';
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    variant = 'button',
    showLabel = false,
    size = 'md',
    className = '',
}) => {
    const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    
    const getThemeIcon = (themeType: string, currentTheme: string) => {
        const isActive = currentTheme === themeType;
        const iconProps = {
            size: iconSize,
            className: `${isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'} transition-colors`,
        };

        switch (themeType) {
            case 'light':
                return <Sun {...iconProps} />;
            case 'dark':
                return <Moon {...iconProps} />;
            case 'system':
                return <Monitor {...iconProps} />;
            default:
                return <Palette {...iconProps} />;
        }
    };

    const getThemeLabel = (themeType: string) => {
        switch (themeType) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return 'System';
            default:
                return 'Theme';
        }
    };

    if (variant === 'button') {
        return (
            <button
                onClick={toggleTheme}
                className={`
                    inline-flex items-center justify-center rounded-lg 
                    bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                    text-gray-700 dark:text-gray-300 transition-colors duration-200
                    ${size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'}
                    ${className}
                `}
                title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {resolvedTheme === 'dark' ? (
                    <Sun size={iconSize} />
                ) : (
                    <Moon size={iconSize} />
                )}
                {showLabel && (
                    <span className={`ml-2 text-${size === 'sm' ? 'xs' : size === 'lg' ? 'base' : 'sm'}`}>
                        {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                )}
            </button>
        );
    }

    if (variant === 'dropdown') {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
                        inline-flex items-center justify-center rounded-lg 
                        bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                        text-gray-700 dark:text-gray-300 transition-colors duration-200
                        ${size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'}
                        ${className}
                    `}
                    title="Change theme"
                >
                    {getThemeIcon(theme, theme)}
                    {showLabel && (
                        <span className={`ml-2 text-${size === 'sm' ? 'xs' : size === 'lg' ? 'base' : 'sm'}`}>
                            {getThemeLabel(theme)}
                        </span>
                    )}
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="p-2 space-y-1">
                            {(['light', 'dark', 'system'] as const).map((themeOption) => (
                                <button
                                    key={themeOption}
                                    onClick={() => {
                                        setTheme(themeOption);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center px-3 py-2 rounded-md text-sm
                                        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                                        ${theme === themeOption 
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                            : 'text-gray-700 dark:text-gray-300'
                                        }
                                    `}
                                >
                                    {getThemeIcon(themeOption, theme)}
                                    <span className="ml-3">{getThemeLabel(themeOption)}</span>
                                    {themeOption === 'system' && (
                                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                                            ({resolvedTheme})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'settings') {
        return (
            <div className={`space-y-3 ${className}`}>
                <div className="flex items-center space-x-2">
                    <Palette size={iconSize} className="text-gray-700 dark:text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Theme Preference
                    </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['light', 'dark', 'system'] as const).map((themeOption) => (
                        <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption)}
                            className={`
                                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                                ${theme === themeOption
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                            `}
                        >
                            {getThemeIcon(themeOption, theme)}
                            <span className="mt-2 text-sm font-medium">
                                {getThemeLabel(themeOption)}
                            </span>
                            {themeOption === 'system' && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    (Currently {resolvedTheme})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your theme preference will be saved and synced across all your sessions.
                    {theme === 'system' && ' System mode automatically switches between light and dark based on your device settings.'}
                </p>
            </div>
        );
    }

    return null;
};

export default ThemeToggle;