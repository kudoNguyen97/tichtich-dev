export type WalletType = 'charity' | 'education' | 'saving' | 'spending';

export interface Wallet {
    id: string;
    walletType: WalletType;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface WalletUpdateItem {
    walletId: string;
    amount: number;
}

export interface BatchDepositPayload {
    walletUpdates: WalletUpdateItem[];
    type: 'deposit';
    title: string;
    description: string;
}

export interface BatchWithdrawPayload {
    walletUpdates: WalletUpdateItem[];
    type: 'withdraw';
    title: string;
    description: string;
}

export type WalletTransactionType =
    | BatchDepositPayload['type']
    | BatchWithdrawPayload['type'];

export interface WalletTransaction {
    id: string;
    walletId: string;
    profileId: string;
    amount: number;
    balanceBeforeAction: number;
    type: WalletTransactionType;
    title: string;
    description: string;
    createdAt: string;
}

export interface WalletTransactionsDateRange {
    fromDate: string;
    toDate: string;
}

export interface WalletTransactionsListData {
    transactions: WalletTransaction[];
    profileId: string;
    dateRange: WalletTransactionsDateRange;
    total: number;
}

export type WalletTransactionsExtraParams = Record<
    string,
    string | number | boolean
>;

export interface WalletTransactionsListParams {
    profileId: string;
    fromDate?: string;
    toDate?: string;
    extraParams?: WalletTransactionsExtraParams;
}

export type WalletTransactionsListFilters = Omit<
    WalletTransactionsListParams,
    'profileId'
>;
