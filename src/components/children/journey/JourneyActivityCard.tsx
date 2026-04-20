import type { ActivityLog } from '@/features/activity-logs/types/activityLog.type';
import {
    formatActivityTimeToday,
    getActivityDisplayTitle,
    getJourneyActivityIconSrc,
} from '@/helpers/journey/activityLogDisplay';
import { cn } from '@/utils/cn';

export interface JourneyActivityCardProps {
    activity: ActivityLog;
    className?: string;
}

export function JourneyActivityCard({
    activity,
    className,
}: JourneyActivityCardProps) {
    const title = getActivityDisplayTitle(activity);
    const iconSrc = getJourneyActivityIconSrc(activity);
    const timeLabel = formatActivityTimeToday(activity.createdAt);

    return (
        <div
            className={cn(
                'flex items-stretch gap-3 rounded-lg bg-tichtich-primary-300 p-3 border border-tichtich-primary-200',
                className
            )}
        >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tichtich-primary-200">
                <img src={iconSrc} alt="" className="h-8 w-8 object-contain" />
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center gap-0.5">
                <p className="text-base font-bold text-tichtich-black leading-snug">
                    {title}
                </p>
                <p className="text-xs text-neutral-600">{timeLabel}</p>
            </div>
        </div>
    );
}
