import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/children/treasury/_layout')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="bg-[url('/images/background-illustration-desktop-v2.png')] no-repeat bg-fixed bg-contain bg-start min-h-screen">
            <Outlet />;
        </div>
    );
}
