import type { ActivityLog } from '@/features/activity-logs/types/activityLog.type';
import { JourneyActivityCard } from '@/components/children/journey/JourneyActivityCard';
import { cn } from '@/utils/cn';

export interface TodayJourneySectionProps {
    items: ActivityLog[];
    isLoading?: boolean;
    className?: string;
}

export function TodayJourneySection({
    items,
    isLoading = false,
    className,
}: TodayJourneySectionProps) {
    return (
        <section className={cn('mt-8', className)}>
            <h2 className="text-lg font-bold text-tichtich-black mb-3">
                Hành trình hôm nay
            </h2>

            {isLoading ? (
                <div className="space-y-3">
                    <div className="h-16 rounded-2xl bg-black/10 animate-pulse" />
                    <div className="h-16 rounded-2xl bg-black/10 animate-pulse" />
                </div>
            ) : items.length === 0 ? (
                <p className="text-sm text-neutral-600">
                    Chưa có hoạt động hôm nay
                </p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {items.map((activity) => (
                        <li key={activity.id}>
                            <JourneyActivityCard activity={activity} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
