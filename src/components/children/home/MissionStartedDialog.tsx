import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichModal } from '@/components/common/TichTichModal';
import { getWalletDisplay } from '@/features/wallets/constants/walletDisplay';
import type { Mission } from '@/features/missions/types/mission.type';
import { calendarDaysUntilEnd } from '@/helpers/missions/missionUi';

interface MissionStartedDialogProps {
    isOpen: boolean;
    mission: Mission | null;
    onClose: () => void;
    onGoTreasury: () => void;
}

export function MissionStartedDialog({
    isOpen,
    mission,
    onClose,
    onGoTreasury,
}: MissionStartedDialogProps) {
    const wallet = mission ? getWalletDisplay(mission.walletType) : undefined;

    const days = mission
        ? Math.max(0, calendarDaysUntilEnd(mission.endDay))
        : 0;
    const amountVi = mission ? mission.amount.toLocaleString('vi-VN') : '';

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title="Con đã bắt đầu mục tiêu"
            footer={
                <>
                    <TichTichButton
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={onClose}
                    >
                        Đóng
                    </TichTichButton>
                    <TichTichButton
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={onGoTreasury}
                    >
                        Đến kho báu
                    </TichTichButton>
                </>
            }
        >
            {mission && (
                <div className="flex flex-col gap-4">
                    <p className="text-center text-sm text-tichtich-black">
                        {mission.title}
                    </p>

                    <div className="rounded-2xl bg-tichtich-yellow px-4 py-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 text-sm text-tichtich-black">
                            <span>Thời gian thực hiện:</span>
                            <span className="font-semibold">{days} ngày</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm text-tichtich-black">
                            <span>Số tiền cần tích:</span>
                            <span className="font-semibold">{amountVi} đ</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm text-tichtich-black">
                            <span>Lấy từ ngăn:</span>
                            <span className="inline-flex items-center gap-1.5 font-semibold">
                                {wallet?.label ?? mission.walletType}
                                {wallet?.icon && (
                                    <img
                                        src={wallet.icon}
                                        alt={wallet.label}
                                        className="h-5 w-5"
                                    />
                                )}
                            </span>
                        </div>

                        <div className="mt-1 flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-tichtich-black tabular-nums">
                                {mission.rewardPoint}
                            </span>
                            <img
                                src="/icons/target-mission/star.svg"
                                alt="Sao thưởng"
                                className="h-7 w-7"
                            />
                        </div>
                    </div>
                </div>
            )}
        </TichTichModal>
    );
}
