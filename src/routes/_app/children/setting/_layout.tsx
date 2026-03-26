import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/children/setting/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Outlet />
        </>
    );
}
