import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';

import '@/styles/styles.css';
import { LoadingTichTich } from '#/components/common/LoadingTichTich';

export const Route = createRootRoute({
    component: RootComponent,
    pendingComponent: () => <LoadingTichTich isLoading={true} />,
    pendingMs: 200,
    pendingMinMs: 300,
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <TanStackDevtools
                config={{
                    position: 'bottom-right',
                }}
                plugins={[
                    {
                        name: 'TanStack Router',
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                ]}
            />
        </>
    );
}
