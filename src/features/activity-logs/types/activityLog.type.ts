/** Backend may add new values; keep as string until a stable contract exists. */
export type ActivityType = string;

export interface WalletDistributionEntry {
    walletType: string;
    iconSrc: string;
    amount: number;
}

export interface ActivityLog {
    id: string;
    profileId: string;
    activityType: ActivityType;
    createdAt: string;
    /** Optional when API returns a human-readable headline */
    title?: string;
    description?: string;
    metadata?: {
        walletDistributions?: WalletDistributionEntry[];
        [key: string]: unknown;
    };
}

/** Pagination block returned with list endpoints. */
export interface ActivityLogsPagination {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
}

/** Query params for recent / by-type list endpoints (optional; defaults applied in hook for recent). */
export interface ActivityLogsListQueryParams {
    limit?: number;
    offset?: number;
}

/**
 * List payload inside API envelope `data` for recent and by-type routes.
 * Matches `{ data: { data: [...], pagination: {...} } }` unwrapped to inner object.
 */
export interface ActivityLogsListData {
    data: ActivityLog[];
    pagination: ActivityLogsPagination;
}

/** Used in React Query keys for list variants (same shape as query params). */
export type ActivityLogsListFilters = ActivityLogsListQueryParams;
