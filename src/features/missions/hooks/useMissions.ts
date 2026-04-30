import { useMutation, useQuery } from '@tanstack/react-query';
import { missionKeys } from '@/features/missions/api/mission.keys';
import { missionService } from '@/features/missions/api/mission.service';
import type {
    CreateMissionPayload,
    DeleteMissionData,
    Mission,
    MissionResolveData,
} from '@/features/missions/types/mission.type';
import { rewardPointKeys } from '@/features/reward-points/api/rewardPoint.keys';
import { walletKeys } from '@/features/wallets/api/wallet.keys';
import { queryClient } from '@/lib/queryClient';
import { showError } from '@/lib/toast';

export function useMissionsByProfileIdKid(
    profileId: string,
    statuses?: string[]
) {
    return useQuery({
        queryKey: missionKeys.listByProfileIdKid(profileId, statuses),
        queryFn: () =>
            missionService.getListByProfileIdKid(profileId, statuses),
        enabled: !!profileId,
        refetchOnMount: 'always',
    });
}

export function useCreateMission() {
    return useMutation<Mission, Error, CreateMissionPayload>({
        mutationFn: (payload: CreateMissionPayload) =>
            missionService.create(payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: missionKeys.listByProfileIdKid(variables.profileId),
            });
            queryClient.invalidateQueries({
                queryKey: missionKeys.listsByProfileIdKid(),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export function useDeleteMission() {
    return useMutation<DeleteMissionData, Error, string>({
        mutationFn: missionService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: missionKeys.listsByProfileIdKid(),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export type KidMissionMutationVars = { missionId: string; profileId: string };

export function useKidMissionStartMutation() {
    return useMutation<Mission, Error, KidMissionMutationVars>({
        mutationFn: ({ missionId, profileId }) =>
            missionService.startKidMission(missionId, profileId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: missionKeys.listByProfileIdKid(variables.profileId),
            });
            queryClient.invalidateQueries({
                queryKey: missionKeys.listsByProfileIdKid(),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export function useKidMissionResolveMutation() {
    return useMutation<MissionResolveData, Error, KidMissionMutationVars>({
        mutationFn: ({ missionId, profileId }) =>
            missionService.resolveKidMission(missionId, profileId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: missionKeys.listByProfileIdKid(variables.profileId),
            });
            queryClient.invalidateQueries({
                queryKey: missionKeys.listsByProfileIdKid(),
            });
            queryClient.invalidateQueries({
                queryKey: walletKeys.listByProfileId(variables.profileId),
            });
            queryClient.invalidateQueries({
                queryKey: walletKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: rewardPointKeys.byProfileId(variables.profileId),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}
