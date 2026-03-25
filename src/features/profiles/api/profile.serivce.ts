import type { Profile } from '@/features/auth/types/auth.type';
import { apiClient } from '@/lib/apiClient';

export const profileService = {
    getProfileDetail: (id: string) =>
        apiClient.get<Profile>(`/me/profiles/${id}`),
    updateProfile: (id: string, data: Partial<Profile>) =>
        apiClient.put<void>(`/me/profiles/${id}`, data),
    updateProfilePinCode: (id: string, pinCode: string) =>
        apiClient.put<void>(`/me/profiles/${id}/pin-code`, { pinCode }),
};
