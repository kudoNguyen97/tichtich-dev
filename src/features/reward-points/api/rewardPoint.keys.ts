export const rewardPointKeys = {
    all: ['reward-points'] as const,
    byProfileId: (profileId: string) =>
        [...rewardPointKeys.all, profileId] as const,
};
