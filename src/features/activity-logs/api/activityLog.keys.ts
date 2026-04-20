import type { ActivityLogsListFilters } from '@/features/activity-logs/types/activityLog.type';

export const activityLogKeys = {
    all: ['activity-logs'] as const,
    details: () => [...activityLogKeys.all, 'detail'] as const,
    detail: (activityId: string) =>
        [...activityLogKeys.details(), activityId] as const,
    recent: (profileId: string, filters: ActivityLogsListFilters) =>
        [...activityLogKeys.all, 'recent', profileId, filters] as const,
    byType: (
        profileId: string,
        activityType: string,
        filters: ActivityLogsListFilters
    ) =>
        [
            ...activityLogKeys.all,
            'byType',
            profileId,
            activityType,
            filters,
        ] as const,
};
