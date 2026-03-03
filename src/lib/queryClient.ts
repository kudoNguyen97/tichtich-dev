import { MutationCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api.type';
import { showError } from './toast';

export const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: (error) => showError(error),
    }),
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: (failureCount, error) => {
                if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
                    return false;
                }
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});
