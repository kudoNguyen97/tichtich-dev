import type { WalletTransactionsListFilters } from '@/features/wallets/types/wallet.type';

export const walletKeys = {
    all: ['wallets'] as const,
    lists: () => [...walletKeys.all, 'list'] as const,
    listByProfileId: (profileId: string) =>
        [...walletKeys.lists(), profileId] as const,
    transactions: () => [...walletKeys.all, 'transactions'] as const,
    transactionsList: (
        profileId: string,
        filters: WalletTransactionsListFilters
    ) => [...walletKeys.transactions(), profileId, filters] as const,
};
