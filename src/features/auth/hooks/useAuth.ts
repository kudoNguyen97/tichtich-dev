import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth.service';
import { authKeys } from '../api/auth.keys';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { showSuccess } from '@/lib/toast';
import type { User } from '../types/auth.type';

export function useMe() {
    const { isAuthenticated } = useAuthStore();

    return useQuery<User>({
        queryKey: authKeys.me(),
        queryFn: authService.me,
        select: (data) => data,
        enabled: isAuthenticated,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            setAuth(data.user, data.sessionToken, data.user.profiles);
            queryClient.invalidateQueries({ queryKey: authKeys.me() });
            showSuccess('success.login');
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const logout = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logout();
            queryClient.clear();
            showSuccess('success.logout');
        },
    });
}
