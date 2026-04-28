import { useInfiniteQuery } from '@tanstack/react-query';
import { notificationKeys } from '@/features/notifications/api/notification.keys';
import { notificationService } from '@/features/notifications/api/notification.service';

const DEFAULT_PAGE_SIZE = 20;

export interface UseInfiniteNotificationsOptions {
    profileId: string;
    pageSize?: number;
    enabled?: boolean;
}

export function useInfiniteNotifications({
    profileId,
    pageSize = DEFAULT_PAGE_SIZE,
    enabled = true,
}: UseInfiniteNotificationsOptions) {
    const filters = { limit: pageSize };

    return useInfiniteQuery({
        queryKey: [...notificationKeys.list(profileId, filters), 'infinite'],
        queryFn: ({ pageParam }) =>
            notificationService.getNotifications({
                profileId,
                limit: pageSize,
                offset: pageParam,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? (lastPage.nextOffset ?? undefined) : undefined,
        select: (data) => ({
            pages: data.pages,
            pageParams: data.pageParams,
            notifications: data.pages.flatMap((p) => p.data),
        }),
        enabled: Boolean(profileId) && enabled,
    });
}
