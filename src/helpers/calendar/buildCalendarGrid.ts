import dayjs, { type Dayjs } from 'dayjs';

const GRID_SIZE = 42;

/**
 * Returns a flat array of 42 cells (6 weeks × 7 days).
 * Cells before the 1st of the month are null (leading empty cells).
 * Week starts on Sunday (index 0), matching header: CN T2 T3 T4 T5 T6 T7.
 *
 * @param year  full year, e.g. 2026
 * @param month 1-based month, e.g. 4 for April
 */
export function buildCalendarGrid(
    year: number,
    month: number
): (Dayjs | null)[] {
    const firstDay = dayjs(new Date(year, month - 1, 1));
    const leadingEmpties = firstDay.day();
    const daysInMonth = firstDay.daysInMonth();

    const cells: (Dayjs | null)[] = [];

    for (let i = 0; i < leadingEmpties; i++) {
        cells.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(firstDay.date(d));
    }

    while (cells.length < GRID_SIZE) {
        cells.push(null);
    }

    return cells;
}
