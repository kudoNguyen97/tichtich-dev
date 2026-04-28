import { apiClient } from '@/lib/apiClient';
import type {
    NotificationsListData,
    NotificationsListQueryParams,
} from '@/features/notifications/types/notification.type';

export const notificationService = {
    getNotifications: (params: NotificationsListQueryParams) =>
        apiClient.get<NotificationsListData>('/notifications', { params }),
};
