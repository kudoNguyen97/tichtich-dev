import { AlertTriangle, X } from 'lucide-react';
import { TichTichModal } from '@/components/common/TichTichModal';
import { TichTichButton } from '@/components/common/TichTichButton';
import { formatRewardAmountDisplay } from '@/helpers/adult/reward/rewardFormat';

interface ResetWalletConfirmModalProps {
    isOpen: boolean;
    amount: number;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ResetWalletConfirmModal({
    isOpen,
    amount,
    isLoading = false,
    onClose,
    onConfirm,
}: ResetWalletConfirmModalProps) {
    const bullets = [
        'Khôi phục số tiền của các ngăn về bằng 0',
        `Cấp cho con số tiền ban đầu: ${formatRewardAmountDisplay(amount)}`,
        'Xoá hết các mục tiêu đang thực hiện',
        'Xóa tất cả phần thưởng đang chờ',
    ];

    return (
        <TichTichModal isOpen={isOpen} onClose={onClose} size="md">
            <div className="relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-0 top-0 cursor-pointer p-1 text-tichtich-black"
                    aria-label="Đóng"
                >
                    <X className="size-5" />
                </button>

                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                    <AlertTriangle className="size-10 fill-red-500 text-white" />
                </div>

                <h2 className="mb-4 text-center text-lg font-bold text-tichtich-black">
                    Cảnh báo: Đặt lại ví
                </h2>

                <ul className="mb-4 flex flex-col gap-2">
                    {bullets.map((line) => (
                        <li
                            key={line}
                            className="flex items-start gap-2 text-sm text-tichtich-black"
                        >
                            <span
                                className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-red-500"
                                aria-hidden
                            />
                            <span>{line}</span>
                        </li>
                    ))}
                </ul>

                <TichTichButton
                    variant="danger"
                    size="lg"
                    fullWidth
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onPress={onConfirm}
                >
                    Đặt lại ví
                </TichTichButton>
            </div>
        </TichTichModal>
    );
}
