import { createLazyFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { TodayJourneySection } from '@/components/children/journey/TodayJourneySection';
import { ActivityCalendar } from '@/components/ui/ActivityCalendar';
import { useRecentActivities } from '@/features/activity-logs/hooks/useActivityLogs';
import { filterActivitiesForToday } from '@/helpers/journey/activityLogDisplay';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';

export const Route = createLazyFileRoute('/_app/children/_layout/journey')({
    component: RouteComponent,
});

function RouteComponent() {
    const profile = useSelectedChildProfile();

    const { data: activitiesRes, isLoading } = useRecentActivities({
        profileId: profile?.id ?? '',
    });

    const todayItems = useMemo(
        () => filterActivitiesForToday(activitiesRes?.data ?? []),
        [activitiesRes]
    );

    if (!profile) return null;

    return (
        <div className="w-full max-w-[720px] mx-auto px-4 py-4 pb-20">
            <ActivityCalendar profileId={profile.id} />
            <TodayJourneySection
                items={todayItems}
                isLoading={isLoading}
            />
        </div>
    );
}
