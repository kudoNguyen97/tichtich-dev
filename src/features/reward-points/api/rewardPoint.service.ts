import { apiClient } from '@/lib/apiClient';
import type { RewardPoints } from '@/features/reward-points/types/rewardPoint.type';

export const rewardPointService = {
    getRewardPoints: (profileId: string) =>
        apiClient.get<RewardPoints>('/reward-points', {
            params: { profileId },
        }),
};
