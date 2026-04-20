import { apiClient } from '@/lib/apiClient';
import type {
    ActivityLog,
    ActivityLogsListData,
    ActivityLogsListQueryParams,
} from '@/features/activity-logs/types/activityLog.type';

function compactListParams(
    params?: ActivityLogsListQueryParams
): Record<string, number> | undefined {
    if (!params) return undefined;
    const merged: Record<string, number | undefined> = {
        ...(params.limit !== undefined ? { limit: params.limit } : {}),
        ...(params.offset !== undefined ? { offset: params.offset } : {}),
    };
    const entries = Object.entries(merged).filter(
        (entry): entry is [string, number] => entry[1] !== undefined
    );
    if (entries.length === 0) return undefined;
    return Object.fromEntries(entries);
}

export const activityLogService = {
    getActivityById: (activityId: string) =>
        apiClient.get<ActivityLog>(`/activity-logs/activity/${activityId}`),

    getRecentActivities: (
        profileId: string,
        params?: ActivityLogsListQueryParams
    ) =>
        apiClient.get<ActivityLogsListData>(
            `/activity-logs/${profileId}/recent`,
            {
                params: compactListParams(params),
            }
        ),

    getActivitiesByType: (
        profileId: string,
        activityType: string,
        params?: ActivityLogsListQueryParams
    ) =>
        apiClient.get<ActivityLogsListData>(
            `/activity-logs/${profileId}/type/${encodeURIComponent(activityType)}`,
            {
                params: compactListParams(params),
            }
        ),
};
