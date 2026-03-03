import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth.service';
import { authKeys } from '../api/auth.keys';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { showSuccess } from '@/lib/toast';

export function useMe() {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: authService.me,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.accessToken);
            setUser(data.user);
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
