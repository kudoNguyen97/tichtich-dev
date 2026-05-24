import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/adult/reset-profile/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
