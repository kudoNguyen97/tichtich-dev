import { Lock, Star } from 'lucide-react';
import type { ApiItem } from '@/features/items/types/item.type';
import { TichTichModal } from '@/components/common/TichTichModal';
import { TichTichButton } from '@/components/common/TichTichButton';
import {
    getItemImageSrc,
    getVisual,
} from '@/constants/children/character/itemVisuals';

interface Props {
    item: ApiItem | null;
    points: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isSubmitting?: boolean;
}

export function BuyModal({
    item,
    points,
    open,
    onOpenChange,
    onConfirm,
    isSubmitting = false,
}: Props) {
    if (!item) return null;
    const affordable = points >= item.pricePoints;
    const visual = getVisual(item);
    const imageSrc = item.imageUrl || getItemImageSrc(item.slug);

    return (
        <TichTichModal
            isOpen={open}
            onClose={() => onOpenChange(false)}
            size="lg"
            title="Xác nhận mở khoá?"
            footer={
                <>
                    <TichTichButton
                        variant="outline"
                        fullWidth
                        isDisabled={isSubmitting}
                        onPress={() => onOpenChange(false)}
                    >
                        Đóng
                    </TichTichButton>
                    <TichTichButton
                        variant={affordable ? 'primary' : 'disabled'}
                        fullWidth
                        leftIcon={<Lock className="size-4" />}
                        isDisabled={!affordable || isSubmitting}
                        isLoading={isSubmitting}
                        onPress={onConfirm}
                    >
                        Mở khoá
                    </TichTichButton>
                </>
            }
        >
            <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex size-24 items-center justify-center rounded-lg bg-[#ACA290]">
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

                <span className="text-base font-bold text-tichtich-black">
                    {item.itemName}
                </span>

                <span className="mt-1 inline-flex items-center gap-1 text-base font-bold text-tichtich-primary-100">
                    {item.pricePoints}
                    <Star className="size-4 fill-[#F06724] text-[#F06724]" />
                </span>

                {!affordable && (
                    <div className="mt-2 text-xs font-semibold text-destructive">
                        Bạn không đủ sao để mở khoá item này.
                    </div>
                )}
            </div>
        </TichTichModal>
    );
}
