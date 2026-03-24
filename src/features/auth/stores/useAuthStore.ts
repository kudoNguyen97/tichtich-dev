import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Profile, User } from '@/features/auth/types/auth.type';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    profiles: Profile[];
    selectedProfile: Profile | null;
    /** Kid đang được quản lý trong UI adult (selectedProfile vẫn là adult). */
    managedKidProfileId: string | null;
    isAuthenticated: boolean;

    setAuth: (user: User, accessToken: string, profiles: Profile[]) => void;
    patchUser: (patch: Partial<User>) => void;
    setProfiles: (profiles: Profile[]) => void;
    setSelectedProfile: (profile: Profile) => void;
    setManagedKidProfileId: (id: string | null) => void;
    clearSelectedProfile: () => void;
    logout: () => void;
}

function validManagedKidId(
    profiles: Profile[],
    id: string | null
): string | null {
    if (!id) return null;
    const p = profiles.find((x) => x.id === id);
    return p?.profileType === 'kid' ? id : null;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                accessToken: null,
                profiles: [],
                selectedProfile: null,
                managedKidProfileId: null,
                isAuthenticated: false,

                setAuth: (user, accessToken, profiles) => {
                    localStorage.setItem('access_token', accessToken);
                    const prev = useAuthStore.getState().selectedProfile;
                    const matched = prev
                        ? (profiles.find((p) => p.id === prev.id) ?? null)
                        : null;
                    const prevManaged =
                        useAuthStore.getState().managedKidProfileId;
                    set({
                        user,
                        accessToken,
                        profiles,
                        isAuthenticated: true,
                        selectedProfile: matched,
                        managedKidProfileId: validManagedKidId(
                            profiles,
                            prevManaged
                        ),
                    });
                },

                patchUser: (patch) =>
                    set((state) =>
                        state.user
                            ? { user: { ...state.user, ...patch } }
                            : state
                    ),

                setProfiles: (profiles) =>
                    set((state) => ({
                        profiles,
                        managedKidProfileId: validManagedKidId(
                            profiles,
                            state.managedKidProfileId
                        ),
                    })),

                setSelectedProfile: (profile) =>
                    set({ selectedProfile: profile }),

                setManagedKidProfileId: (id) =>
                    set((state) => ({
                        managedKidProfileId: validManagedKidId(
                            state.profiles,
                            id
                        ),
                    })),

                clearSelectedProfile: () =>
                    set({ selectedProfile: null, managedKidProfileId: null }),

                logout: () => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('time_expired');
                    set({
                        user: null,
                        accessToken: null,
                        profiles: [],
                        selectedProfile: null,
                        managedKidProfileId: null,
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
                    managedKidProfileId: state.managedKidProfileId,
                }),
            }
        ),
        { name: 'AuthStore' }
    )
);
