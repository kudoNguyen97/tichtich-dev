import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_app/children/')({
    component: RouteComponent,
});

const CARD_CLASS = 'rounded-2xl bg-children-card p-4 overflow-visible';

// Header + Section 1
const PROFILE_NAME = 'Trần Quốc Bảo';
const PROFILE_TYPE = 'boy' as const;
const STATUS_TAG = 'đã soát code con';
const HEADER_GREETING = 'Chào mẹ của Quốc Bảo';

// Section 2
const BALANCE = 786000;
const BALANCE_LABEL = '(bảy trăm tám mươi sáu nghìn đồng)';
const WEEKLY_CHANGE = '+ 120,000 VND tuần này';

// Section 3
const SPENDING_CATEGORIES = [
    { src: '/icons/study.svg', label: 'Học tập' },
    { src: '/icons/candy.svg', label: 'Ăn vặt' },
    { src: '/icons/save.svg', label: 'Tiết kiệm' },
    { src: '/icons/charity-heart.svg', label: 'Từ thiện' },
] as const;

// Section 4 — sub-cards with darker orange bg, white text
const RECENT_ACTIVITIES = [
    {
        icon: 'save' as const,
        description: 'chia tổng số tiền vào ngăn tiết kiệm',
        value: '606,000₫',
    },
    {
        icon: 'save' as const,
        description: 'đạt số lần chia tiền vào ví tiết kiệm',
        value: '10 lần',
    },
    {
        icon: 'charity' as const,
        description: 'chia tổng số tiền vào ngăn từ thiện',
        value: '229,000₫',
    },
    {
        icon: 'save' as const,
        description: 'đã tiết kiệm và không chỉ trong',
        value: '10 ngày',
    },
];

// Section 5 — sub-cards; progress: star 4 filled, heart 8 filled, coin 1 filled
const SKILLS = [
    {
        image: '/images/home-kid/pig-star.png',
        title: 'Ngôi sao học tập',
        filled: 4,
        type: 'star' as const,
    },
    {
        image: '/images/home-kid/pig-warm.png',
        title: 'Trái tim ấm áp',
        filled: 8,
        type: 'heart' as const,
    },
    {
        image: '/images/home-kid/pig-save.png',
        title: 'Bé chăm tích luỹ',
        filled: 1,
        type: 'coin' as const,
    },
];

function formatBalance(n: number): string {
    return (
        new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n) + ' ₫'
    );
}

function RouteComponent() {
    return (
        <div className="">
            <div className="px-4 pt-8 pb-6">
                <h1 className="text-center text-xl font-bold text-tichtich-black">
                    asdsd
                </h1>
            </div>
        </div>
    );
}
