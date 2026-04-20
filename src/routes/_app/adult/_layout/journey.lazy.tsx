import { createLazyFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { KidProfileSummaryCard } from '@/components/adult/journey/KidProfileSummaryCard';
import { JourneyNavCard } from '@/components/adult/journey/JourneyNavCard';
import { ActivityCalendar } from '@/components/ui/ActivityCalendar';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useRewardPoints } from '@/features/reward-points/hooks/useRewardPoints';
// import { useRecentActivities } from '@/features/activity-logs/hooks/useActivityLogs';
// import { TodayJourneySection } from '@/components/children/journey/TodayJourneySection';
// import { filterActivitiesForToday } from '@/helpers/journey/activityLogDisplay';

export const Route = createLazyFileRoute('/_app/adult/_layout/journey')({
    component: RouteComponent,
});

function RouteComponent() {
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const profiles = useAuthStore((s) => s.profiles);

    const kidProfile = useMemo(
        () =>
            profiles.find(
                (p) => p.id === managedKidProfileId && p.profileType === 'kid'
            ) ?? null,
        [profiles, managedKidProfileId]
    );

    const { data: rewardPointsData, isLoading: isRewardLoading } =
        useRewardPoints(managedKidProfileId ?? '');

    // const { data: activitiesRes, isLoading: isActivitiesLoading } =
    //     useRecentActivities({ profileId: managedKidProfileId ?? '' });

    // const todayItems = useMemo(
    //     () => filterActivitiesForToday(activitiesRes?.data ?? []),
    //     [activitiesRes]
    // );

    if (!managedKidProfileId || !kidProfile) return null;

    return (
        <div className="w-full max-w-[720px] mx-auto px-4 pt-4 pb-20 flex flex-col gap-4">
            <KidProfileSummaryCard
                kidProfile={kidProfile}
                totalPoints={rewardPointsData?.totalPoints}
                isLoading={isRewardLoading}
            />
            <JourneyNavCard
                label="Hành trình tiến bộ của con"
                variant="primary"
                onClick={() => {}}
            />
            <JourneyNavCard
                label="Mục tiêu của con"
                variant="secondary"
                onClick={() => {}}
            />
            <ActivityCalendar profileId={managedKidProfileId} />

            <JourneyNavCard
                label="Hoạt động gần đây"
                variant="tertiary"
                onClick={() => {}}
            />
            {/* <TodayJourneySection
                items={todayItems}
                isLoading={isActivitiesLoading}
            /> */}
        </div>
    );
}
