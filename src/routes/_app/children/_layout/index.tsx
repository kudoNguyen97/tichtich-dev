import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useWalletsByProfileId } from '@/features/wallets/hooks/useWallets';
import { useEquippedItems } from '@/features/items/hooks/useItems';
import {
    useKidMissionResolveMutation,
    useKidMissionStartMutation,
    useMissionsByProfileIdKid,
} from '@/features/missions/hooks/useMissions';
import type { Mission } from '@/features/missions/types/mission.type';
import { KidHeroBanner } from '@/components/children/home/KidHeroBanner';
import { WalletOverviewSection } from '@/components/children/home/WalletOverviewSection';
import { MissionTargetListSection } from '@/components/children/home/MissionTargetListSection';
import { MissionStartedDialog } from '@/components/children/home/MissionStartedDialog';
import { MissionConfirmCompleteDialog } from '@/components/children/home/MissionConfirmCompleteDialog';
import { MissionCompletedSuccessDialog } from '@/components/children/home/MissionCompletedSuccessDialog';
import { TichTichButton } from '@/components/common/TichTichButton';
import { getMissionAppendDescriptor } from '@/helpers/missions/missionUi';
import { GENDER } from '@/features/auth/constants/gender';

export const Route = createFileRoute('/_app/children/_layout/')({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const profiles = useAuthStore((s) => s.profiles);

    const [startedMission, setStartedMission] = useState<Mission | null>(null);
    const [confirmingMission, setConfirmingMission] = useState<Mission | null>(
        null
    );
    const [completedMission, setCompletedMission] = useState<Mission | null>(
        null
    );

    const kidProfile = useMemo(
        () => profiles.find((p) => p.id === managedKidProfileId) ?? null,
        [profiles, managedKidProfileId]
    );

    const { data: wallets } = useWalletsByProfileId(managedKidProfileId ?? '');
    const { data: equippedItems } = useEquippedItems(managedKidProfileId ?? '');

    const totalBalance = useMemo(
        () => wallets?.reduce((sum, w) => sum + w.balance, 0) ?? 0,
        [wallets]
    );

    const {
        data: missions,
        isLoading: isMissionsLoading,
        isError: isMissionsError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '', [
        'pending',
        'in_progress',
        'completed',
    ]);

    const displayMissions = useMemo(() => {
        if (!managedKidProfileId || isMissionsLoading || isMissionsError) {
            return [];
        }
        return missions ?? [];
    }, [managedKidProfileId, isMissionsLoading, isMissionsError, missions]);

    const startKidMutation = useKidMissionStartMutation();
    const confirmKidMutation = useKidMissionResolveMutation();

    const renderAppendAction = useCallback(
        (mission: Mission) => {
            const profileId = managedKidProfileId ?? '';
            if (!profileId) return null;

            const desc = getMissionAppendDescriptor(mission);

            switch (desc.kind) {
                case 'none':
                    return null;
                case 'pending_before_start':
                    return (
                        <TichTichButton
                            variant="outline"
                            size="md"
                            fullWidth
                            isDisabled
                        >
                            {desc.startDayLabel}
                        </TichTichButton>
                    );
                case 'pending_start':
                    return (
                        <TichTichButton
                            variant="outline"
                            size="sm"
                            fullWidth
                            isDisabled={startKidMutation.isPending}
                            onClick={() =>
                                startKidMutation.mutate(
                                    {
                                        missionId: mission.id,
                                        profileId,
                                    },
                                    {
                                        onSuccess: (data) =>
                                            setStartedMission(data),
                                    }
                                )
                            }
                        >
                            Bắt đầu
                        </TichTichButton>
                    );
                case 'confirm_complete':
                    return (
                        <TichTichButton
                            variant="primary"
                            size="sm"
                            fullWidth
                            isDisabled={confirmKidMutation.isPending}
                            onClick={() => setConfirmingMission(mission)}
                        >
                            Xác nhận hoàn thành
                        </TichTichButton>
                    );
                default:
                    return null;
            }
        },
        [
            managedKidProfileId,
            startKidMutation.isPending,
            startKidMutation.mutate,
            confirmKidMutation.isPending,
        ]
    );

    return (
        <div className="mx-auto bg-background mb-20">
            <KidHeroBanner
                kidName={kidProfile?.fullName ?? ''}
                totalBalance={totalBalance}
                gender={kidProfile?.gender ?? GENDER.MALE}
                equippedItems={equippedItems ?? []}
            />
            <div className="p-4 flex flex-col gap-6">
                <WalletOverviewSection wallets={wallets} />
                <MissionTargetListSection
                    missions={displayMissions}
                    renderAppendAction={renderAppendAction}
                />
            </div>

            <MissionStartedDialog
                isOpen={!!startedMission}
                mission={startedMission}
                onClose={() => setStartedMission(null)}
                onGoTreasury={() => {
                    setStartedMission(null);
                    navigate({ to: '/children/treasury' });
                }}
            />

            <MissionConfirmCompleteDialog
                isOpen={!!confirmingMission}
                mission={confirmingMission}
                isLoading={confirmKidMutation.isPending}
                onClose={() => setConfirmingMission(null)}
                onConfirm={() => {
                    if (!confirmingMission || !managedKidProfileId) return;
                    confirmKidMutation.mutate(
                        {
                            missionId: confirmingMission.id,
                            profileId: managedKidProfileId,
                        },
                        {
                            onSuccess: (data) => {
                                setConfirmingMission(null);
                                setCompletedMission(data.mission);
                            },
                        }
                    );
                }}
            />

            <MissionCompletedSuccessDialog
                isOpen={!!completedMission}
                mission={completedMission}
                onClose={() => setCompletedMission(null)}
                onGoCharacter={() => {
                    setCompletedMission(null);
                    navigate({ to: '/children/character' });
                }}
            />
        </div>
    );
}
