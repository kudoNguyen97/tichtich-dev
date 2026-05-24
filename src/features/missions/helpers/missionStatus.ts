import { MISSION_STATUS } from '@/features/missions/constants/missionStatus';
import type { Mission } from '@/features/missions/types/mission.type';
import { normalizeMissionStatus } from '@/helpers/missions/missionUi';

export const isMissionPending = (m: Mission): boolean =>
    normalizeMissionStatus(m.status) === MISSION_STATUS.PENDING;

export const isMissionInProgress = (m: Mission): boolean =>
    normalizeMissionStatus(m.status) === MISSION_STATUS.IN_PROGRESS;

export const isMissionCompleted = (m: Mission): boolean =>
    normalizeMissionStatus(m.status) === MISSION_STATUS.COMPLETED;

export const isMissionResolved = (m: Mission): boolean =>
    normalizeMissionStatus(m.status) === MISSION_STATUS.RESOLVED;

export const isMissionFailed = (m: Mission): boolean =>
    normalizeMissionStatus(m.status) === MISSION_STATUS.FAILED;

export const isMissionCancelled = (m: Mission): boolean =>
    normalizeMissionStatus(m.status) === MISSION_STATUS.CANCELLED;

/** Mission đã kết thúc theo trạng thái terminal (resolved/failed/cancelled). */
export const isMissionTerminal = (m: Mission): boolean =>
    isMissionResolved(m) || isMissionFailed(m) || isMissionCancelled(m);

/** Mission hoàn thành thành công (completed/resolved). */
export const isMissionSuccessful = (m: Mission): boolean =>
    isMissionCompleted(m) || isMissionResolved(m);
