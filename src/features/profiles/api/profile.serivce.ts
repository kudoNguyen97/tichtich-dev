import { apiClient } from '@/lib/apiClient';

export const profileService = {
    updateProfilePinCode: (id: string, pinCode: string) =>
        apiClient.put<void>(`/me/profiles/${id}/pin-code`, { pinCode }),
};
