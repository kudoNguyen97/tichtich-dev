import type { Notification } from '@/features/notifications/types/notification.type';
import { formatRelativeDay } from '@/helpers/journey/activityLogDisplay';
import { cn } from '@/utils/cn';
import bellIcon from '@/assets/icons/bell.svg';
import missionIcon from '@/assets/icons/mission-none-bg.svg';

const MISSION_TYPES = new Set([
    'mission_created',
    'mission_started',
    'mission_completed',
    'mission_deleted',
]);

function getNotificationIcon(notification: Notification): string {
    return MISSION_TYPES.has(notification.dataJson.type)
        ? missionIcon
        : bellIcon;
}

export interface NotificationCardProps {
    notification: Notification;
    className?: string;
}

export function NotificationCard({
    notification,
    className,
}: NotificationCardProps) {
    const iconSrc = getNotificationIcon(notification);
    const relativeDay = formatRelativeDay(notification.createdAt);

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-lg bg-tichtich-primary-300 p-3 cursor-pointer',
                'hover:bg-tichtich-primary-300/80',
                className
            )}
        >
            <div className="flex p-2 border border-tichtich-primary-200 bg-white shrink-0 items-center justify-center rounded-xl">
                <img
                    src={iconSrc}
                    alt=""
                    className="h-full w-full object-contain"
                />
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-1">
                <p className="text-sm font-bold text-tichtich-black leading-snug">
                    {notification.title}
                </p>
                {notification.body ? (
                    <p className="text-xs text-neutral-600 leading-relaxed">
                        {notification.body}
                    </p>
                ) : null}
                <p className="text-xs text-neutral-500">{relativeDay}</p>
            </div>
        </div>
    );
}
