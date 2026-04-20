export interface TransactionIconEntry {
    src: string;
    label: string;
}

const TRANSACTION_ICON_MAP: Record<string, TransactionIconEntry> = {
    deposit: { src: '/icons/add-money.svg', label: 'Nhận thêm tiền' },
    withdraw: { src: '/icons/spend-money.svg', label: 'Chi tiêu' },
    charity: {
        src: '/icons/charity-heart.svg',
        label: 'Chi tiền từ ngăn từ thiện',
    },
    education: {
        src: '/icons/study.svg',
        label: 'Chi tiền từ ngăn học tập',
    },
    savings: {
        src: '/icons/save.svg',
        label: 'Chi tiền từ ngăn tiết kiệm',
    },
    allowance: {
        src: '/icons/candy.svg',
        label: 'Chi tiền từ ngăn tiêu vặt',
    },
    goal: {
        src: '/icons/target-mission/star.svg',
        label: 'Hoàn thành mục tiêu',
    },
    birthday: {
        src: '/icons/target-mission/star.svg',
        label: 'Sinh nhật',
    },
    _default: { src: '/icons/save.svg', label: 'Hoạt động' },
};

export function getTransactionIcon(type: string): TransactionIconEntry {
    return TRANSACTION_ICON_MAP[type] ?? TRANSACTION_ICON_MAP._default;
}

export const LEGEND_ENTRIES: Array<TransactionIconEntry & { type: string }> = [
    { type: 'birthday', ...TRANSACTION_ICON_MAP.birthday },
    { type: 'deposit', ...TRANSACTION_ICON_MAP.deposit },
    { type: 'charity', ...TRANSACTION_ICON_MAP.charity },
    { type: 'education', ...TRANSACTION_ICON_MAP.education },
    { type: 'savings', ...TRANSACTION_ICON_MAP.savings },
    { type: 'allowance', ...TRANSACTION_ICON_MAP.allowance },
    { type: 'goal', ...TRANSACTION_ICON_MAP.goal },
];
