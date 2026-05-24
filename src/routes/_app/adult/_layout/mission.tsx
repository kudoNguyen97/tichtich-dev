import MissionForm from '@/components/adult/missions/TargetForm';
import { MissionSuccessCard } from '@/components/adult/missions/MissionSuccessCard';
import { MissionThreeTargetsNotice } from '@/components/adult/missions/MissionThreeTargetsNotice';
import { TichTichButton } from '@/components/common/TichTichButton';
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
    const {
        data: missions,
        isLoading,
        isError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '', [
        'pending',
        'in_progress',
        'completed',
    ]);
    const existingMissions =
        !managedKidProfileId || isLoading || isError ? [] : (missions ?? []);

    if (existingMissions.length >= 3) {
        return (
            <div className="p-4 flex flex-col gap-4">
                <MissionThreeTargetsNotice />
                <ul className="flex flex-col gap-4">
                    {existingMissions.map((m) => (
                        <li key={m.id}>
                            <MissionSuccessCard mission={m} displayValue="amount" />
                        </li>
                    ))}
                </ul>
                <TichTichButton variant="primary" size="lg" fullWidth isDisabled>
                    Tạo mục tiêu
                </TichTichButton>
            </div>
        );
    }

    return (
        <div className="p-4">
            <MissionForm existingMissions={existingMissions} />
        </div>
    );
}
