import MissionForm from '@/components/adult/missions/TargetForm';
import { createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';

export const Route = createFileRoute('/_app/adult/_layout/mission')({
    component: RouteComponent,
    head: () => ({
        meta: [{ title: 'Tích Tích - Mục tiêu' }],
    }),
});

function RouteComponent() {
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const { data: missions, isLoading, isError } = useMissionsByProfileIdKid(
        managedKidProfileId ?? ''
    );
    const existingMissions =
        !managedKidProfileId || isLoading || isError ? [] : (missions ?? []);

    return (
        <div className="p-4">
            <MissionForm existingMissions={existingMissions} />
        </div>
    );
}
