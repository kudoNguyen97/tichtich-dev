import dayjs from 'dayjs';
import type { ActivityLog } from '@/features/activity-logs/types/activityLog.type';

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
    reward: 'Nhận thưởng từ phụ huynh',
    deposit: 'Nhận thêm tiền',
    spending: 'Tiêu từ ví',
    profile_transaction_received: 'Nhận tiền',
    reward_received: 'Nhận thưởng từ phụ huynh',
    wallet_distribution: 'Chia tiền vào các túi',
    mission_started: 'Bắt đầu nhiệm vụ',
    mission_completed: 'Hoàn thành nhiệm vụ',
    item_unlocked: 'Mở khóa vật phẩm',
};

const DEFAULT_JOURNEY_ICON = '/icons/navbar/adult-award.svg';

const ACTIVITY_TYPE_ICONS: Record<string, string> = {
    reward: DEFAULT_JOURNEY_ICON,
    deposit: '/icons/add-money.svg',
    spending: '/icons/spend-money.svg',
    profile_transaction_received: '/icons/add-money.svg',
    reward_received: DEFAULT_JOURNEY_ICON,
    wallet_distribution: '/icons/save.svg',
    mission_started: '/icons/navbar/adult-target.svg',
    mission_completed: DEFAULT_JOURNEY_ICON,
    item_unlocked: '/icons/candy.svg',
};

export function getActivityDisplayTitle(activity: ActivityLog): string {
    const t = activity.title?.trim();
    if (t) return t;
    const d = activity.description?.trim();
    if (d) return d;
    const mapped = ACTIVITY_TYPE_LABELS[activity.activityType];
    if (mapped) return mapped;
    const raw = activity.activityType.trim();
    if (raw) return raw;
    return 'Hoạt động';
}

export function getJourneyActivityIconSrc(activity: ActivityLog): string {
    return ACTIVITY_TYPE_ICONS[activity.activityType] ?? DEFAULT_JOURNEY_ICON;
}

export function filterActivitiesForToday(
    activities: ActivityLog[]
): ActivityLog[] {
    const today = dayjs();
    return activities
        .filter((a) => dayjs(a.createdAt).isSame(today, 'day'))
        .sort(
            (a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        );
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
 * - 2–30 days ago → "N ngày trước"
 * - Older → "DD/MM/YYYY"
 */
export function formatRelativeDay(iso: string): string {
    const d = dayjs(iso);
    const today = dayjs();
    if (d.isSame(today, 'day')) return 'Hôm nay';
    const diffDays = today.startOf('day').diff(d.startOf('day'), 'day');
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays <= 30) return `${diffDays} ngày trước`;
    return d.format('DD/MM/YYYY');
}
