import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth.service';
import { profileService } from '../api/profile.serivce';
import { queryClient } from '@/lib/queryClient';

export function useProfiles() {
    return useQuery({
        queryKey: ['profiles'],
        queryFn: authService.meProfiles,
    });
}

export function useUpdateProfilePinCode() {
    return useMutation({
        mutationFn: (payload: { id: string; pinCode: string }) =>
            profileService.updateProfilePinCode(payload.id, payload.pinCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
    });
}
