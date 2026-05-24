import dayjs from 'dayjs';
import type {
    ActivityLog,
    WalletDistributionEntry,
    WalletDistributionType,
} from '@/features/activity-logs/types/activityLog.type';
import { WALLET_TYPE } from '@/features/wallets/constants/walletType';
import defaultJourneyIcon from '@/assets/icons/mission.svg';
import addMoneyIcon from '@/assets/icons/add-money.svg';
import spendMoneyIcon from '@/assets/icons/spend-money.svg';
import charityIcon from '@/assets/icons/charity-heart.svg';
import educationIcon from '@/assets/icons/study.svg';
import savingsIcon from '@/assets/icons/save.svg';
import allowanceIcon from '@/assets/icons/candy.svg';
import unlockItemIcon from '@/assets/icons/unlock-item.svg';
import { formatCurrency } from '@/utils/format';

const ACTIVITY_TYPE = {
    REWARD: 'reward',
    DEPOSIT: 'deposit',
    SPENDING: 'spending',
    PROFILE_TRANSACTION_RECEIVED: 'profile_transaction_received',
    REWARD_RECEIVED: 'reward_received',
    WALLET_DISTRIBUTION: 'wallet_distribution',
    MISSION_STARTED: 'mission_started',
    MISSION_COMPLETED: 'mission_completed',
    ITEM_UNLOCKED: 'item_unlocked',
} as const;

type ActivityTypeValue = (typeof ACTIVITY_TYPE)[keyof typeof ACTIVITY_TYPE];

const ACTIVITY_TYPE_LABELS: Record<ActivityTypeValue, string> = {
    [ACTIVITY_TYPE.REWARD]: 'Nhận thưởng từ phụ huynh',
    [ACTIVITY_TYPE.DEPOSIT]: 'Nhận thêm tiền',
    [ACTIVITY_TYPE.SPENDING]: 'Tiêu từ ví',
    [ACTIVITY_TYPE.PROFILE_TRANSACTION_RECEIVED]: 'Nhận tiền',
    [ACTIVITY_TYPE.REWARD_RECEIVED]: 'Nhận thưởng từ phụ huynh',
    [ACTIVITY_TYPE.WALLET_DISTRIBUTION]: 'Chia tiền vào các túi',
    [ACTIVITY_TYPE.MISSION_STARTED]: 'Bắt đầu nhiệm vụ',
    [ACTIVITY_TYPE.MISSION_COMPLETED]: 'Hoàn thành nhiệm vụ',
    [ACTIVITY_TYPE.ITEM_UNLOCKED]: 'Mở khóa trang phục mới',
};

const WALLET_DISTRIBUTION_ORDER: WalletDistributionType[] = [
    WALLET_TYPE.CHARITY,
    WALLET_TYPE.EDUCATION,
    WALLET_TYPE.SAVING,
    WALLET_TYPE.SPENDING,
];

export function normalizeWalletDistributions(
    entries?: WalletDistributionEntry[]
): WalletDistributionEntry[] {
    const amountMap = new Map<WalletDistributionType, number>();

    if (Array.isArray(entries)) {
        for (const entry of entries) {
            const walletType = entry.walletType ?? entry.wallet_type;
            if (!walletType) continue;
            amountMap.set(walletType, entry.amount);
        }
    }

    return WALLET_DISTRIBUTION_ORDER.map((walletType) => ({
        wallet_type: walletType,
        amount: amountMap.get(walletType) ?? 0,
    }));
}

export function getActivityDisplayTitle(activity: ActivityLog): string {
    switch (activity.activityType) {
        case ACTIVITY_TYPE.ITEM_UNLOCKED:
            return ACTIVITY_TYPE_LABELS[activity.activityType];
        case ACTIVITY_TYPE.SPENDING:
            return `${activity.title} ${formatCurrency(activity.amount ?? 0)}`;
        default:
            return activity.title ?? activity.description ?? 'Hoạt động';
    }
}

const ACTIVITY_TYPE_ICONS: Record<string, string> = {
    [ACTIVITY_TYPE.REWARD]: defaultJourneyIcon,
    [ACTIVITY_TYPE.DEPOSIT]: addMoneyIcon,
    [ACTIVITY_TYPE.SPENDING]: spendMoneyIcon,
    [ACTIVITY_TYPE.PROFILE_TRANSACTION_RECEIVED]: defaultJourneyIcon,
    [ACTIVITY_TYPE.REWARD_RECEIVED]: defaultJourneyIcon,
    [ACTIVITY_TYPE.WALLET_DISTRIBUTION]: addMoneyIcon,
    [ACTIVITY_TYPE.MISSION_STARTED]: defaultJourneyIcon,
    [ACTIVITY_TYPE.MISSION_COMPLETED]: defaultJourneyIcon,
    [ACTIVITY_TYPE.ITEM_UNLOCKED]: unlockItemIcon,
};

export function getJourneyActivityIconSrc(activity: ActivityLog): string {
    if (activity.activityType === ACTIVITY_TYPE.SPENDING) {
        switch (activity.metadata?.wallet_type) {
            case WALLET_TYPE.CHARITY:
                return charityIcon;
            case WALLET_TYPE.EDUCATION:
                return educationIcon;
            case WALLET_TYPE.SAVING:
                return savingsIcon;
            case WALLET_TYPE.SPENDING:
                return allowanceIcon;
        }
    }
    return ACTIVITY_TYPE_ICONS[activity.activityType];
}

/** "Hôm nay, HH:mm" for same calendar day; otherwise short date + time */
export function formatActivityTimeToday(iso: string): string {
    const d = dayjs(iso);
    if (d.isSame(dayjs(), 'day')) {
        return `Hôm nay, ${d.format('HH:mm')}`;
    }
    return `${d.format('DD/MM/YYYY')}, ${d.format('HH:mm')}`;
}

/**
 * Relative day label relative to today:
 * - Same day → "Hôm nay"
 * - 1 day ago → "Hôm qua"
 * - 2–8 days ago → "N ngày trước, HH:mm"
 * - Older → "DD/MM/YYYY, HH:mm"
 */
export function formatRelativeDay(iso: string): string {
    const d = dayjs(iso);
    const today = dayjs();
    if (d.isSame(today, 'day')) return `Hôm nay, ${d.format('HH:mm')}`;
    const diffDays = today.startOf('day').diff(d.startOf('day'), 'day');
    if (diffDays === 1) return `Hôm qua, ${d.format('HH:mm')}`;
    if (diffDays <= 8) return `${diffDays} ngày trước, ${d.format('HH:mm')}`;
    return `${d.format('DD/MM/YYYY')}, ${d.format('HH:mm')}`;
}

export function filterActivitiesForToday(
    activities: ActivityLog[]
): ActivityLog[] {
    return activities.filter((activity) => {
        const d = dayjs(activity.createdAt);
        return d.isSame(dayjs(), 'day');
    });
}
