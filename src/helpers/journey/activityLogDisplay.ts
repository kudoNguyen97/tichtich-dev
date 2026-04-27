import dayjs from 'dayjs';
import type {
    ActivityLog,
    WalletDistributionEntry,
    WalletDistributionType,
} from '@/features/activity-logs/types/activityLog.type';
import defaultJourneyIcon from '@/assets/icons/navbar/adult-award.svg';
import addMoneyIcon from '@/assets/icons/add-money.svg';
import spendMoneyIcon from '@/assets/icons/spend-money.svg';
import adultTargetIcon from '@/assets/icons/navbar/adult-target.svg';
import charityIcon from '@/assets/icons/charity-heart.svg';
import educationIcon from '@/assets/icons/target-mission/learning.svg';
import savingsIcon from '@/assets/icons/target-mission/saving.svg';
import allowanceIcon from '@/assets/icons/target-mission/candy.svg';
import { formatCurrency } from '@/utils/format';

const enum ActivityType {
    REWARD = 'reward',
    DEPOSIT = 'deposit',
    SPENDING = 'spending',
    PROFILE_TRANSACTION_RECEIVED = 'profile_transaction_received',
    REWARD_RECEIVED = 'reward_received',
    WALLET_DISTRIBUTION = 'wallet_distribution',
    MISSION_STARTED = 'mission_started',
    MISSION_COMPLETED = 'mission_completed',
    ITEM_UNLOCKED = 'item_unlocked',
}

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
    [ActivityType.REWARD]: 'Nhận thưởng từ phụ huynh',
    [ActivityType.DEPOSIT]: 'Nhận thêm tiền',
    [ActivityType.SPENDING]: 'Tiêu từ ví',
    [ActivityType.PROFILE_TRANSACTION_RECEIVED]: 'Nhận tiền',
    [ActivityType.REWARD_RECEIVED]: 'Nhận thưởng từ phụ huynh',
    [ActivityType.WALLET_DISTRIBUTION]: 'Chia tiền vào các túi',
    [ActivityType.MISSION_STARTED]: 'Bắt đầu nhiệm vụ',
    [ActivityType.MISSION_COMPLETED]: 'Hoàn thành nhiệm vụ',
    [ActivityType.ITEM_UNLOCKED]: 'Mở khóa trang phục mới',
};

const WALLET_DISTRIBUTION_ORDER: WalletDistributionType[] = [
    'charity',
    'education',
    'saving',
    'spending',
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
        case ActivityType.ITEM_UNLOCKED:
            return ACTIVITY_TYPE_LABELS[activity.activityType];
        case ActivityType.SPENDING:
            return `${activity.title} ${formatCurrency(activity.amount ?? 0)}`;
        default:
            return activity.title ?? activity.description ?? 'Hoạt động';
    }
}

const DEFAULT_JOURNEY_ICON = defaultJourneyIcon;

const ACTIVITY_TYPE_ICONS: Record<string, string> = {
    [ActivityType.REWARD]: DEFAULT_JOURNEY_ICON,
    [ActivityType.DEPOSIT]: addMoneyIcon,
    [ActivityType.SPENDING]: spendMoneyIcon,
    [ActivityType.PROFILE_TRANSACTION_RECEIVED]: DEFAULT_JOURNEY_ICON,
    [ActivityType.REWARD_RECEIVED]: DEFAULT_JOURNEY_ICON,
    [ActivityType.WALLET_DISTRIBUTION]: addMoneyIcon,
    [ActivityType.MISSION_STARTED]: adultTargetIcon,
    [ActivityType.MISSION_COMPLETED]: DEFAULT_JOURNEY_ICON,
    [ActivityType.ITEM_UNLOCKED]: allowanceIcon,
};

export function getJourneyActivityIconSrc(activity: ActivityLog): string {
    if (activity.activityType === ActivityType.SPENDING) {
        switch (activity.metadata?.wallet_type) {
            case 'charity':
                return charityIcon;
            case 'education':
                return educationIcon;
            case 'saving':
                return savingsIcon;
            case 'spending':
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
