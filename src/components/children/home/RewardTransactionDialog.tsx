import { useCallback, useEffect, useState } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import useEmblaCarousel from 'embla-carousel-react';
import { TichTichButton } from '@/components/common/TichTichButton';
import { RewardCardItem } from '@/components/children/home/RewardCardItem';
import type { RewardCard } from '@/components/children/home/RewardCardItem';

interface Props {
    isOpen: boolean;
    totalAmount: number;
    rewards: RewardCard[];
    onShare?: (reward: RewardCard, index: number) => void; // optional, tự kết nối sau
    onClose: () => void;
    navigateTo: string; // path để navigate khi bấm Bắt đầu, vd: '/adult/journey'
}

export function RewardTransactionDialog({
    isOpen,
    totalAmount,
    rewards,
    onShare,
    onClose,
    // navigateTo,
}: Props) {
    // const navigate = useNavigate();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        containScroll: 'trimSnaps',
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const handleShare = () => {
        onShare?.(rewards[selectedIndex], selectedIndex);
    };

    // const handleStart = () => {
    //     onClose();
    //     navigate({ to: navigateTo });
    // };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 border-none"
        >
            <Modal
                className="rounded-3xl"
                aria-label="Reward Transaction Dialog"
            >
                <Dialog
                    className="border-none outline-none shadow-modal flex flex-col items-center"
                    aria-label="Reward Transaction Dialog Content"
                >
                    {/* Header */}
                    <div className="text-center mb-5 bg-tichtich-primary-300 rounded-xl p-2.5 ">
                        <p className="font-bold text-tichtich-black">
                            {rewards.length} món quà bất ngờ:{' '}
                            {totalAmount.toLocaleString('vi-VN')} đ
                        </p>
                    </div>

                    {/* Carousel */}
                    <div ref={emblaRef} className="overflow-hidden mb-3">
                        <div className="flex select-none cursor-grab active:cursor-grabbing">
                            {rewards.map((reward) => (
                                <div
                                    key={reward.id}
                                    className="flex-[0_0_82%] shrink-0 px-1"
                                >
                                    <RewardCardItem reward={reward} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots */}
                    {/* <div className="flex justify-center gap-1.5 mb-5">
                        {rewards.map((_, i) => (
                            <span
                                key={i}
                                className="h-2 rounded-full transition-all duration-200"
                                style={{
                                    width: i === selectedIndex ? 20 : 8,
                                    background:
                                        i === selectedIndex
                                            ? '#F59E0B'
                                            : '#D1D5DB',
                                }}
                            />
                        ))}
                    </div> */}

                    {/* Actions */}
                    <TichTichButton
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="w-[50%]"
                    >
                        Chia tiền ngay
                    </TichTichButton>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
