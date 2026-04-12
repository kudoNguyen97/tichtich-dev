import MissionForm from '@/components/adult/missions/TargetForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/adult/_layout/mission')({
    component: RouteComponent,
    head: () => ({
        meta: [{ title: 'Tích Tích - Mục tiêu' }],
    }),
});

function RouteComponent() {
    return (
        <div className="p-4">
            <MissionForm />
        </div>
    );
}
