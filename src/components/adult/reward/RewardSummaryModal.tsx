import { TichTichModal } from '@/components/common/TichTichModal';
import { cn } from '@/utils/cn';
import { RewardSummaryDetails } from './RewardSummaryDetails';
import { useManagedKidFullName } from '@/hooks/useManagedKidFullName';

interface RewardSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    message: string;
    /** DD/MM/YYYY, captured when user confirms the form */
    dateFormatted: string;
    onSend: () => void;
}

export function RewardSummaryModal({
    isOpen,
    onClose,
    amount,
    dateFormatted,
    message,
    onSend,
}: RewardSummaryModalProps) {
    const childName = useManagedKidFullName();

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            title={<span className="text-base font-semibold text-tichtich-black">Tóm tắt</span>}
            size="md"
            isDismissable
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className={cn(
                            'flex-1 h-12 rounded-full border-2 border-tichtich-black',
                            'bg-white text-sm font-semibold text-tichtich-black',
                            'transition-all active:scale-[0.97] cursor-pointer'
                        )}
                    >
                        Chỉnh sửa
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onSend();
                            onClose();
                        }}
                        className={cn(
                            'flex-1 h-12 rounded-full text-sm font-semibold text-white',
                            'bg-tichtich-primary-200 hover:brightness-110',
                            'transition-all active:scale-[0.97] cursor-pointer border-none'
                        )}
                    >
                        Gửi
                    </button>
                </>
            }
        >
            <RewardSummaryDetails
                amount={amount}
                childName={childName}
                message={message}
                dateFormatted={dateFormatted}
            />
        </TichTichModal>
    );
}
