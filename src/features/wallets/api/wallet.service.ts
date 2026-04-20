import dayjs from 'dayjs';
import { apiClient } from '@/lib/apiClient';
import type {
    BatchDepositPayload,
    BatchWithdrawPayload,
    Wallet,
    WalletTransactionsListData,
    WalletTransactionsListParams,
} from '@/features/wallets/types/wallet.type';

/** API expects YYYY-MM-DD in local calendar sense, query keys snake_case. */
function toQueryDateString(value: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }
    return dayjs(value).format('YYYY-MM-DD');
}

function compactWalletTransactionParams(
    params: WalletTransactionsListParams
): Record<string, string | number | boolean> {
    const { profileId, fromDate, toDate, extraParams } = params;
    const merged: Record<string, string | number | boolean | undefined> = {
        profile_id: profileId,
        ...(fromDate !== undefined
            ? { from_date: toQueryDateString(fromDate) }
            : {}),
        ...(toDate !== undefined ? { to_date: toQueryDateString(toDate) } : {}),
        ...(extraParams ?? {}),
    };
    return Object.fromEntries(
        Object.entries(merged).filter(
            (entry): entry is [string, string | number | boolean] =>
                entry[1] !== undefined
        )
    );
}

export const walletService = {
    getWallets: (profileId: string) =>
        apiClient.get<Wallet[]>('/wallets', {
            headers: { 'x-profile-id': profileId },
        }),

    getTransactions: (params: WalletTransactionsListParams) =>
        apiClient.get<WalletTransactionsListData>('/wallets/transactions', {
            headers: { 'x-profile-id': params.profileId },
            params: compactWalletTransactionParams(params),
        }),

    batchDeposit: (profileId: string, payload: BatchDepositPayload) =>
        apiClient.post<void>('/wallets/batch-deposit', payload, {
            headers: { 'x-profile-id': profileId },
        }),
    batchWithdraw: (profileId: string, payload: BatchWithdrawPayload) =>
        apiClient.post<void>('/wallets/batch-withdraw', payload, {
            headers: { 'x-profile-id': profileId },
        }),
};
