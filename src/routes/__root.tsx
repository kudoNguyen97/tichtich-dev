import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router';
import '@/styles/styles.css';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { AppNotificationModal } from '@/components/common/AppNotificationModal';
import { useSplash } from '@/hooks/useSplash';
import { SplashScreen } from '@/components/SplashScreen';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { authService } from '@/features/auth/api/auth.service';
import { GlobalLoadingSync } from '@/components/common/GlobalLoadingSync';

export const Route = createRootRoute({
    beforeLoad: async () => {
        const { accessToken, user, setAuth, logout } = useAuthStore.getState();

        // Skip neu khong co token hoac da hydrate user roi
        if (!accessToken || user) return;

        try {
            const freshUser = await authService.me();
            setAuth(freshUser, accessToken, freshUser.profiles);
        } catch {
            logout();
        }
    },
    component: RootComponent,
    pendingComponent: () => <LoadingTichTich isLoading />,
});

function RootComponent() {
    const { visible, dismiss } = useSplash();
    return (
        <>
            <GlobalLoadingSync />
            <LoadingTichTich />
            <HeadContent />
            <AppNotificationModal />
            <div className="mobile-container flex flex-col min-h-screen bg-white">
                <Outlet />
            </div>
            {visible && <SplashScreen onDone={dismiss} duration={1500} />}
        </>
    );
}
