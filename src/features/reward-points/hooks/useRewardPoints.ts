import { useQuery } from '@tanstack/react-query';
import { rewardPointKeys } from '@/features/reward-points/api/rewardPoint.keys';
import { rewardPointService } from '@/features/reward-points/api/rewardPoint.service';

export function useRewardPoints(profileId: string) {
    return useQuery({
        queryKey: rewardPointKeys.byProfileId(profileId),
        queryFn: () => rewardPointService.getRewardPoints(profileId),
        enabled: Boolean(profileId),
    });
}
