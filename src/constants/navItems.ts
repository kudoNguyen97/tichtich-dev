import { LayoutDashboard, Users, BarChart2, Settings } from 'lucide-react';

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
        to: '/adult/target',
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

// Parent profile — URL: /parent/  /parent/manage  /parent/reports  /parent/settings
export const PARENT_NAV_ITEMS: NavItem[] = [
    { labelKey: 'nav.overview', to: '/parent', icon: LayoutDashboard },
    { labelKey: 'nav.manage', to: '/parent/manage', icon: Users },
    { labelKey: 'nav.reports', to: '/parent/reports', icon: BarChart2 },
    { labelKey: 'nav.settings', to: '/parent/settings', icon: Settings },
];
