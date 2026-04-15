import { cn } from '@/utils/cn';
import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
    id: string;
    label: string;
    icon: string | React.ReactNode;
    amount: number;
}

interface AllocationChartProps {
    categories: readonly Category[];
    total: number;
    // allocated: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatMoney = (n: number) => n.toLocaleString('vi-VN') + ' đ';

// ─── Component ───────────────────────────────────────────────────────────────

export function AllocationChart({
    categories,
    total,
    // allocated,
}: AllocationChartProps) {
    // ── Bar width logic (from AllocationChart reference) ──
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const allZero = totalAllocated === 0;

    const percentages = categories.map((cat) => {
        if (allZero) return 25;
        return totalAllocated > 0
            ? Math.round((cat.amount / totalAllocated) * 100)
            : 0;
    });

    // Ensure percentages sum to exactly 100
    if (!allZero && totalAllocated > 0) {
        const sum = percentages.reduce((a, b) => a + b, 0);
        if (sum !== 100) {
            const maxIndex = percentages.indexOf(Math.max(...percentages));
            percentages[maxIndex] += 100 - sum;
        }
    }

    const barWidths = allZero ? [25, 25, 25, 25] : percentages;

    // Display % relative to total input
    const displayPercentages = categories.map((cat) => {
        if (total <= 0) return 0;
        return Math.round((cat.amount / total) * 100);
    });

    const TOP_INDICES = [1, 3];

    return (
        <div className="relative my-[100px]">
            {/* ── Horizontal bar ── */}
            <div className="flex gap-2 h-20 rounded-xl">
                {categories.map((c, i) => (
                    <div
                        key={c.id}
                        className="relative flex items-end bg-tichtich-primary-100 justify-start rounded-lg p-2 transition-all duration-200 ease-out "
                        style={{
                            width: `${barWidths[i]}%`,
                            // minWidth: barWidths[i] > 0 ? '40px' : '0',
                            minWidth: '40px',
                        }}
                    >
                        <div
                            className={cn(
                                'absolute left-0 flex flex-col items-start justify-start transition-all duration-300 ease-out',
                                TOP_INDICES.includes(i)
                                    ? 'top-[-80px]'
                                    : 'bottom-[-80px]'
                            )}
                            style={{ width: `${barWidths[i]}%` }}
                        >
                            <div
                                className={cn(
                                    'flex flex-col items-start gap-1',
                                    TOP_INDICES.includes(i)
                                        ? 'flex-col-reverse'
                                        : ''
                                )}
                            >
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md">
                                    <img
                                        src={c.icon as string}
                                        className="size-full object-contain"
                                    />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-muted-foreground font-medium mt-1 whitespace-nowrap">
                                        {c.label}
                                    </span>
                                    <span className="text-xs font-semibold whitespace-nowrap">
                                        {formatMoney(c.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-black">
                            {displayPercentages[i]}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
