import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/_app')({
    beforeLoad: () => {
        const { isAuthenticated, selectedProfile } =
            useAuthStore.getState();
        if (!isAuthenticated) throw redirect({ to: '/login' });
        if (!selectedProfile) throw redirect({ to: '/profiles' });
    },
    component: () => <Outlet />,
});
