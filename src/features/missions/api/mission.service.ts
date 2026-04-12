import type {
    CreateMissionPayload,
    DeleteMissionData,
    Mission,
} from '@/features/missions/types/mission.type';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

const profileAdultId = useAuthStore.getState().selectedProfile?.id;

export const missionService = {
    create: (payload: CreateMissionPayload) =>
        apiClient.post<Mission>('/missions', payload, {
            headers: { 'x-profile-id': profileAdultId },
        }),

    getListByProfileIdKid: (profileId: string) =>
        apiClient.get<Mission[]>(`/missions?profileId=${profileId}`),

    remove: (missionId: string) =>
        apiClient.delete<DeleteMissionData>(`/missions/${missionId}`),
};
