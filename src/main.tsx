import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { routeTree } from '@/routeTree.gen';
import { config } from '@/constants/config';
import { queryClient } from '@/lib/queryClient';
import '@/i18n';
import '@/styles.css';

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                {config.IS_DEV && <TanStackDevtools />}
            </QueryClientProvider>
        </React.StrictMode>
    );
}
