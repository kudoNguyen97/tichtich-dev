import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
    component: AuthShell,
    beforeLoad: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
            throw redirect({ to: '/profiles' });
        }
        throw redirect({ to: '/login' });
    },
});

function AuthShell() {
    return (
        <div className="mobile-container">
            <Outlet />
        </div>
    );
}
