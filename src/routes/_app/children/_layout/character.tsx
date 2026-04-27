import { createFileRoute } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import { ItemCard } from '@/components/children/character/ItemCard';
import { Button } from 'react-aria-components';
import { ItemGridSkeleton } from '@/components/children/character/ItemGridSkeleton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CharacterStage } from '@/components/children/character/CharacterStage';
import { PointBadge } from '@/components/children/character/PointBadge';
import { CategoryTabs } from '@/components/children/character/CategoryTabs';
import { SubCategoryTabs } from '@/components/children/character/SubCategoryTabs';
import { CATEGORY_BY_KEY } from '@/constants/children/character/tabs';
import { BuyModal } from '@/components/children/character/BuyModal';
import { PurchaseSuccessModal } from '@/components/children/character/PurchaseSuccessModal';
import { PointsInfoModal } from '@/components/children/character/PointsInfoModal';
import {
    useItems,
    useEquippedItems,
    usePurchaseItem,
    useEquipItem,
    useUnequipItem,
} from '@/features/items/hooks/useItems';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useRewardPoints } from '@/features/reward-points/hooks/useRewardPoints';
import { getSlotFromItem } from '@/constants/children/character/itemVisuals';
import type { ApiCategory, ApiItem } from '@/features/items/types/item.type';
import { ApiError } from '@/types/api.type';
import { cn } from '@/utils/cn';
import useEmblaCarousel from 'embla-carousel-react';

export const Route = createFileRoute('/_app/children/_layout/character')({
    component: RouteComponent,
    head: () => ({
        meta: [
            { title: 'Tích Tích - Nhân vật' },
            {
                name: 'description',
                content:
                    'Trang quản lý nhân vật: mua và trang bị trang phục, giày, phụ kiện và đồ hiếm.',
            },
        ],
    }),
});

function RouteComponent() {
    const profile = useSelectedChildProfile();
    if (!profile) return null;
    const profileId = profile.id;
    const [category, setCategory] = useState<ApiCategory>('clothing');
    const [itemType, setItemType] = useState<string | null>('tops');
    const [buyTarget, setBuyTarget] = useState<ApiItem | null>(null);
    const [successItem, setSuccessItem] = useState<ApiItem | null>(null);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        containScroll: 'trimSnaps',
    });

    const showNotification = useNotificationStore((state) => state.show);
    const rewardPointsQuery = useRewardPoints(profileId);
    const equippedQuery = useEquippedItems(profileId);
    const purchaseMutation = usePurchaseItem(profileId);
    const equipMutation = useEquipItem(profileId);
    const unequipMutation = useUnequipItem(profileId);
    const points = rewardPointsQuery.data?.totalPoints ?? 0;
    const equippedItems = equippedQuery.data ?? [];
    const isActionPending =
        purchaseMutation.isPending ||
        equipMutation.isPending ||
        unequipMutation.isPending;

    const resolvedItemType = useMemo(() => {
        if (!itemType) return undefined;
        const cat = CATEGORY_BY_KEY[category];
        const sub = cat.subTabs.find((s) => s.key === itemType);
        return sub?.apiParam ?? itemType;
    }, [category, itemType]);

    const itemsQuery = useItems(
        useMemo(
            () => ({ category, itemType: resolvedItemType, profileId }),
            [category, resolvedItemType, profileId]
        )
    );
    const itemPages = useMemo(() => {
        const items = itemsQuery.data ?? [];
        const pages: ApiItem[][] = [];
        for (let i = 0; i < items.length; i += 6) {
            pages.push(items.slice(i, i + 6));
        }
        return pages;
    }, [itemsQuery.data]);

    const equippedItemIdSet = useMemo(
        () => new Set(equippedItems.map((equipped) => equipped.item.id)),
        [equippedItems]
    );

    const onSlideSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedSlide(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSlideSelect);
        onSlideSelect();
        return () => {
            emblaApi.off('select', onSlideSelect);
        };
    }, [emblaApi, onSlideSelect]);

    useEffect(() => {
        if (!itemPages.length) {
            setSelectedSlide(0);
            return;
        }

        const safeIndex = Math.min(selectedSlide, itemPages.length - 1);
        setSelectedSlide(safeIndex);

        if (emblaApi) {
            emblaApi.reInit();
            emblaApi.scrollTo(safeIndex, true);
        }
    }, [emblaApi, itemPages.length, selectedSlide]);

    const handleCategory = (c: ApiCategory) => {
        setCategory(c);
        const subTabs = CATEGORY_BY_KEY[c].subTabs;
        setItemType(subTabs.length > 0 ? subTabs[0].key : null);
    };

    const handleViewRareItems = () => {
        handleCategory('fashion_set' as ApiCategory);
        setShowPointsModal(false);
    };

    const isOwned = (item: ApiItem) => item.isUnlocked;
    const isEquipped = (item: ApiItem) => equippedItemIdSet.has(item.id);

    const getApiErrorDetails = (error: unknown): string | undefined => {
        if (!(error instanceof ApiError)) return undefined;
        if (!error.error || typeof error.error !== 'object') return undefined;
        if (!('details' in error.error)) return undefined;
        return typeof error.error.details === 'string'
            ? error.error.details
            : undefined;
    };

    const handleEquipToggle = async (item: ApiItem) => {
        if (isActionPending) return;
        const slot = getSlotFromItem(item);
        try {
            if (isEquipped(item)) {
                await unequipMutation.mutateAsync({ itemType: slot });
                showNotification({
                    title: `Đã bỏ trang bị ${item.itemName}`,
                    variant: 'success',
                });
                return;
            }

            await equipMutation.mutateAsync({ itemId: item.id });
            showNotification({
                title: `Đã trang bị ${item.itemName}`,
                variant: 'success',
            });
        } catch (error) {
            showNotification({
                title: 'Không thể cập nhật trang bị',
                description: error instanceof Error ? error.message : undefined,
                variant: 'error',
            });
        }
    };

    const handleItemClick = (item: ApiItem) => {
        if (isActionPending) return;
        if (isOwned(item)) return void handleEquipToggle(item);
        setBuyTarget(item);
    };

    const handleConfirmBuy = async () => {
        if (!buyTarget || isActionPending) return;
        try {
            await purchaseMutation.mutateAsync({
                itemId: buyTarget.id,
                quantity: 1,
            });
            setBuyTarget(null);
            setSuccessItem(buyTarget);
        } catch (error) {
            showNotification({
                title:
                    error instanceof ApiError &&
                    getApiErrorDetails(error)?.includes(
                        'insufficient reward points'
                    )
                        ? 'Không đủ sao để mua item này'
                        : 'Không thể mua item',
                description:
                    getApiErrorDetails(error) ??
                    (error instanceof Error ? error.message : undefined),
                variant: 'error',
            });
        }
    };

    return (
        <div className="w-full max-w-[720px] mx-auto px-4 py-4 mb-25">
            <div className="flex flex-col">
                <PointBadge points={points} onClick={() => setShowPointsModal(true)} />
                {/* Stage with overlay point badge */}
                <div className="mb-4">
                    <CharacterStage
                        equippedItems={equippedItems}
                        gender={profile.gender}
                    />
                </div>

                {/* Category + sub tabs + items */}
                <div className="flex flex-col gap-3">
                    <CategoryTabs value={category} onChange={handleCategory} />

                    <div className="rounded-lg bg-tichtich-primary-300 p-4">
                        <SubCategoryTabs
                            category={category}
                            value={itemType}
                            onChange={(s) => setItemType(s ?? null)}
                        />

                        {(itemsQuery.isLoading || equippedQuery.isLoading) && (
                            <ItemGridSkeleton />
                        )}

                        {(itemsQuery.isError || equippedQuery.isError) && (
                            <div className="flex flex-col items-center gap-3 py-10 text-center">
                                <p className="text-sm text-destructive">
                                    {itemsQuery.error?.message ??
                                        equippedQuery.error?.message ??
                                        'Không tải được dữ liệu nhân vật'}
                                </p>
                                <Button
                                    onClick={() => {
                                        void itemsQuery.refetch();
                                        void equippedQuery.refetch();
                                        void rewardPointsQuery.refetch();
                                    }}
                                >
                                    Thử lại
                                </Button>
                            </div>
                        )}

                        {itemsQuery.data && (
                            <>
                                {itemsQuery.data.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        Chưa có item nào.
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            ref={emblaRef}
                                            className="mt-4 overflow-hidden"
                                        >
                                            <div className="flex cursor-grab select-none active:cursor-grabbing">
                                                {itemPages.map(
                                                    (page, pageIndex) => (
                                                        <div
                                                            key={`page-${pageIndex}`}
                                                            className="min-w-0 flex-[0_0_100%]"
                                                        >
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {page.map(
                                                                    (item) => (
                                                                        <ItemCard
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            item={
                                                                                item
                                                                            }
                                                                            owned={isOwned(
                                                                                item
                                                                            )}
                                                                            equipped={isEquipped(
                                                                                item
                                                                            )}
                                                                            affordable={
                                                                                points >=
                                                                                item.pricePoints
                                                                            }
                                                                            disabled={
                                                                                isActionPending
                                                                            }
                                                                            onClick={() =>
                                                                                handleItemClick(
                                                                                    item
                                                                                )
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {itemPages.length > 1 && (
                                            <div className="mt-3 flex items-center justify-center gap-1.5">
                                                {itemPages.map((_, index) => (
                                                    <span
                                                        key={`dot-${index}`}
                                                        aria-hidden
                                                        className={cn(
                                                            'h-2 rounded-full transition-all duration-200',
                                                            index ===
                                                                selectedSlide
                                                                ? 'w-5 bg-tichtich-primary-200'
                                                                : 'w-2 bg-tichtich-primary-100'
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <BuyModal
                item={buyTarget}
                points={points}
                open={buyTarget !== null}
                onOpenChange={(open) => !open && setBuyTarget(null)}
                onConfirm={() => void handleConfirmBuy()}
                isSubmitting={purchaseMutation.isPending}
            />
            <PurchaseSuccessModal
                item={successItem}
                open={successItem !== null}
                onClose={() => setSuccessItem(null)}
            />
            <PointsInfoModal
                points={points}
                kidName={profile.fullName}
                open={showPointsModal}
                onClose={() => setShowPointsModal(false)}
                onViewRareItems={handleViewRareItems}
            />
        </div>
    );
}
