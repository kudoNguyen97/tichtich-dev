export const profileTransactionKeys = {
    all: ['profile-transactions'] as const,
    lists: () => [...profileTransactionKeys.all, 'list'] as const,
    received: (profileId: string) =>
        [...profileTransactionKeys.all, 'received', profileId] as const,
    sent: () => [...profileTransactionKeys.all, 'sent'] as const,
};
