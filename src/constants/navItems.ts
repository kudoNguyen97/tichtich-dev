export interface NavItem {
    labelKey: string;
    to: string;
    /** Lucide icon (dùng cho parent nav hoặc fallback) */
    icon?: React.ElementType;
    /** Đường dẫn icon SVG trong public (ưu tiên cho child nav — icon có pig motif) */
    iconSrc?: string;
}

// Child profile — icon từ public/icons (kid-home, kid-treasure, ...)
export const CHILD_NAV_ITEMS: NavItem[] = [
    {
        labelKey: 'nav.home',
        to: '/children',
        iconSrc: '/icons/navbar/kid-home.svg',
    },
    {
        labelKey: 'nav.treasury',
        to: '/children/treasury',
        iconSrc: '/icons/navbar/kid-treasure.svg',
    },
    {
        labelKey: 'nav.character',
        to: '/children/character',
        iconSrc: '/icons/navbar/kid-figure.svg',
    },
    {
        labelKey: 'nav.journey',
        to: '/children/journey',
        iconSrc: '/icons/navbar/kid-jouney.svg',
    },
    {
        labelKey: 'nav.settings',
        to: '/children/settings',
        iconSrc: '/icons/navbar/setting.svg',
    },
];

// Adult profile — same structure as children, under /adult
export const ADULT_NAV_ITEMS: NavItem[] = [
    {
        labelKey: 'nav.home',
        to: '/adult',
        iconSrc: '/icons/navbar/kid-home.svg',
    },
    {
        labelKey: 'nav.award',
        to: '/adult/reward',
        iconSrc: '/icons/navbar/adult-award.svg',
    },
    {
        labelKey: 'nav.target',
        to: '/adult/mission',
        iconSrc: '/icons/navbar/adult-target.svg',
    },
    {
        labelKey: 'nav.journey',
        to: '/adult/journey',
        iconSrc: '/icons/navbar/adult-journey.svg',
    },
    {
        labelKey: 'nav.settings',
        to: '/adult/settings',
        iconSrc: '/icons/navbar/setting.svg',
    },
];
