export type NotificationType =
    | 'mission_started'
    | 'mission_completed'
    | 'profile_transaction_processed'
    | 'inactive_profile'
    | string;

export interface NotificationDataJson {
    type: NotificationType;
    [key: string]: unknown;
}

export interface Notification {
    id: string;
    title: string;
    body: string;
    dataJson: NotificationDataJson;
    category: string;
    createdAt: string;
    status: string;
    isRead: boolean;
    isDismissed: boolean;
}

export interface NotificationsListData {
    data: Notification[];
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
    nextOffset: number | null;
}

export interface NotificationsListQueryParams {
    profileId: string;
    limit?: number;
    offset?: number;
}

export type NotificationsListFilters = Omit<
    NotificationsListQueryParams,
    'profileId'
>;
