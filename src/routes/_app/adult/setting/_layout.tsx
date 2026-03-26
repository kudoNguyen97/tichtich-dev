import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/adult/setting/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Outlet />
        </>
    );
}
