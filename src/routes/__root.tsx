import { Outlet, createRootRoute } from '@tanstack/react-router';
import '@/styles/styles.css';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { AppToastRegion } from '@/components/common/Toast';
import { useSplash } from '@/hooks/useSplash';
import { SplashScreen } from '@/components/SplashScreen';

export const Route = createRootRoute({
    component: RootComponent,
    pendingComponent: () => <LoadingTichTich isLoading />,
    pendingMs: 10000,
    pendingMinMs: 10000,
});

function RootComponent() {
    const { visible, dismiss } = useSplash();
    return (
        <>
            <LoadingTichTich />
            <AppToastRegion />
            <Outlet />
            {visible && <SplashScreen onDone={dismiss} duration={1500} />}
        </>
    );
}
