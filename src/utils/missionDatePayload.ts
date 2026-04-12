import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Map hai ngày lịch `YYYY-MM-DD` sang ranh giới UTC (ngày đó trên lịch UTC).
 * start: 00:00:00.000Z, end: 23:59:59.000Z cùng ngày calendar UTC.
 */
export function calendarYmdToMissionUtcBounds(
    startYmd: string,
    endYmd: string
): { startDay: string; endDay: string } {
    const start = dayjs.utc(startYmd, 'YYYY-MM-DD', true).startOf('day');
    const end = dayjs.utc(endYmd, 'YYYY-MM-DD', true).endOf('day');

    return {
        startDay: start.toISOString(),
        endDay: end.toISOString(),
    };
}
