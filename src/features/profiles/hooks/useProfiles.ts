import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth.service';
import { queryClient } from '@/lib/queryClient';
import { profileKeys } from '@/features/profiles/api/profile.keys';
import { profileService } from '../api/profile.serivce';

export function useProfiles() {
    return useQuery({
        queryKey: profileKeys.profile,
        queryFn: authService.meProfiles,
    });
}

export function useUpdateProfilePinCode() {
    return useMutation({
        mutationFn: (payload: { id: string; pinCode: string }) =>
            profileService.updateProfilePinCode(payload.id, payload.pinCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile });
        },
    });
}
