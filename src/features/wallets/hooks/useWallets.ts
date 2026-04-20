import { useMutation, useQuery } from '@tanstack/react-query';
import { walletKeys } from '@/features/wallets/api/wallet.keys';
import { walletService } from '@/features/wallets/api/wallet.service';
import type {
    BatchDepositPayload,
    BatchWithdrawPayload,
    WalletTransactionsListFilters,
} from '@/features/wallets/types/wallet.type';
import { queryClient } from '@/lib/queryClient';
import { showError } from '@/lib/toast';

const emptyWalletTransactionsFilters: WalletTransactionsListFilters = {};

export function useWalletsByProfileId(profileId: string) {
    return useQuery({
        queryKey: walletKeys.listByProfileId(profileId),
        queryFn: () => walletService.getWallets(profileId),
        enabled: Boolean(profileId),
    });
}

export function useWalletTransactions(
    profileId: string,
    filters?: WalletTransactionsListFilters
) {
    const resolvedFilters = filters ?? emptyWalletTransactionsFilters;
    return useQuery({
        queryKey: walletKeys.transactionsList(profileId, resolvedFilters),
        queryFn: () =>
            walletService.getTransactions({
                profileId,
                ...resolvedFilters,
            }),
        enabled: Boolean(profileId),
    });
}

export function useBatchDeposit() {
    return useMutation<
        void,
        Error,
        { profileId: string; payload: BatchDepositPayload }
    >({
        mutationFn: ({ profileId, payload }) =>
            walletService.batchDeposit(profileId, payload),
        meta: {
            globalLoading: true,
        },
        onSuccess: (_void, { profileId }) => {
            queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: walletKeys.listByProfileId(profileId),
            });
            queryClient.invalidateQueries({
                queryKey: walletKeys.transactions(),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export function useBatchWithdraw() {
    return useMutation<
        void,
        Error,
        { profileId: string; payload: BatchWithdrawPayload }
    >({
        mutationFn: ({ profileId, payload }) =>
            walletService.batchWithdraw(profileId, payload),
        meta: {
            globalLoading: true,
        },
        onSuccess: (_void, { profileId }) => {
            queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: walletKeys.listByProfileId(profileId),
            });
            queryClient.invalidateQueries({
                queryKey: walletKeys.transactions(),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}
