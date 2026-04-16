import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useWalletsByProfileId } from '@/features/wallets/hooks/useWallets';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';
import type { Mission } from '@/features/missions/types/mission.type';
import { WalletOverviewSection } from '@/components/children/home/WalletOverviewSection';
import { MissionTargetListSection } from '@/components/children/home/MissionTargetListSection';
import { TichTichButton } from '@/components/common/TichTichButton';

export const Route = createFileRoute('/_app/children/_layout/')({
    component: RouteComponent,
});

function RouteComponent() {
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const { data: wallets } = useWalletsByProfileId(
        managedKidProfileId ?? ''
    );

    const {
        data: missions,
        isLoading: isMissionsLoading,
        isError: isMissionsError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '', [
        'in_progress',
        'completed',
    ]);

    const displayMissions = useMemo(() => {
        if (!managedKidProfileId || isMissionsLoading || isMissionsError) {
            return [];
        }
        return missions ?? [];
    }, [managedKidProfileId, isMissionsLoading, isMissionsError, missions]);

    const renderAppendAction = useCallback((mission: Mission) => {
        const pct = mission.progress?.progressPercent ?? 0;

        if (mission.status === 'completed' || pct >= 100) {
            return (
                <TichTichButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {}}
                >
                    Xác nhận hoàn thành
                </TichTichButton>
            );
        }

        if (pct > 0) {
            return (
                <TichTichButton
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => {}}
                >
                    Xem chi tiết
                </TichTichButton>
            );
        }

        return (
            <TichTichButton
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => {}}
            >
                Bắt đầu
            </TichTichButton>
        );
    }, []);

    return (
        <div className="mx-auto bg-background mb-20">
            <div className="p-4 flex flex-col gap-6">
                <WalletOverviewSection wallets={wallets} />
                <MissionTargetListSection
                    missions={displayMissions}
                    renderAppendAction={renderAppendAction}
                />
            </div>
        </div>
    );
}
