import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichModal } from '@/components/common/TichTichModal';
import { SpendPreviewChart } from '@/components/children/treasury/SpendPreviewChart';
import {
    buildDepositPayload,
    buildWithdrawPayload,
    mapWalletsToSpendCategories,
    TreasuryExperienceScreen,
} from '@/components/children/treasury/TreasuryExperienceScreen';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useMeSettings } from '@/features/auth/hooks/useAuth';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';
import { missionKeys } from '@/features/missions/api/mission.keys';
import { walletKeys } from '@/features/wallets/api/wallet.keys';
import {
    useBatchDeposit,
    useBatchWithdraw,
    useWalletsByProfileId,
} from '@/features/wallets/hooks/useWallets';
import { queryClient } from '@/lib/queryClient';

export const Route = createLazyFileRoute('/_app/children/_layout/treasury')({
    component: RouteComponent,
});

function RouteComponent() {
    useMeSettings();
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const { data: wallets } = useWalletsByProfileId(managedKidProfileId ?? '');
    const batchDeposit = useBatchDeposit();
    const batchWithdraw = useBatchWithdraw();
    const {
        data: missions,
        isLoading: isMissionsLoading,
        isError: isMissionsError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '', [
        'in_progress',
        'completed',
    ]);
    const [isTreasureOverviewOpen, setIsTreasureOverviewOpen] = useState(false);
    const spendCategories = useMemo(
        () => mapWalletsToSpendCategories(wallets ?? []),
        [wallets]
    );
    const displayMissions = useMemo(() => {
        if (!managedKidProfileId || isMissionsLoading || isMissionsError) {
            return [];
        }

        return missions ?? [];
    }, [managedKidProfileId, isMissionsError, isMissionsLoading, missions]);

    const handleCloseTreasureOverview = () => {
        setIsTreasureOverviewOpen(false);
    };

    const handleGoToCharacter = () => {
        setIsTreasureOverviewOpen(false);
        navigate({ to: '/children/character' });
    };

    return (
        <div>
            <TreasuryExperienceScreen
                profileName={selectedProfile?.fullName}
                wallets={wallets ?? []}
                missions={displayMissions}
                isDepositPending={batchDeposit.isPending}
                isSpendPending={batchWithdraw.isPending}
                onDepositSubmit={({ categories, walletList, resetAddForm }) => {
                    if (!managedKidProfileId) return;

                    const payload = buildDepositPayload(categories, walletList);
                    if (payload.walletUpdates.length === 0) return;

                    batchDeposit.mutate(
                        {
                            profileId: managedKidProfileId,
                            payload,
                        },
                        {
                            onSuccess: async () => {
                                resetAddForm();
                                await queryClient.invalidateQueries({
                                    queryKey:
                                        walletKeys.listByProfileId(
                                            managedKidProfileId
                                        ),
                                });
                                await queryClient.refetchQueries({
                                    queryKey:
                                        walletKeys.listByProfileId(
                                            managedKidProfileId
                                        ),
                                    type: 'active',
                                });
                                setIsTreasureOverviewOpen(true);
                            },
                        }
                    );
                }}
                onSpendSubmit={({
                    selectedCategoryId,
                    spendAmount,
                    spendReason,
                    spendCategories: spendCategoryItems,
                    walletList,
                    resetSpendForm,
                }) => {
                    if (!managedKidProfileId) return;

                    const payload = buildWithdrawPayload({
                        selectedCategoryId,
                        spendAmount,
                        spendReason,
                        wallets: walletList,
                        spendCategories: spendCategoryItems,
                    });
                    if (!payload) return;

                    batchWithdraw.mutate(
                        {
                            profileId: managedKidProfileId,
                            payload,
                        },
                        {
                            onSuccess: () => {
                                resetSpendForm();
                                queryClient.invalidateQueries({
                                    queryKey: missionKeys.listByProfileIdKid(
                                        managedKidProfileId,
                                        ['in_progress', 'completed']
                                    ),
                                });
                            },
                        }
                    );
                }}
            />
            <TichTichModal
                isOpen={isTreasureOverviewOpen}
                onClose={handleCloseTreasureOverview}
                title="Cập nhật thành công"
                size="xl"
                isDismissable={false}
                footer={
                    <>
                        <TichTichButton
                            variant="outline"
                            size="md"
                            fullWidth
                            onClick={handleCloseTreasureOverview}
                        >
                            Đóng
                        </TichTichButton>
                        <TichTichButton
                            variant="primary"
                            size="md"
                            fullWidth
                            onClick={handleGoToCharacter}
                        >
                            Nhân vật
                        </TichTichButton>
                    </>
                }
            >
                <div className="rounded-xl border border-[#C79244] p-3">
                    <p className="text-base font-semibold text-tichtich-black mb-2">
                        Tổng quan kho báu
                    </p>
                    <SpendPreviewChart
                        categories={spendCategories}
                        selectedCategoryId={null}
                        spendAmount={0}
                    />
                </div>
            </TichTichModal>
        </div>
    );
}
