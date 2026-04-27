import type { EquippedItemRecord } from '@/features/items/hooks/useItems';
import {
    getItemImageSrc,
    getSlotFromItem,
} from '@/constants/children/character/itemVisuals';
import type { EquipSlot } from '@/features/items/types/item.type';

interface CharacterStageProps {
    equippedItems: EquippedItemRecord[];
    gender: 'male' | 'female';
}

// Layer order (low → high): shoes → bottoms → tops → necklace → eyewear → bracelet → hat
const SLOT_Z_INDEX: Record<Exclude<EquipSlot, 'fashion_set'>, number> = {
    shoes: 1,
    bottoms: 2,
    tops: 3,
    necklace: 4,
    eyewear: 5,
    bracelet: 6,
    hat: 7,
};
const FASHION_SET_Z = 8;

// Percentage-based bounding boxes for cropped item assets
const SLOT_CLASSNAME: Record<Exclude<EquipSlot, 'fashion_set'>, string> = {
    hat: '-translate-x-1/2',
    eyewear: '-translate-x-1/2',
    necklace: '-translate-x-1/2',
    tops: '-translate-x-1/2',
    bottoms: '-translate-x-1/2',
    shoes: '-translate-x-1/2',
    bracelet: '-translate-x-1/2',
};

export function CharacterStage({ equippedItems }: CharacterStageProps) {
    const equippedBySlot = equippedItems.reduce(
        (acc, equipped) => {
            const slot = getSlotFromItem(equipped.item);
            acc[slot] = equipped;
            return acc;
        },
        {} as Partial<Record<EquipSlot, EquippedItemRecord>>
    );

    const tops = equippedBySlot.tops?.item;
    const bottoms = equippedBySlot.bottoms?.item;
    const shoes = equippedBySlot.shoes?.item;
    const hat = equippedBySlot.hat?.item;
    const eyewear = equippedBySlot.eyewear?.item;
    const necklace = equippedBySlot.necklace?.item;
    const bracelet = equippedBySlot.bracelet?.item;
    const fashionSet = equippedBySlot.fashion_set?.item;

    const hatImage = hat ? getItemImageSrc(hat.slug) : null;
    const eyewearImage = eyewear ? getItemImageSrc(eyewear.slug) : null;
    const necklaceImage = necklace ? getItemImageSrc(necklace.slug) : null;
    const shoesImage = shoes ? getItemImageSrc(shoes.slug) : null;
    const braceletImage = bracelet ? getItemImageSrc(bracelet.slug) : null;
    const topsImage = tops ? getItemImageSrc(tops.slug) : null;
    const bottomsImage = bottoms ? getItemImageSrc(bottoms.slug) : null;
    // const bottomsImage = '/icons/items/clothings/trousers/flared-pink.svg';
    const fashionSetImage = fashionSet
        ? getItemImageSrc(fashionSet.slug)
        : null;
    // const fashionSetImage = '/icons/items/fashion-set/uncle-cuoi.svg';
    const hasFashionSet = Boolean(fashionSetImage);

    const renderSingleSlot = (
        src: string | null,
        slot: Exclude<EquipSlot, 'fashion_set'>
    ) => {
        if (!src) return null;
        return (
            <img
                src={src}
                alt=""
                className={`absolute left-1/2 top-0 h-full -translate-x-1/2 ${SLOT_CLASSNAME[slot]}`}
                style={{ zIndex: SLOT_Z_INDEX[slot] }}
            />
        );
    };

    return (
        <div className="flex justify-center items-center mt-20">
            <div className="w-85 relative">
                <img
                    src="/images/home-kid/land-fly.png"
                    alt=""
                    className="w-full"
                />
                <div className="absolute w-full h-full left-1/2 top-10 -translate-x-1/2 -translate-y-1/2">
                    {/* Pig base — lowest layer */}
                    <img
                        src="/icons/items/pig-equip.svg"
                        alt="Heo đất"
                        className="h-full w-full"
                        style={{ zIndex: 0 }}
                    />
                    {hasFashionSet ? (
                        <img
                            src={fashionSetImage ?? undefined}
                            alt=""
                            className="absolute w-full h-full top-0 left-0 bottom-0 right-0  object-contain"
                            style={{ zIndex: FASHION_SET_Z }}
                        />
                    ) : (
                        <>
                            {renderSingleSlot(shoesImage, 'shoes')}
                            {renderSingleSlot(bottomsImage, 'bottoms')}
                            {renderSingleSlot(topsImage, 'tops')}
                            {renderSingleSlot(necklaceImage, 'necklace')}
                            {renderSingleSlot(eyewearImage, 'eyewear')}
                            {renderSingleSlot(braceletImage, 'bracelet')}
                            {renderSingleSlot(hatImage, 'hat')}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
