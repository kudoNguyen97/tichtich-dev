import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { activityLogKeys } from '@/features/activity-logs/api/activityLog.keys';
import { activityLogService } from '@/features/activity-logs/api/activityLog.service';
import type { ActivityLogsListFilters } from '@/features/activity-logs/types/activityLog.type';

const DEFAULT_RECENT_LIMIT = 100;
const DEFAULT_RECENT_OFFSET = 0;
const DEFAULT_INFINITE_PAGE_SIZE = 20;

export interface UseRecentActivitiesOptions {
    profileId: string;
    limit?: number;
    offset?: number;
    enabled?: boolean;
}

export function useRecentActivities({
    profileId,
    limit,
    offset,
    enabled = true,
}: UseRecentActivitiesOptions) {
    const resolvedFilters: ActivityLogsListFilters = {
        limit: limit ?? DEFAULT_RECENT_LIMIT,
        offset: offset ?? DEFAULT_RECENT_OFFSET,
    };

    return useQuery({
        queryKey: activityLogKeys.recent(profileId, resolvedFilters),
        queryFn: () =>
            activityLogService.getRecentActivities(profileId, resolvedFilters),
        enabled: Boolean(profileId) && enabled,
    });
}

export interface UseInfiniteRecentActivitiesOptions {
    profileId: string;
    pageSize?: number;
    enabled?: boolean;
}

export function useInfiniteRecentActivities({
    profileId,
    pageSize = DEFAULT_INFINITE_PAGE_SIZE,
    enabled = true,
}: UseInfiniteRecentActivitiesOptions) {
    return useInfiniteQuery({
        queryKey: [...activityLogKeys.all, 'infinite', profileId, pageSize],
        queryFn: ({ pageParam }) =>
            activityLogService.getRecentActivities(profileId, {
                limit: pageSize,
                offset: pageParam,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const { offset, limit, total } = lastPage.pagination;
            const nextOffset = offset + limit;
            return nextOffset < total ? nextOffset : undefined;
        },
        select: (data) => ({
            pages: data.pages,
            pageParams: data.pageParams,
            activities: data.pages.flatMap((p) => p.data),
        }),
        enabled: Boolean(profileId) && enabled,
    });
}
