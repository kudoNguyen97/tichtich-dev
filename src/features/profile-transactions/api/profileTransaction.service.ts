import type {
    CreateProfileTransactionPayload,
    ProcessProfileTransactionPayload,
    ProfileTransaction,
    ProfileTransactionStatus,
} from '@/features/profile-transactions/types/profileTransaction.type';
import { apiClient } from '@/lib/apiClient';

export const profileTransactionService = {
    create: (payload: CreateProfileTransactionPayload) =>
        apiClient.post<ProfileTransaction>('/profile-transactions', payload),
    getReceivedTransactions: (
        profileId: string,
        params: { status: ProfileTransactionStatus }
    ) =>
        apiClient.get<ProfileTransaction[]>('/profile-transactions/received', {
            headers: { 'x-profile-id': profileId },
            params,
        }),
    process: (profileId: string, payload: ProcessProfileTransactionPayload) =>
        apiClient.post<ProfileTransaction>(
            '/profile-transactions/process',
            payload,
            {
                headers: { 'x-profile-id': profileId },
            }
        ),
};
