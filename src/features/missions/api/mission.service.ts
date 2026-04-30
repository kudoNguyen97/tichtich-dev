import type {
    CreateMissionPayload,
    DeleteMissionData,
    Mission,
    MissionResolveData,
} from '@/features/missions/types/mission.type';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const profileAdultId = useAuthStore.getState().selectedProfile?.id;

export const missionService = {
    create: (payload: CreateMissionPayload) =>
        apiClient.post<Mission>('/missions', payload, {
            headers: { 'x-profile-id': profileAdultId },
        }),

    getListByProfileIdKid: (profileId: string, statuses?: string[]) => {
        return apiClient.get<Mission[]>('/missions', {
            params: {
                profileId,
                ...(statuses && statuses.length > 0
                    ? { status: statuses.join(',') }
                    : {}),
            },
        });
    },

    getDetailMission: (missionId: string, profileId: string) =>
        apiClient.get<Mission>(`/missions/${missionId}`, {
            headers: { 'x-profile-id': profileId },
        }),

    remove: (missionId: string) =>
        apiClient.delete<DeleteMissionData>(`/missions/${missionId}`, {
            headers: { 'x-profile-id': profileAdultId },
        }),

    startKidMission: (missionId: string, profileId: string) =>
        apiClient.post<Mission>(`/missions/${missionId}/start`, undefined, {
            headers: { 'x-profile-id': profileId },
        }),

    resolveKidMission: (missionId: string, profileId: string) =>
        apiClient.post<MissionResolveData>(
            `/missions/${missionId}/resolve`,
            undefined,
            {
                headers: { 'x-profile-id': profileId },
            }
        ),
};
