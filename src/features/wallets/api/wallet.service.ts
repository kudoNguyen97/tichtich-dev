import { apiClient } from '@/lib/apiClient';
import type {
    BatchDepositPayload,
    Wallet,
} from '@/features/wallets/types/wallet.type';

export const walletService = {
    getWallets: (profileId: string) =>
        apiClient.get<Wallet[]>('/wallets', {
            headers: { 'x-profile-id': profileId },
        }),

    batchDeposit: (profileId: string, payload: BatchDepositPayload) =>
        apiClient.post<void>('/wallets/batch-deposit', payload, {
            headers: { 'x-profile-id': profileId },
        }),
};
