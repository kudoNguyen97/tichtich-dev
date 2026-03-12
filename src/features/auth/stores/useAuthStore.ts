import { create } from 'zustand';
import type { Profile, User } from '../types/auth.type';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    profiles: Profile[];
    selectedProfile: Profile | null;
    isAuthenticated: boolean;

    setAuth: (user: User, accessToken: string, profiles: Profile[]) => void;
    setProfiles: (profiles: Profile[]) => void;
    setSelectedProfile: (profile: Profile) => void;
    clearSelectedProfile: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            profiles: [],
            selectedProfile: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, profiles) => {
                localStorage.setItem('access_token', accessToken);
                set({ user, accessToken, profiles, isAuthenticated: true });
            },

            setProfiles: (profiles) => set({ profiles }),

            setSelectedProfile: (profile) => set({ selectedProfile: profile }),

            clearSelectedProfile: () => set({ selectedProfile: null }),

            logout: () => {
                localStorage.removeItem('access_token');
                set({
                    user: null,
                    accessToken: null,
                    profiles: [],
                    selectedProfile: null,
                    isAuthenticated: false,
                });
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
