import { useMutation, useQuery } from '@tanstack/react-query';
import { profileTransactionKeys } from '@/features/profile-transactions/api/profileTransaction.keys';
import { profileTransactionService } from '@/features/profile-transactions/api/profileTransaction.service';
import type {
    CreateProfileTransactionPayload,
    ProfileTransaction,
} from '@/features/profile-transactions/types/profileTransaction.type';
import { queryClient } from '@/lib/queryClient';
import { showError } from '@/lib/toast';

export function useCreateProfileTransaction() {
    return useMutation<
        ProfileTransaction,
        Error,
        CreateProfileTransactionPayload
    >({
        mutationFn: profileTransactionService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: profileTransactionKeys.lists(),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export function useGetReceivedTransactions(profileId: string) {
    return useQuery({
        queryKey: profileTransactionKeys.received(profileId),
        queryFn: () =>
            profileTransactionService.getReceivedTransactions(profileId),
        enabled: !!profileId,
        refetchOnMount: 'always',
    });
}
