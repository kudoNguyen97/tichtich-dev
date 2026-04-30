export const MISSION_STATUS_BADGE_LABEL_VI = {
    pending: 'Mới',
    in_progress: 'Đang thực hiện',
    completed: 'Đạt mục tiêu',
    resolved: 'Đã hoàn thành',
    failed: 'Đã cố gắng',
    cancelled: 'Đã huỷ',
} as const;

export type MissionBadgeStatusKey = keyof typeof MISSION_STATUS_BADGE_LABEL_VI;
