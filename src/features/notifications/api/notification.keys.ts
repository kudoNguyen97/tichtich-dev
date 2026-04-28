import type { NotificationsListFilters } from '@/features/notifications/types/notification.type';

export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => [...notificationKeys.all, 'list'] as const,
    list: (profileId: string, filters: NotificationsListFilters) =>
        [...notificationKeys.lists(), profileId, filters] as const,
};
