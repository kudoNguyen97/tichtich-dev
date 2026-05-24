import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichModal } from '@/components/common/TichTichModal';
import { getWalletDisplay } from '@/features/wallets/constants/walletDisplay';
import type { Mission } from '@/features/missions/types/mission.type';

interface MissionConfirmCompleteDialogProps {
    isOpen: boolean;
    mission: Mission | null;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function MissionConfirmCompleteDialog({
    isOpen,
    mission,
    isLoading = false,
    onClose,
    onConfirm,
}: MissionConfirmCompleteDialogProps) {
    const wallet = mission ? getWalletDisplay(mission.walletType) : undefined;
    const amountVi = mission ? mission.amount.toLocaleString('vi-VN') : '';

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title="Xác nhận hoàn thành mục tiêu"
            footer={
                <>
                    <TichTichButton
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={onClose}
                        isDisabled={isLoading}
                    >
                        Hủy
                    </TichTichButton>
                    <TichTichButton
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={onConfirm}
                        isDisabled={isLoading}
                        isLoading={isLoading}
                    >
                        Xác nhận
                    </TichTichButton>
                </>
            }
        >
            {mission && (
                <div className="flex flex-col gap-4">
                    <p className="text-center text-sm text-tichtich-black">
                        Khi hoàn thành mục tiêu này, số tiền sẽ được trừ từ ví:
                    </p>

                    <div className="rounded-2xl bg-tichtich-yellow px-4 py-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 text-sm text-tichtich-black">
                            <span>Số tiền sẽ trừ:</span>
                            <span className="font-semibold">
                                -{amountVi} đ
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 text-sm text-tichtich-black">
                            <span>Từ ngăn:</span>
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
                    </div>
                </div>
            )}
        </TichTichModal>
    );
}
