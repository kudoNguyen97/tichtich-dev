import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth.service';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { queryClient } from '@/lib/queryClient';
import { profileKeys } from '@/features/profiles/api/profile.keys';
import { profileService } from '../api/profile.serivce';
import type { Profile } from '@/features/auth/types/auth.type';

export function useProfiles() {
    return useQuery({
        queryKey: profileKeys.profile,
        queryFn: authService.meProfiles,
    });
}

export function useProfileDetail(id: string) {
    return useQuery({
        queryKey: profileKeys.profileDetail(id),
        queryFn: () => profileService.getProfileDetail(id),
        enabled: Boolean(id),
    });
}

function applyProfilePatchToStore(id: string, patch: Partial<Profile>) {
    const { profiles, selectedProfile, setProfiles, setSelectedProfile } =
        useAuthStore.getState();

    const nextProfiles = profiles.map((p) =>
        p.id === id ? { ...p, ...patch } : p
    );
    setProfiles(nextProfiles);

    if (selectedProfile?.id === id) {
        setSelectedProfile({ ...selectedProfile, ...patch });
    }
}

export function useUpdateProfilePinCode() {
    return useMutation({
        mutationFn: (payload: { id: string; pinCode: string }) =>
            profileService.updateProfilePinCode(payload.id, payload.pinCode),
        onSuccess: (_void, { id, pinCode }) => {
            applyProfilePatchToStore(id, { pinCode });
            queryClient.invalidateQueries({ queryKey: profileKeys.profile });
            queryClient.invalidateQueries({
                queryKey: profileKeys.profileDetail(id),
            });
        },
    });
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: (payload: { id: string; data: Partial<Profile> }) =>
            profileService.updateProfile(payload.id, payload.data),
        onSuccess: (_void, { id, data }) => {
            applyProfilePatchToStore(id, data);

            queryClient.setQueryData<Profile[]>(profileKeys.profile, (old) => {
                if (!old) return old;
                return old.map((p) => (p.id === id ? { ...p, ...data } : p));
            });

            queryClient.invalidateQueries({ queryKey: profileKeys.profile });
            queryClient.invalidateQueries({
                queryKey: profileKeys.profileDetail(id),
            });
        },
    });
}
