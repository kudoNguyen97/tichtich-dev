import type {
    CreateProfileTransactionPayload,
    ProfileTransaction,
} from '@/features/profile-transactions/types/profileTransaction.type';
import { apiClient } from '@/lib/apiClient';

export const profileTransactionService = {
    create: (payload: CreateProfileTransactionPayload) =>
        apiClient.post<ProfileTransaction>('/profile-transactions', payload),
    getReceivedTransactions: (profileId: string) =>
        apiClient.get<ProfileTransaction[]>('/profile-transactions/received', {
            headers: { 'x-profile-id': profileId },
        }),
};
