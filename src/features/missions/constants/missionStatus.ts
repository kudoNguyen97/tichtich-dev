export const MISSION_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    RESOLVED: 'resolved',
    FAILED: 'failed',
} as const;

export type MissionStatusValue =
    (typeof MISSION_STATUS)[keyof typeof MISSION_STATUS];
