import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Profile, User } from '@/features/auth/types/auth.type';

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
    devtools(
        persist(
            (set) => ({
                user: null,
                accessToken: null,
                profiles: [],
                selectedProfile: null,
                isAuthenticated: false,

                setAuth: (user, accessToken, profiles) => {
                    localStorage.setItem('access_token', accessToken);
                    const prev = useAuthStore.getState().selectedProfile;
                    const matched = prev
                        ? (profiles.find((p) => p.id === prev.id) ?? null)
                        : null;
                    set({
                        user,
                        accessToken,
                        profiles,
                        isAuthenticated: true,
                        selectedProfile: matched,
                    });
                },

                setProfiles: (profiles) => set({ profiles }),

                setSelectedProfile: (profile) =>
                    set({ selectedProfile: profile }),

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
                    selectedProfile: state.selectedProfile,
                }),
            }
        ),
        { name: 'AuthStore' }
    )
);
