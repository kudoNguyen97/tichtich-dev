import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mission } from '@/features/missions/types/mission.type';
import { MISSION_STATUS_BADGE_LABEL_VI } from '@/constants/missions/missionStatusBadgeVi';
import {
    calendarDaysUntilEnd,
    getMissionAppendDescriptor,
    getMissionCardBadge,
    getMissionCardBadgeClassName,
    getMissionProgressBarPercent,
    normalizeMissionProgressPercent,
    normalizeMissionStatus,
} from './missionUi';

function mission(partial: Partial<Mission>): Mission {
    return {
        id: '1',
        title: 't',
        description: '',
        profileId: 'p',
        walletType: 'saving',
        amount: 1000,
        startDay: '2026-01-01',
        endDay: '2026-12-31',
        rewardPoint: 0,
        status: 'pending',
        createdAt: '',
        updatedAt: '',
        ...partial,
    };
}

describe('normalizeMissionStatus', () => {
    it('lowercases and trims', () => {
        expect(normalizeMissionStatus('  IN_PROGRESS ')).toBe('in_progress');
    });
});

describe('normalizeMissionProgressPercent', () => {
    it('clamps integer percent', () => {
        expect(normalizeMissionProgressPercent(50)).toBe(50);
        expect(normalizeMissionProgressPercent(150)).toBe(100);
    });

    it('treats decimals in (0,1] as fractions', () => {
        expect(normalizeMissionProgressPercent(0.75)).toBe(75);
    });

    it('handles integer 1 as one percent', () => {
        expect(normalizeMissionProgressPercent(1)).toBe(1);
    });
});

describe('getMissionProgressBarPercent', () => {
    it('forces pending missions to 0', () => {
        expect(
            getMissionProgressBarPercent(
                mission({
                    status: 'pending',
                    progress: { progressPercent: 80 } as Mission['progress'],
                })
            )
        ).toBe(0);
    });

    it('uses normalized progress for in_progress', () => {
        expect(
            getMissionProgressBarPercent(
                mission({
                    status: 'in_progress',
                    progress: { progressPercent: 40 } as Mission['progress'],
                })
            )
        ).toBe(40);
    });
});

describe('getMissionAppendDescriptor', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-15T12:00:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns none for cancelled', () => {
        expect(getMissionAppendDescriptor(mission({ status: 'cancelled' }))).toEqual({
            kind: 'none',
        });
    });

    it('pending before start shows label', () => {
        const d = getMissionAppendDescriptor(
            mission({
                status: 'pending',
                startDay: '2026-06-20',
                endDay: '2026-07-01',
            })
        );
        expect(d.kind).toBe('pending_before_start');
        if (d.kind === 'pending_before_start') {
            expect(d.startDayLabel.length).toBeGreaterThan(0);
        }
    });

    it('pending on or after start day enables start', () => {
        const d = getMissionAppendDescriptor(
            mission({
                status: 'pending',
                startDay: '2026-06-14',
                endDay: '2026-07-01',
            })
        );
        expect(d.kind).toBe('pending_start');
    });

    it('in_progress below 100 has no CTA', () => {
        expect(
            getMissionAppendDescriptor(
                mission({
                    status: 'in_progress',
                    progress: {
                        progressPercent: 40,
                    } as Mission['progress'],
                })
            ).kind
        ).toBe('none');
    });

    it('in_progress at 100 shows confirm', () => {
        expect(
            getMissionAppendDescriptor(
                mission({
                    status: 'in_progress',
                    progress: {
                        progressPercent: 100,
                    } as Mission['progress'],
                })
            ).kind
        ).toBe('confirm_complete');
    });

    it('completed shows confirm', () => {
        expect(
            getMissionAppendDescriptor(mission({ status: 'completed' })).kind
        ).toBe('confirm_complete');
    });
});

describe('getMissionCardBadge', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-15T12:00:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows urgency when in_progress and deadline within 3 days', () => {
        const b = getMissionCardBadge(
            mission({
                status: 'in_progress',
                endDay: '2026-06-16',
            })
        );
        expect(b.label).toBe('Sắp hết hạn');
        expect(b.variant).toBe('progress');
    });

    it('does not show urgency when exactly 3 days away', () => {
        const b = getMissionCardBadge(
            mission({
                status: 'in_progress',
                endDay: '2026-06-18',
            })
        );
        expect(b.label).toBe(MISSION_STATUS_BADGE_LABEL_VI.in_progress);
    });

    it('uses product mapping for terminal statuses', () => {
        expect(
            getMissionCardBadge(mission({ status: 'pending', endDay: '2099-01-01' })).label
        ).toBe(MISSION_STATUS_BADGE_LABEL_VI.pending);
        expect(getMissionCardBadge(mission({ status: 'completed' })).label).toBe(
            MISSION_STATUS_BADGE_LABEL_VI.completed
        );
        expect(getMissionCardBadge(mission({ status: 'resolved' })).label).toBe(
            MISSION_STATUS_BADGE_LABEL_VI.resolved
        );
        expect(getMissionCardBadge(mission({ status: 'failed' })).label).toBe(
            MISSION_STATUS_BADGE_LABEL_VI.failed
        );
        expect(getMissionCardBadge(mission({ status: 'cancelled' })).label).toBe(
            MISSION_STATUS_BADGE_LABEL_VI.cancelled
        );
    });
});

describe('getMissionCardBadgeClassName', () => {
    it('maps pending and completed to green', () => {
        expect(getMissionCardBadgeClassName(mission({ status: 'pending' }))).toBe(
            'bg-tichtich-green'
        );
        expect(getMissionCardBadgeClassName(mission({ status: 'completed' }))).toBe(
            'bg-tichtich-green'
        );
    });

    it('maps failed and cancelled to red', () => {
        expect(getMissionCardBadgeClassName(mission({ status: 'failed' }))).toBe(
            'bg-tichtich-red'
        );
        expect(getMissionCardBadgeClassName(mission({ status: 'cancelled' }))).toBe(
            'bg-tichtich-red'
        );
    });

    it('maps remaining statuses to primary-200', () => {
        expect(getMissionCardBadgeClassName(mission({ status: 'in_progress' }))).toBe(
            'bg-tichtich-primary-200'
        );
        expect(getMissionCardBadgeClassName(mission({ status: 'resolved' }))).toBe(
            'bg-tichtich-primary-200'
        );
    });
});

describe('calendarDaysUntilEnd', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-06-15T12:00:00'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('counts calendar days to end date', () => {
        expect(calendarDaysUntilEnd('2026-06-17')).toBe(2);
        expect(calendarDaysUntilEnd('2026-06-15')).toBe(0);
    });
});
