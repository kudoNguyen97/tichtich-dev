import dayjs from 'dayjs';
import type { ActivityLog } from '@/features/activity-logs/types/activityLog.type';

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
    reward: 'Nhận thưởng từ phụ huynh',
    deposit: 'Nhận thêm tiền',
    mission_completed: 'Hoàn thành nhiệm vụ',
};

const DEFAULT_JOURNEY_ICON = '/icons/navbar/adult-award.svg';

const ACTIVITY_TYPE_ICONS: Record<string, string> = {
    reward: DEFAULT_JOURNEY_ICON,
    deposit: '/icons/add-money.svg',
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
