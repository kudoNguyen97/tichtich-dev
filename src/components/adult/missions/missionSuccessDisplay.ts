import type { Mission } from '@/features/missions/types/mission.type';

export function formatMissionEndDayVi(isoUtc: string): string {
    const d = new Date(isoUtc);
    if (Number.isNaN(d.getTime())) return '';
    const s = new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(d);
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export type MissionStatusBadgeVariant =
    | 'new'
    | 'progress'
    | 'done'
    | 'cancelled'
    | 'pending'
    | 'other';

export function getMissionStatusBadge(mission: Mission): {
    label: string;
    variant: MissionStatusBadgeVariant;
} {
    const { status } = mission;
    if (status === 'completed') {
        return { label: 'Đã thực hiện', variant: 'done' };
    }
    if (status === 'cancelled') {
        return { label: 'Đã hủy', variant: 'cancelled' };
    }
    const p = mission.progress?.progressPercent ?? 0;
    if (status === 'in_progress' || !status) {
        if (p === 0) return { label: 'Mới', variant: 'new' };
        return { label: 'Đang thực hiện', variant: 'progress' };
    }
    if (status === 'pending') {
        return { label: 'Chờ xác nhận', variant: 'pending' };
    }
    return { label: String(status), variant: 'other' };
}

export function missionStatusBadgeClassName(
    variant: MissionStatusBadgeVariant
): string {
    switch (variant) {
        case 'new':
            return 'bg-tichtich-green ';
        case 'progress':
            return 'bg-tichtich-primary-300';
        case 'done':
            return 'bg-tichtich-primary-200';
        case 'cancelled':
            return 'bg-tichtich-red';
        case 'pending':
            return 'bg-tichtich-primary-200';
        default:
            return 'bg-tichtich-green';
    }
}
