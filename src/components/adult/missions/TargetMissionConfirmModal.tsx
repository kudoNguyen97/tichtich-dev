import dayjs from 'dayjs';
import { TichTichModal } from '@/components/common/TichTichModal';
import { formatRewardAmountDisplay } from '@/components/adult/reward/rewardFormat';
import { cn } from '@/utils/cn';
import { useManagedKidFullName } from '@/hooks/useManagedKidFullName';
import { getWalletLabel } from '@/components/adult/missions/walletOptions';
import type { GoalFormData } from '@/components/adult/missions/targetGoalFormSchema';

function getDaysBetween(start: string, end: string) {
    if (!start || !end) return 0;
    const a = dayjs(start, 'YYYY-MM-DD');
    const b = dayjs(end, 'YYYY-MM-DD');
    if (!a.isValid() || !b.isValid()) return 0;
    return Math.max(0, b.diff(a, 'day'));
}

interface TargetMissionConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    isPending: boolean;
    data: GoalFormData | null;
}

export function TargetMissionConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    data,
}: TargetMissionConfirmModalProps) {
    const childName = useManagedKidFullName();

    if (!data) return null;

    const daysBetween = getDaysBetween(data.startDate, data.endDate);
    const walletLabel = getWalletLabel(data.wallet);
    const messageTrim = data.message.trim();
    const nameTrim = data.name.trim();
    const showMessage =
        messageTrim.length > 0 &&
        messageTrim.toLowerCase() !== nameTrim.toLowerCase();

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <span className="text-2xl font-bold text-tichtich-black">
                    Tạo mục tiêu
                </span>
            }
            size="lg"
            isDismissable={!isPending}
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className={cn(
                            'flex-1 h-12 rounded-full border-2 border-tichtich-black',
                            'bg-white text-sm font-semibold text-tichtich-black',
                            'transition-all active:scale-[0.97] cursor-pointer',
                            isPending && 'opacity-50 pointer-events-none'
                        )}
                    >
                        Chỉnh sửa
                    </button>
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                            void Promise.resolve(onConfirm()).catch(() => {
                                /* lỗi hiển thị qua toast trong mutation */
                            });
                        }}
                        className={cn(
                            'flex-1 h-12 rounded-full text-sm font-semibold text-white',
                            'bg-tichtich-primary-200 hover:brightness-110',
                            'transition-all active:scale-[0.97] cursor-pointer border-none',
                            'disabled:opacity-70 disabled:pointer-events-none'
                        )}
                    >
                        {isPending ? 'Đang tạo…' : 'Xác nhận'}
                    </button>
                </>
            }
        >
            <p className="text-base text-center font-medium text-tichtich-black mb-4">
                {data.name}
            </p>
            <div
                className="rounded-lg bg-tichtich-primary-100 p-4 flex flex-col gap-4"
                aria-label="Tóm tắt mục tiêu"
            >
                <div className="flex items-start text-base  justify-between gap-3 text-tichtich-black">
                    <span className="font-medium shrink-0">Dành cho con</span>
                    <span className="font-semibold text-right">
                        {childName}
                    </span>
                </div>

                <div className="flex items-start text-base  justify-between gap-3 text-tichtich-black">
                    <span className="font-medium shrink-0">
                        Thời gian thực hiện
                    </span>
                    <span className="font-semibold text-right tabular-nums">
                        {daysBetween} ngày
                    </span>
                </div>

                <div className="flex items-start text-base  justify-between gap-3 text-tichtich-black">
                    <span className="font-medium shrink-0">
                        Số tiền cần tích
                    </span>
                    <span className="font-bold tabular-nums text-right">
                        {formatRewardAmountDisplay(data.amount)}
                    </span>
                </div>

                <div className="flex items-start text-base  justify-between gap-3  text-tichtich-black">
                    <span className="font-medium shrink-0">Lấy từ ngăn</span>
                    <span className="font-semibold text-right">
                        {walletLabel}
                    </span>
                </div>

                {showMessage && (
                    <div className="flex items-start text-base  justify-between gap-3  text-tichtich-black">
                        <span className="font-medium shrink-0">Lời nhắn</span>
                        <span className="font-semibold text-right max-w-[65%] wrap-break-word">
                            {data.message}
                        </span>
                    </div>
                )}

                <div className="flex items-center justify-center gap-1  text-tichtich-black text-base t-3">
                    <span className="font-bold text-[40px] text-right text-muted-foreground">
                        30
                    </span>
                    <div>
                        <img
                            src="/icons/target-mission/star.svg"
                            alt="star"
                            className="w-10 h-10"
                        />
                    </div>
                </div>
            </div>
        </TichTichModal>
    );
}
