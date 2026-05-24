import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { TichTichModal } from '@/components/common/TichTichModal';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TreasuryExperienceScreen } from '@/components/children/treasury/TreasuryExperienceScreen';
import type { Mission } from '@/features/missions/types/mission.type';
import type { Wallet } from '@/features/wallets/types/wallet.type';
import { MISSION_STATUS } from '@/features/missions/constants/missionStatus';
import { WALLET_TYPE } from '@/features/wallets/constants/walletType';

export const Route = createLazyFileRoute('/trail')({
    component: RouteComponent,
});

const TRAIL_DOWNLOAD_URL = 'https://tichtich.vn/tai-ung-dung';

const trailWallets: Wallet[] = [
    {
        id: 'wallet-saving-trial',
        walletType: WALLET_TYPE.SAVING,
        balance: 300000,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'wallet-education-trial',
        walletType: WALLET_TYPE.EDUCATION,
        balance: 180000,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'wallet-charity-trial',
        walletType: WALLET_TYPE.CHARITY,
        balance: 120000,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'wallet-spending-trial',
        walletType: WALLET_TYPE.SPENDING,
        balance: 95000,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
    },
];

const trailMissions: Mission[] = [
    {
        id: 'mission-trial-1',
        title: 'Để dành mua truyện tranh',
        description: 'Tiết kiệm đủ 500.000đ trong tháng này',
        profileId: 'trial-kid-profile',
        walletType: WALLET_TYPE.SAVING,
        amount: 500000,
        startDay: '2026-05-01',
        endDay: '2026-05-31',
        rewardPoint: 50,
        status: MISSION_STATUS.IN_PROGRESS,
        progress: {
            id: 'mission-progress-trial-1',
            missionId: 'mission-trial-1',
            profileId: 'trial-kid-profile',
            walletId: 'wallet-saving-trial',
            currentBalance: 300000,
            targetAmount: 500000,
            progressPercent: 60,
            isCompleted: false,
            createdAt: '2026-05-01T00:00:00.000Z',
            updatedAt: '2026-05-07T00:00:00.000Z',
        },
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-07T00:00:00.000Z',
    },
];

function RouteComponent() {
    const navigate = useNavigate();
    const [isTrialCtaOpen, setIsTrialCtaOpen] = useState(false);
    const mockWallets = useMemo(() => trailWallets, []);
    const mockMissions = useMemo(() => trailMissions, []);

    const openTrialCta = () => setIsTrialCtaOpen(true);
    const closeTrialCta = () => setIsTrialCtaOpen(false);

    return (
        <div className="bg-[url('/images/background-illustration-desktop-v2.png')] no-repeat bg-fixed bg-contain bg-start min-h-screen">
            <TreasuryExperienceScreen
                profileName="bé"
                wallets={mockWallets}
                missions={mockMissions}
                onDepositSubmit={() => openTrialCta()}
                onSpendSubmit={() => openTrialCta()}
            />

            <TichTichModal
                isOpen={isTrialCtaOpen}
                onClose={closeTrialCta}
                title="Tiếp tục trải nghiệm"
                size="xl"
                footer={
                    <>
                        <TichTichButton
                            variant="outline"
                            size="md"
                            fullWidth
                            onClick={() =>
                                window.open(
                                    TRAIL_DOWNLOAD_URL,
                                    '_blank',
                                    'noopener,noreferrer'
                                )
                            }
                        >
                            Tải app
                        </TichTichButton>
                        <TichTichButton
                            variant="primary"
                            size="md"
                            fullWidth
                            onClick={() => navigate({ to: '/login' })}
                        >
                            Tạo tài khoản / Đăng nhập
                        </TichTichButton>
                    </>
                }
            >
                <p className="text-sm text-center text-tichtich-black mb-0">
                    Để trải nghiệm thêm, bạn vui lòng tải app hoặc tạo account
                    đăng nhập.
                </p>
            </TichTichModal>
        </div>
    );
}
