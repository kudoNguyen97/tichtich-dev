import dayjs from 'dayjs';
import { MISSION_STATUS_BADGE_LABEL_VI } from '@/constants/missions/missionStatusBadgeVi';
import type { Mission } from '@/features/missions/types/mission.type';

const BADGE_VI = MISSION_STATUS_BADGE_LABEL_VI;

export type MissionStatusBadgeVariant =
    | 'new'
    | 'progress'
    | 'done'
    | 'cancelled'
    | 'pending'
    | 'other';

/** Lowercase trimmed status for comparisons (API may send mixed case). */
export function normalizeMissionStatus(status: string | undefined): string {
    return String(status ?? '')
        .trim()
        .toLowerCase();
}

/**
 * Converts backend progress to a 0–100 bar value.
 * Integer 0–100 is treated as percent; decimals in (0,1] are treated as fractions (e.g. 0.75 → 75%).
 */
export function normalizeMissionProgressPercent(
    raw: number | undefined
): number {
    const rawPercent = raw ?? 0;
    if (!Number.isFinite(rawPercent) || rawPercent < 0) return 0;

    if (Number.isInteger(rawPercent) && rawPercent <= 100) {
        return Math.min(100, rawPercent);
    }

    if (rawPercent <= 1) {
        return Math.round(rawPercent * 100);
    }

    return Math.min(100, rawPercent);
}

/** Progress shown on mission cards (pending missions always show 0%). */
export function getMissionProgressBarPercent(mission: Mission): number {
    const status = normalizeMissionStatus(mission.status);

    if (status === 'pending') {
        return 0;
    }

    return normalizeMissionProgressPercent(mission.progress?.progressPercent);
}

/** Vietnamese-locale long date formatter shared by mission deadline and start labels. */
export function formatMissionDayVi(isoUtc: string): string {
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

/** Calendar-day comparison at local midnight. */
export function isCalendarStartDayAfterToday(startDayIso: string): boolean {
    const now = dayjs();
    const start = dayjs(startDayIso);
    return start.isAfter(now);
}

/**
 * Whole calendar days from today (local) to end day (local).
 * 0 = due today; negative = overdue.
 */
export function calendarDaysUntilEnd(endDayIso: string): number {
    const today = dayjs().startOf('day');
    const end = dayjs(endDayIso).startOf('day');
    return end.diff(today, 'day');
}

export interface MissionCardBadge {
    label: string;
    variant: MissionStatusBadgeVariant;
}

/** Badge for mission cards (deadline urgency overrides label for in-progress missions). */
export function getMissionCardBadge(mission: Mission): MissionCardBadge {
    const status = normalizeMissionStatus(mission.status);

    const daysUntilEnd = calendarDaysUntilEnd(mission.endDay);
    const urgentSoon =
        status === 'in_progress' && daysUntilEnd >= 0 && daysUntilEnd < 3;

    if (urgentSoon) {
        return { label: 'Sắp hết hạn', variant: 'progress' };
    }

    switch (status) {
        case 'completed':
            return { label: BADGE_VI.completed, variant: 'done' };
        case 'cancelled':
            return { label: BADGE_VI.cancelled, variant: 'cancelled' };
        case 'resolved':
            return { label: BADGE_VI.resolved, variant: 'done' };
        case 'failed':
            return { label: BADGE_VI.failed, variant: 'cancelled' };
        case 'pending':
            return { label: BADGE_VI.pending, variant: 'pending' };
        case 'in_progress':
            return { label: BADGE_VI.in_progress, variant: 'progress' };
        default:
            return {
                label: status ? status.replace(/_/g, ' ') : '—',
                variant: 'other',
            };
    }
}

/** Mission badge background color by status group. */
export function getMissionCardBadgeClassName(mission: Mission): string {
    const status = normalizeMissionStatus(mission.status);

    if (status === 'pending') {
        return 'bg-tichtich-green';
    }

    if (status === 'completed') {
        return 'bg-tichtich-primary-100';
    }

    if (status === 'failed' || status === 'cancelled') {
        return 'bg-tichtich-red';
    }

    return 'bg-tichtich-primary-200';
}

/** Discriminant for kid home mission CTAs (append slot under card). */
export type MissionAppendDescriptor =
    | { kind: 'none' }
    | {
          kind: 'pending_before_start';
          startDayLabel: string;
      }
    | { kind: 'pending_start' }
    | { kind: 'confirm_complete' };

export function getMissionAppendDescriptor(
    mission: Mission
): MissionAppendDescriptor {
    const status = normalizeMissionStatus(mission.status);
    const pct = normalizeMissionProgressPercent(
        mission.progress?.progressPercent
    );

    if (
        status === 'resolved' ||
        status === 'failed' ||
        status === 'cancelled'
    ) {
        return { kind: 'none' };
    }

    if (status === 'pending') {
        if (isCalendarStartDayAfterToday(mission.startDay)) {
            return {
                kind: 'pending_before_start',
                startDayLabel: formatMissionDayVi(mission.startDay),
            };
        }
        return { kind: 'pending_start' };
    }

    if (status === 'in_progress') {
        if (pct < 100) return { kind: 'none' };
        return { kind: 'confirm_complete' };
    }

    if (status === 'completed') {
        return { kind: 'confirm_complete' };
    }

    return { kind: 'none' };
}
