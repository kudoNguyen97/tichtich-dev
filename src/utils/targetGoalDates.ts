import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import dayjs from 'dayjs';

/** Chuỗi YYYY-MM-DD → CalendarDate (local), hoặc null nếu không parse được. */
export function isoDateStringToCalendarDate(iso: string): CalendarDate | null {
    const s = iso.trim();
    if (!s) return null;
    const d = dayjs(s, 'YYYY-MM-DD', true);
    if (!d.isValid()) return null;
    return new CalendarDate(d.year(), d.month() + 1, d.date());
}

/** CalendarDate → YYYY-MM-DD */
export function calendarDateToIsoString(d: CalendarDate): string {
    return dayjs(new Date(d.year, d.month - 1, d.day))
        .startOf('day')
        .format('YYYY-MM-DD');
}

export function getTodayCalendarDate(): CalendarDate {
    return today(getLocalTimeZone());
}

/** Ngày kết thúc tối thiểu: ngày sau ngày bắt đầu (end > start). */
export function minEndDateAfterStart(start: CalendarDate): CalendarDate {
    return start.add({ days: 1 });
}

export type GoalDateIssue = {
    path: 'startDate' | 'endDate';
    message: string;
};

/**
 * Rule: nếu có start — parse + >= hôm nay; nếu có end — parse; nếu có cả hai — end > start.
 * Dùng trong Zod superRefine (và có thể tái dùng nơi khác).
 */
export function collectGoalDateIssues(
    startIso: string,
    endIso: string
): GoalDateIssue[] {
    const issues: GoalDateIssue[] = [];
    const startTrim = startIso.trim();
    const endTrim = endIso.trim();

    if (startTrim) {
        const start = isoDateStringToCalendarDate(startTrim);
        if (!start) {
            issues.push({
                path: 'startDate',
                message: 'Ngày bắt đầu không hợp lệ.',
            });
        } else if (start.compare(getTodayCalendarDate()) < 0) {
            issues.push({
                path: 'startDate',
                message: 'Ngày bắt đầu phải từ hôm nay trở đi.',
            });
        }
    }

    if (endTrim) {
        const end = isoDateStringToCalendarDate(endTrim);
        if (!end) {
            issues.push({
                path: 'endDate',
                message: 'Ngày kết thúc không hợp lệ.',
            });
        }
    }

    if (startTrim && endTrim) {
        const start = isoDateStringToCalendarDate(startTrim);
        const end = isoDateStringToCalendarDate(endTrim);
        if (start && end && end.compare(start) <= 0) {
            issues.push({
                path: 'endDate',
                message: 'Ngày kết thúc phải sau ngày bắt đầu.',
            });
        }
    }

    return issues;
}
