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

    // ── Label position logic (from original SplitMoney inline code) ──
    // const percentOf = (amount: number) =>
    //     total > 0 ? Math.round((amount / total) * 100) : 0;

    // const getLabelPosition = (index: number) => {
    //     const leftPct = categories
    //         .slice(0, index)
    //         .reduce((s, x) => s + Math.max(percentOf(x.amount), 1), 0);
    //     const myPct = Math.max(percentOf(categories[index].amount), 1);
    //     const totalFlex =
    //         categories.reduce(
    //             (s, x) => s + Math.max(percentOf(x.amount), 1),
    //             0
    //         ) +
    //         (allocated < total ? Math.max(100 - percentOf(allocated), 1) : 0);
    //     const leftActual = (leftPct / totalFlex) * 100;
    //     const widthActual = (myPct / totalFlex) * 100;
    //     return leftActual + widthActual / 2;
    // };

    // Top labels: Học tập (1), Tiêu vặt (3)
    const TOP_INDICES = [1, 3];
    // Bottom labels: Tiết kiệm (0), Từ thiện (2)
    const BOTTOM_INDICES = [0, 2];

    return (
        <div className="relative">
            {/* ── Top labels (Học tập, Tiêu vặt) ── */}
            <div className="flex h-20 mb-2">
                {categories.map((c, i) => {
                    if (!TOP_INDICES.includes(i)) return null;
                    // const leftPos = getLabelPosition(i);

                    return (
                        // <div
                        //     key={`top-${c.id}`}
                        //     className="absolute top-0 flex flex-col items-center gap-0.5 transition-[left] duration-300"
                        //     style={{
                        //         left: `${leftPos}%`,
                        //         transform: 'translateX(-50%)',
                        //     }}
                        // >
                        //     <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                        //         {c.label}
                        //     </span>
                        //     <span className="text-xs font-semibold whitespace-nowrap">
                        //         {formatMoney(c.amount)}
                        //     </span>
                        //     <div className="w-7 h-7 rounded-lg flex items-center justify-center mt-1 shadow-md">
                        //         <img
                        //             src={c.icon as string}
                        //             className="size-full object-contain"
                        //         />
                        //     </div>
                        // </div>
                        <div
                            key={`top-${c.id}`}
                            className="flex flex-col items-start justify-end transition-all duration-300 ease-out"
                            style={{
                                width: `${barWidths[i]}%`,
                            }}
                        >
                            <div className="flex flex-col items-start justify-start">
                                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                                    {c.label}
                                </span>
                                <span className="text-xs font-semibold whitespace-nowrap">
                                    {formatMoney(c.amount)}
                                </span>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center mt-1 shadow-md">
                                    <img
                                        src={c.icon as string}
                                        className="size-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Horizontal bar ── */}
            <div className="flex gap-2 h-20 overflow-hidden rounded-xl">
                {categories.map((c, i) => (
                    <div
                        key={c.id}
                        className="flex items-end bg-tichtich-primary-100 justify-start rounded-lg p-2 transition-all duration-200 ease-out "
                        style={{
                            width: `${barWidths[i]}%`,
                            // minWidth: barWidths[i] > 0 ? '40px' : '0',
                            minWidth: '40px',
                        }}
                    >
                        <span className="text-sm font-semibold text-black">
                            {displayPercentages[i]}%
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Bottom labels (Tiết kiệm, Từ thiện) ── */}
            <div className="flex h-20 mt-2">
                {categories.map((c, i) => {
                    if (!BOTTOM_INDICES.includes(i)) return null;

                    // const leftPos = getLabelPosition(i);
                    return (
                        <div
                            key={`bottom-${c.id}`}
                            className="flex flex-col items-start justify-start transition-all duration-300 ease-out"
                            style={{ width: `${barWidths[i]}%` }}
                        >
                            <div className="flex flex-col items-start">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md">
                                    <img
                                        src={c.icon as string}
                                        className="size-full object-contain"
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium mt-1 whitespace-nowrap">
                                    {c.label}
                                </span>
                                <span className="text-xs font-semibold whitespace-nowrap">
                                    {formatMoney(c.amount)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
