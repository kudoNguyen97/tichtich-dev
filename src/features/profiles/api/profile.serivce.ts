import type { Profile } from '@/features/auth/types/auth.type';
import type { Gender } from '@/features/auth/constants/gender';
import { apiClient } from '@/lib/apiClient';

export type UpdateProfileInfoPayload = {
    fullName?: string;
    phoneNumber?: string;
    gender?: Gender;
    dateOfBirth?: string;
};

export const profileService = {
    getProfileDetail: (id: string) =>
        apiClient.get<Profile>(`/me/profiles/${id}`),
    updateProfile: (id: string, data: Partial<Profile>) =>
        apiClient.put<void>(`/me/profiles/${id}`, data),
    updateProfileInfo: (id: string, data: UpdateProfileInfoPayload) =>
        apiClient.put<void>(`/me/profiles/${id}`, data),
    updateProfilePinCode: (id: string, pinCode: string) =>
        apiClient.put<void>(`/me/profiles/${id}/pin-code`, { pinCode }),
    createProfile: (data: { profiles: Array<Partial<Profile>> }) =>
        apiClient.post<void>('/me/profiles', data),
};
