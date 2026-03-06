import { Outlet, createRootRoute } from '@tanstack/react-router';
import '@/styles/styles.css';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { AppNotificationModal } from '@/components/common/AppNotificationModal';
import { useSplash } from '@/hooks/useSplash';
import { SplashScreen } from '@/components/SplashScreen';

export const Route = createRootRoute({
    component: RootComponent,
    pendingComponent: () => <LoadingTichTich isLoading />,
});

function RootComponent() {
    const { visible, dismiss } = useSplash();
    return (
        <>
            <LoadingTichTich />
            <AppNotificationModal />
            <Outlet />
            {visible && <SplashScreen onDone={dismiss} duration={1500} />}
        </>
    );
}
