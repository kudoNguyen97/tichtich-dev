import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLoadingStore } from '@/stores/useLoadingStore';

export const GlobalLoadingSync = () => {
    const isFetching = useIsFetching({
        predicate: (query) => query.meta?.globalLoading === true,
    });

    const isMutating = useIsMutating({
        predicate: (mutation) => mutation.meta?.globalLoading === true,
    });

    const setGlobalLoading = useLoadingStore((s) => s.setGlobalLoading);

    useEffect(() => {
        const isLoading = isFetching + isMutating > 0;
        setGlobalLoading(isLoading);
    }, [isFetching, isMutating]);

    return null;
};
