import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWalletTransactions } from '@/features/wallets/hooks/useWallets';
import type { WalletTransaction } from '@/features/wallets/types/wallet.type';
import { buildCalendarGrid } from '@/helpers/calendar/buildCalendarGrid';
import { groupTransactionsByDay } from '@/helpers/calendar/groupTransactionsByDay';
import { getDistinctTypeTransactions } from '@/helpers/calendar/getDistinctTypeTransactions';
import {
    getTransactionIcon,
    LEGEND_ENTRIES,
} from '@/helpers/calendar/transactionIconMap';
import { cn } from '@/utils/cn';

const CELL_BORDER = 'border-r border-b border-[#b8d88a]';
const GRID_BORDER = 'border-l border-t border-[#b8d88a]';

const DAY_HEADERS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ActivityCalendarProps {
    profileId: string;
    initialMonth?: Date;
    onDayPress?: (date: Date, transactions: WalletTransaction[]) => void;
    highlightedDate?: Date;
    className?: string;
}

// ─── CalendarHeader ───────────────────────────────────────────────────────────

interface CalendarHeaderProps {
    currentMonth: Dayjs;
    onPrev: () => void;
    onNext: () => void;
}

function CalendarHeader({ currentMonth, onPrev, onNext }: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-bold text-base text-tichtich-violet">
                Lịch hoạt động
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={onPrev}
                    aria-label="Tháng trước"
                    className="p-1 rounded-full hover:bg-black/10 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 text-tichtich-violet" />
                </button>
                <span className="font-bold text-base text-tichtich-violet min-w-[90px] text-center">
                    {currentMonth.format('M')} / {currentMonth.format('YYYY')}
                </span>
                <button
                    onClick={onNext}
                    aria-label="Tháng sau"
                    className="p-1 rounded-full hover:bg-black/10 transition-colors"
                >
                    <ChevronRight className="w-4 h-4 text-tichtich-violet" />
                </button>
            </div>
        </div>
    );
}

// ─── DayCell ─────────────────────────────────────────────────────────────────

interface DayCellProps {
    day: Dayjs;
    transactions: WalletTransaction[];
    isHighlighted: boolean;
    isSelected: boolean;
    onClick: () => void;
}

function DayCell({
    day,
    transactions,
    isHighlighted,
    isSelected,
    onClick,
}: DayCellProps) {
    const distinctTxs = getDistinctTypeTransactions(transactions);
    const firstTx = distinctTxs[0];
    const overflowCount = distinctTxs.length - 1;

    return (
        <div
            role="gridcell"
            aria-label={`${day.format('D/M/YYYY')}${transactions.length > 0 ? ` — ${transactions.length} hoạt động` : ''}`}
            aria-selected={isSelected}
            onClick={onClick}
            className={cn(
                'relative flex flex-col items-center py-1 px-0.5 cursor-pointer select-none min-h-[60px]',
                CELL_BORDER,
                isSelected
                    ? 'bg-tichtich-pink'
                    : isHighlighted
                      ? 'bg-tichtich-primary-300'
                      : 'hover:bg-black/5'
            )}
        >
            <span
                className={cn(
                    'text-xs font-semibold leading-none mb-0.5'
                    // isHighlighted ? 'text-white' : 'text-tichtich-black'
                )}
            >
                {day.date()}
            </span>

            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {firstTx && (
                <>
                    <img
                        src={getTransactionIcon(firstTx.type).src}
                        alt={getTransactionIcon(firstTx.type).label}
                        title={getTransactionIcon(firstTx.type).label}
                        className="w-4 h-4 object-contain"
                    />
                    {overflowCount > 0 && (
                        <span
                            className={cn(
                                'text-[10px] font-bold leading-none mt-0.5',
                                isHighlighted
                                    ? 'text-white'
                                    : 'text-tichtich-primary-200'
                            )}
                        >
                            +{overflowCount}
                        </span>
                    )}
                </>
            )}
        </div>
    );
}

// ─── EmptyCell ───────────────────────────────────────────────────────────────

function EmptyCell() {
    return (
        <div
            role="gridcell"
            aria-hidden="true"
            className={cn('min-h-[60px]', CELL_BORDER)}
        />
    );
}

// ─── ShimmerCell ─────────────────────────────────────────────────────────────

function ShimmerCell() {
    return (
        <div
            className={cn('bg-black/5 animate-pulse min-h-[60px]', CELL_BORDER)}
        />
    );
}

// ─── CalendarLegend ──────────────────────────────────────────────────────────

function CalendarLegend() {
    return (
        <div className="mt-3 pt-3 border-t border-black/10">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {LEGEND_ENTRIES.map((entry) => (
                    <div key={entry.type} className="flex items-center gap-1.5">
                        <img
                            src={entry.src}
                            alt={entry.label}
                            className="w-4 h-4 object-contain shrink-0"
                        />
                        <span className="text-[11px] text-tichtich-black leading-tight">
                            {entry.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── TransactionFooter ───────────────────────────────────────────────────────

interface TransactionFooterProps {
    transactions: WalletTransaction[];
}

function TransactionFooter({ transactions }: TransactionFooterProps) {
    const distinctTxs = getDistinctTypeTransactions(transactions);

    return (
        <div className="mt-3 pt-3 border-t border-black/10">
            <div className="flex flex-col gap-2">
                {distinctTxs.map((tx) => {
                    const icon = getTransactionIcon(tx.type);
                    return (
                        <div key={tx.type} className="flex items-center gap-2">
                            <img
                                src={icon.src}
                                alt={icon.label}
                                className="w-5 h-5 object-contain shrink-0"
                            />
                            <span className="text-xs text-tichtich-black leading-tight">
                                {tx.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── ActivityCalendar ─────────────────────────────────────────────────────────

export function ActivityCalendar({
    profileId,
    initialMonth,
    onDayPress,
    highlightedDate,
    className,
}: ActivityCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(() =>
        dayjs(initialMonth).startOf('month')
    );

    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const filters = useMemo(
        () => ({
            fromDate: currentMonth.startOf('month').format('YYYY-MM-DD'),
            toDate: currentMonth.endOf('month').format('YYYY-MM-DD'),
        }),
        [currentMonth]
    );

    const { data, isLoading, isError } = useWalletTransactions(
        profileId,
        filters
    );

    const grouped = useMemo(
        () => groupTransactionsByDay(data?.transactions ?? []),
        [data]
    );

    const calendarGrid = useMemo(
        () => buildCalendarGrid(currentMonth.year(), currentMonth.month() + 1),
        [currentMonth]
    );

    const effectiveHighlight = useMemo(
        () => (highlightedDate ? dayjs(highlightedDate) : dayjs()),
        [highlightedDate]
    );

    const selectedTxs = selectedDate ? (grouped[selectedDate] ?? []) : [];
    const showFooterTransactions =
        selectedDate !== null && selectedTxs.length > 0;
    const showFooter = selectedDate === null || showFooterTransactions;

    function handleDayClick(day: Dayjs, txs: WalletTransaction[]) {
        const key = day.format('YYYY-MM-DD');
        setSelectedDate((prev) => (prev === key ? null : key));
        onDayPress?.(day.toDate(), txs);
    }

    return (
        <div className={cn('rounded-2xl bg-[#e8f5c8] p-4 w-full', className)}>
            <CalendarHeader
                currentMonth={currentMonth}
                onPrev={() => {
                    setCurrentMonth((m) => m.subtract(1, 'month'));
                    setSelectedDate(null);
                }}
                onNext={() => {
                    setCurrentMonth((m) => m.add(1, 'month'));
                    setSelectedDate(null);
                }}
            />

            {/* Day-of-week header */}
            <div role="row" className="grid grid-cols-7 mb-0">
                {DAY_HEADERS.map((h) => (
                    <div
                        key={h}
                        role="columnheader"
                        aria-label={h}
                        className="text-center text-xs font-bold text-tichtich-violet py-1"
                    >
                        {h}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div
                role="grid"
                aria-label={`Lịch tháng ${currentMonth.format('M/YYYY')}`}
                className={cn('grid grid-cols-7', GRID_BORDER)}
            >
                {isLoading
                    ? Array.from({ length: 42 }).map((_, i) => (
                          <ShimmerCell key={i} />
                      ))
                    : calendarGrid.map((day, i) => {
                          if (!day) {
                              return <EmptyCell key={`empty-${i}`} />;
                          }
                          const key = day.format('YYYY-MM-DD');
                          const txs = grouped[key] ?? [];
                          const isHighlighted = day.isSame(
                              effectiveHighlight,
                              'day'
                          );
                          return (
                              <DayCell
                                  key={key}
                                  day={day}
                                  transactions={txs}
                                  isHighlighted={isHighlighted}
                                  isSelected={selectedDate === key}
                                  onClick={() => handleDayClick(day, txs)}
                              />
                          );
                      })}
            </div>

            {isError && (
                <p className="mt-2 text-center text-xs text-tichtich-red">
                    Không thể tải dữ liệu. Vui lòng thử lại.
                </p>
            )}

            {showFooter &&
                (showFooterTransactions ? (
                    <TransactionFooter transactions={selectedTxs} />
                ) : (
                    <CalendarLegend />
                ))}
        </div>
    );
}
