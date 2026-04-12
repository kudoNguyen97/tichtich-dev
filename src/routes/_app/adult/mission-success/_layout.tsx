import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/adult/mission-success/_layout')({
    component: MissionSuccessLayout,
});

function MissionSuccessLayout() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden ">
            <Outlet />
        </div>
    );
}
