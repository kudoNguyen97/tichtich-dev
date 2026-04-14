export const walletKeys = {
    all: ['wallets'] as const,
    lists: () => [...walletKeys.all, 'list'] as const,
    listByProfileId: (profileId: string) =>
        [...walletKeys.lists(), profileId] as const,
};
