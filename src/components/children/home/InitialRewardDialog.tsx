import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichModal } from '@/components/common/TichTichModal';
import pigEquipIcon from '@/assets/icons/items/pig-equip.svg';

interface InitialRewardDialogProps {
    isOpen: boolean;
    amount: number;
    nameProfile: string;
    onShareNow: () => void;
    onClose: () => void;
}

export function InitialRewardDialog({
    isOpen,
    amount,
    nameProfile,
    onShareNow,
    onClose,
}: InitialRewardDialogProps) {
    const profileName = nameProfile.trim();
    const greeting = profileName ? `Xin chào ${profileName}` : 'Xin chào';

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            className="rounded-3xl bg-tichtich-primary-300 border-2 border-[#ED7B46] p-4"
            title={greeting}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-[112px] h-[112px] rounded-2xl bg-tichtich-primary-200 flex items-center justify-center mb-4">
                    <img
                        src={pigEquipIcon}
                        alt="Heo Tích Tích"
                        className="w-[74px] h-[74px]"
                    />
                </div>
                <p className="text-[52px] leading-none font-bold text-tichtich-primary-200 mb-5">
                    + {amount.toLocaleString('vi-VN')} đ
                </p>
                <p className="text-[30px] font-semibold text-tichtich-black leading-tight mb-3">
                    Heo Tích Tích tặng bé mama món quà đầu tiên!
                </p>
                <p className="text-base text-tichtich-black mb-1">
                    Con nhận được{' '}
                    <span className="font-semibold text-tichtich-primary-200">
                        {amount.toLocaleString('vi-VN')}đ
                    </span>{' '}
                    Heo Ảo rồi nè!
                </p>
                <p className="text-base text-tichtich-black mb-6">
                    Chia tiền ngay để nhận{' '}
                    <span className="font-semibold text-tichtich-primary-200">
                        40 sao
                    </span>{' '}
                    và mở đồ mới nha
                </p>
                <TichTichButton
                    variant="primary"
                    size="md"
                    onClick={onShareNow}
                    className="w-full"
                >
                    Chia tiền ngay
                </TichTichButton>
            </div>
        </TichTichModal>
    );
}
