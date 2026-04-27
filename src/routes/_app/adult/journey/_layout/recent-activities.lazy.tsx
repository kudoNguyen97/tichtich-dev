import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { ActivityLogCard } from '@/components/adult/journey/ActivityLogCard';
import { useInfiniteRecentActivities } from '@/features/activity-logs/hooks/useActivityLogs';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createLazyFileRoute(
    '/_app/adult/journey/_layout/recent-activities'
)({
    component: RecentActivitiesPage,
});

function SkeletonCard() {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-tichtich-primary-300 p-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-black/10 animate-pulse" />
            <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-4 w-3/4 rounded bg-black/10 animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-black/10 animate-pulse" />
            </div>
        </div>
    );
}

function RecentActivitiesPage() {
    const navigate = useNavigate();
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteRecentActivities({
        profileId: managedKidProfileId ?? '',
        enabled: Boolean(managedKidProfileId),
    });

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const activities = data?.activities ?? [];

    return (
        <>
            <AppBar
                title="Hoạt động gần đây"
                leftAction={
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/adult/journey' })}
                        className="flex items-center justify-center"
                        aria-label="Quay lại"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </button>
                }
                rightAction={null}
            />

            <div className="w-full max-w-[720px] mx-auto px-4 pt-4 pb-6">
                {isLoading ? (
                    <ul className="flex flex-col gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <li key={i}>
                                <SkeletonCard />
                            </li>
                        ))}
                    </ul>
                ) : activities.length === 0 ? (
                    <p className="text-center text-sm text-neutral-500 mt-12">
                        Chưa có hoạt động nào
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {activities.map((activity) => (
                            <li key={activity.id}>
                                <ActivityLogCard activity={activity} />
                            </li>
                        ))}
                    </ul>
                )}

                <div ref={sentinelRef} className="h-4" />

                {isFetchingNextPage && (
                    <ul className="flex flex-col gap-3 mt-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <li key={i}>
                                <SkeletonCard />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
