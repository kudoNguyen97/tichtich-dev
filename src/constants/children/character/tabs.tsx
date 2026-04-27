import type { LucideIcon } from 'lucide-react';

import ClothesHangerIcon from '/public/icons/items/clothes-hanger.svg?react';
import ClothesPantsShortIcon from '/public/icons/items/clothes-pants-short.svg?react';
import ClothesIcon from '/public/icons/items/clothes-fill.svg?react';
import SpikedShoesIcon from '/public/icons/items/spikedshoes.svg?react';
import AccessoryHatIcon from '/public/icons/items/accessory-hat.svg?react';
import GlassesIcon from '/public/icons/items/glasses.svg?react';
import DiamondNecklaceIcon from '/public/icons/items/diamond-necklace.svg?react';
import WatchIcon from '/public/icons/items/watch.svg?react';
import DiamondIcon from '/public/icons/items/diamond.svg?react';

export interface SubTab {
    key: string;
    label: string;
    Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
    apiParam?: string;
}

export interface CategoryTab {
    key: string;
    label: string;
    Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
    subTabs: SubTab[];
}

export const CATEGORY_TABS: CategoryTab[] = [
    {
        key: 'clothing',
        label: 'Trang phục',
        Icon: ClothesHangerIcon,
        subTabs: [
            { key: 'tops', label: 'Áo', Icon: ClothesIcon },
            {
                key: 'bottoms',
                label: 'Quần',
                Icon: ClothesPantsShortIcon,
            },
        ],
    },
    {
        key: 'shoes',
        label: 'Giày',
        Icon: SpikedShoesIcon,
        subTabs: [],
    },
    {
        key: 'accessory',
        label: 'Phụ kiện',
        Icon: AccessoryHatIcon,
        subTabs: [
            {
                key: 'hat',
                label: 'Nón',
                Icon: AccessoryHatIcon,
            },
            {
                key: 'eyewear',
                label: 'Mắt kính',
                Icon: GlassesIcon,
            },
            {
                key: 'necklace',
                label: 'Vòng cổ',
                Icon: DiamondNecklaceIcon,
            },
            {
                key: 'bracelet',
                label: 'Vòng tay',
                Icon: WatchIcon,
            },
        ],
    },
    {
        key: 'fashion_set',
        label: 'Đồ hiếm',
        Icon: DiamondIcon,
        subTabs: [],
    },
];

export const CATEGORY_BY_KEY: Record<string, CategoryTab> = Object.fromEntries(
    CATEGORY_TABS.map((c) => [c.key, c])
) as Record<string, CategoryTab>;
