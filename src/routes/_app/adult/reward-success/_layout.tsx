import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/adult/reward-success/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <>
            <Outlet />
        </>
    );
}
