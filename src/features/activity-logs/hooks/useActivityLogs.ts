import { useQuery } from '@tanstack/react-query';
import { activityLogKeys } from '@/features/activity-logs/api/activityLog.keys';
import { activityLogService } from '@/features/activity-logs/api/activityLog.service';
import type { ActivityLogsListFilters } from '@/features/activity-logs/types/activityLog.type';

const DEFAULT_RECENT_LIMIT = 100;
const DEFAULT_RECENT_OFFSET = 0;

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
