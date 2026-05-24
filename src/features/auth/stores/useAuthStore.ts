import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { Profile, User } from '@/features/auth/types/auth.type';
import { PROFILE_TYPE } from '@/features/auth/constants/profileType';
import { isKidProfile } from '@/features/auth/helpers/profile';
import { STORAGE_KEYS } from '@/constants/storage';

const PRESERVED_LOCAL_STORAGE_KEYS = [
    STORAGE_KEYS.APP_SPLASH_SHOWN,
    STORAGE_KEYS.I18N_LANG,
    STORAGE_KEYS.DEVICE_ID,
] as const;

function clearLocalStorageExcept(keys: readonly string[]) {
    const preserved = new Map<string, string>();

    keys.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            preserved.set(key, value);
        }
    });

    localStorage.clear();

    preserved.forEach((value, key) => {
        localStorage.setItem(key, value);
    });
}

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
    return p?.profileType === PROFILE_TYPE.KID ? id : null;
}

/** Kid đầu tiên theo thứ tự mảng `profiles` (filter kid). */
function firstKidProfileId(profiles: Profile[]): string | null {
    const first = profiles.find(isKidProfile);
    return first?.id ?? null;
}

/**
 * Ưu tiên `preferredId` nếu còn là kid hợp lệ; không thì kid đầu tiên nếu có.
 */
function resolveManagedKidProfileId(
    profiles: Profile[],
    preferredId: string | null
): string | null {
    const valid = validManagedKidId(profiles, preferredId);
    if (valid !== null) return valid;
    return firstKidProfileId(profiles);
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
                    localStorage.setItem(
                        STORAGE_KEYS.ACCESS_TOKEN,
                        accessToken
                    );
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
                        managedKidProfileId: resolveManagedKidProfileId(
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
                        managedKidProfileId: resolveManagedKidProfileId(
                            profiles,
                            state.managedKidProfileId
                        ),
                    })),

                setSelectedProfile: (profile) =>
                    set((state) => ({
                        selectedProfile: profile,
                        managedKidProfileId:
                            profile.profileType === PROFILE_TYPE.KID
                                ? profile.id
                                : resolveManagedKidProfileId(
                                      state.profiles,
                                      state.managedKidProfileId
                                  ),
                    })),

                setManagedKidProfileId: (id) =>
                    set((state) => ({
                        managedKidProfileId:
                            id === null
                                ? null
                                : resolveManagedKidProfileId(
                                      state.profiles,
                                      id
                                  ),
                    })),

                clearSelectedProfile: () =>
                    set({ selectedProfile: null, managedKidProfileId: null }),

                logout: () => {
                    clearLocalStorageExcept(PRESERVED_LOCAL_STORAGE_KEYS);
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
