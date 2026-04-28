import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { useInfiniteNotifications } from '@/features/notifications/hooks/useNotifications';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createLazyFileRoute('/_app/children/notifications/')({
    component: ChildrenNotificationsPage,
});

function SkeletonCard() {
    return (
        <div className="flex items-start gap-3 rounded-lg bg-tichtich-primary-300 p-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-black/10 animate-pulse" />
            <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-4 w-3/4 rounded bg-black/10 animate-pulse" />
                <div className="h-3 w-full rounded bg-black/10 animate-pulse" />
                <div className="h-3 w-1/4 rounded bg-black/10 animate-pulse" />
            </div>
        </div>
    );
}

function ChildrenNotificationsPage() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const profileId = selectedProfile?.id ?? '';

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteNotifications({
        profileId,
        enabled: Boolean(profileId),
    });

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    void fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const notifications = data?.notifications ?? [];

    return (
        <>
            <AppBar
                title="Thông báo"
                leftAction={
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/children' })}
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
                ) : notifications.length === 0 ? (
                    <p className="text-center text-sm text-neutral-500 mt-12">
                        Chưa có thông báo nào
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {notifications.map((notification) => (
                            <li key={notification.id}>
                                <NotificationCard notification={notification} />
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
