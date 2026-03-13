import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/')({
    component: RouteComponent,
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();

        if (!isAuthenticated) {
            throw redirect({ to: '/login' });
        }

        throw redirect({ to: '/profiles' });
    },
});

function RouteComponent() {
    return <div>Hello "/_auth/"!</div>;
}
