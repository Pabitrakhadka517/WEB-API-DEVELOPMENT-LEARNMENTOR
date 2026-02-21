import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: ThemeMode;
    resolvedTheme: 'light' | 'dark'; // The actual theme being used (system resolved)
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

// Function to get the system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Function to resolve the actual theme based on the theme setting
const resolveTheme = (theme: ThemeMode): 'light' | 'dark' => {
    if (theme === 'system') {
        return getSystemTheme();
    }
    return theme;
};

// Function to apply the theme to the document
const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    
    // Set color-scheme for system elements
    root.style.colorScheme = resolvedTheme;
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'system',
            resolvedTheme: 'light',
            
            setTheme: (theme: ThemeMode) => {
                const resolvedTheme = resolveTheme(theme);
                applyTheme(resolvedTheme);
                
                set({ theme, resolvedTheme });
                
                // Update user preference on backend if user is authenticated
                if (typeof window !== 'undefined') {
                    const authStorage = localStorage.getItem('auth-storage');
                    if (authStorage) {
                        try {
                            const auth = JSON.parse(authStorage);
                            if (auth.state?.user && auth.state?.accessToken) {
                                // Update user theme preference on backend
                                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/theme`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${auth.state.accessToken}`,
                                    },
                                    body: JSON.stringify({ theme }),
                                }).catch(console.error);
                            }
                        } catch (error) {
                            console.error('Failed to update theme preference:', error);
                        }
                    }
                }
            },
            
            toggleTheme: () => {
                const { theme } = get();
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                get().setTheme(newTheme);
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Re-apply the theme when the store is rehydrated
                    const resolvedTheme = resolveTheme(state.theme);
                    state.resolvedTheme = resolvedTheme;
                    applyTheme(resolvedTheme);
                    
                    // Listen for system theme changes when using 'system' mode
                    if (typeof window !== 'undefined' && state.theme === 'system') {
                        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                        const handleChange = () => {
                            const newResolvedTheme = getSystemTheme();
                            state.resolvedTheme = newResolvedTheme;
                            applyTheme(newResolvedTheme);
                        };
                        mediaQuery.addEventListener('change', handleChange);
                    }
                }
            },
        }
    )
);

// Initialize theme on first load
if (typeof window !== 'undefined') {
    const themeStore = useThemeStore.getState();
    const resolvedTheme = resolveTheme(themeStore.theme);
    themeStore.resolvedTheme = resolvedTheme;
    applyTheme(resolvedTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        const currentState = useThemeStore.getState();
        if (currentState.theme === 'system') {
            const newResolvedTheme = getSystemTheme();
            useThemeStore.setState({ resolvedTheme: newResolvedTheme });
            applyTheme(newResolvedTheme);
        }
    });
}