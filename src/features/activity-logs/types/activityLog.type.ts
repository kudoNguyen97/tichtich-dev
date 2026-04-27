/** Backend may add new values; keep as string until a stable contract exists. */
export type ActivityType = string;

export type WalletDistributionType =
    | 'charity'
    | 'education'
    | 'saving'
    | 'spending';

export interface WalletDistributionEntry {
    walletType?: WalletDistributionType;
    wallet_type?: WalletDistributionType;
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
    amount?: number;
    metadata?: {
        wallet_distributions?: WalletDistributionEntry[];
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
