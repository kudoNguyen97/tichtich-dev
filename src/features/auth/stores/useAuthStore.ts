import { create } from 'zustand';
import type { User } from '../types/auth.type';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/features/profiles/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    profiles: Profile[] | null;
    setAuth: (
        user: User | null,
        accessToken: string,
        profiles: Profile[]
    ) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            profiles: null,
            isAuthenticated: false,
            setAuth: (user, accessToken, profiles) => {
                localStorage.setItem('access_token', accessToken);
                set({ user, accessToken, profiles, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('access_token');
                set({ user: null });
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                profiles: state.profiles,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
