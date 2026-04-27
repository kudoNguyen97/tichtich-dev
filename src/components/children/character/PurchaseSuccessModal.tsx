import type { ApiItem } from '@/features/items/types/item.type';
import { TichTichModal } from '@/components/common/TichTichModal';
import { TichTichButton } from '@/components/common/TichTichButton';
import {
    getItemImageSrc,
    getVisual,
} from '@/constants/children/character/itemVisuals';

interface Props {
    item: ApiItem | null;
    open: boolean;
    onClose: () => void;
}

export function PurchaseSuccessModal({ item, open, onClose }: Props) {
    if (!item) return null;
    const visual = getVisual(item);
    const imageSrc = item.imageUrl || getItemImageSrc(item.slug);

    return (
        <TichTichModal
            isOpen={open}
            onClose={onClose}
            size="lg"
            title="Mở khoá trang phục"
            footer={
                <TichTichButton variant="primary" fullWidth onPress={onClose}>
                    Đồng ý
                </TichTichButton>
            }
        >
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-28 items-center justify-center rounded-2xl bg-[#ACA290]">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={item.itemName}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <span className="text-5xl">{visual.emoji}</span>
                    )}
                </div>

                <p className="text-sm text-tichtich-black">
                    Chúc mừng bạn đã mở khoá trang phục
                </p>
                <p className="mt-1 text-base font-bold text-tichtich-black">
                    {item.itemName}
                </p>
            </div>
        </TichTichModal>
    );
}
