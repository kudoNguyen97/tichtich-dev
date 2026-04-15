import { cn } from '@/utils/cn';

type SpendPreviewCategory = {
    id: string;
    label: string;
    icon: string;
    amount: number;
};

interface SpendPreviewChartProps {
    categories: SpendPreviewCategory[];
    selectedCategoryId: string | null;
    spendAmount: number;
}

const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const toSafeNumber = (input: unknown, fallback = 0) => {
    const parsed = typeof input === 'number' ? input : Number(input);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export function SpendPreviewChart({
    categories,
    selectedCategoryId,
    spendAmount,
}: SpendPreviewChartProps) {
    const safeCategories = categories.map((category) => ({
        ...category,
        amount: Math.max(0, toSafeNumber(category.amount, 0)),
    }));

    const totalBefore = safeCategories.reduce(
        (sum, category) => sum + category.amount,
        0
    );
    const allZero = totalBefore <= 0;

    const basePercents = safeCategories.map((category) => {
        if (allZero) return 25;
        return Math.max(0, Math.round((category.amount / totalBefore) * 100));
    });

    if (!allZero && basePercents.length > 0) {
        const sum = basePercents.reduce((acc, value) => acc + value, 0);
        if (sum !== 100) {
            const maxIndex = basePercents.indexOf(Math.max(...basePercents));
            basePercents[maxIndex] += 100 - sum;
        }
    }

    const TOP_INDICES = [1, 3];
    const safeSpendAmount = Math.max(0, toSafeNumber(spendAmount, 0));
    const leftOffsets = basePercents.map((_, index) =>
        basePercents
            .slice(0, index)
            .reduce((sum, value) => sum + value, 0)
    );

    const getCategoryDisplayData = (category: SpendPreviewCategory) => {
        const isSelected = selectedCategoryId === category.id;
        const safeAmount = Math.max(0, toSafeNumber(category.amount, 0));
        const spentInCategory = isSelected
            ? Math.min(safeSpendAmount, safeAmount)
            : 0;
        const spentPctWithinCategory =
            safeAmount > 0 ? Math.min(100, (spentInCategory / safeAmount) * 100) : 0;
        const remainingAmount = Math.max(0, safeAmount - spentInCategory);

        return {
            isSelected,
            spentInCategory,
            spentPctWithinCategory,
            remainingAmount,
        };
    };

    const renderMetadata = (
        category: SpendPreviewCategory,
        index: number,
        position: 'top' | 'bottom'
    ) => {
        const shouldRenderTop = TOP_INDICES.includes(index);
        if ((position === 'top' && !shouldRenderTop) || (position === 'bottom' && shouldRenderTop)) {
            return null;
        }

        const { isSelected, spentInCategory, remainingAmount } =
            getCategoryDisplayData(category);

        return (
            <div
                key={`${position}-${category.id}`}
                className={cn(
                    'absolute flex gap-1',
                    position === 'top'
                        ? 'items-start flex-col-reverse'
                        : 'items-start flex-col'
                )}
                style={{
                    left: `${leftOffsets[index]}%`,
                }}
            >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md bg-tichtich-primary-100">
                    <img
                        src={category.icon}
                        alt={category.label}
                        className="size-full object-contain"
                    />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground font-medium mt-1 whitespace-nowrap">
                        {category.label}
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap">
                        {formatMoney(remainingAmount)}
                    </span>
                    {isSelected && spentInCategory > 0 && (
                        <span className="text-[10px] font-semibold text-tichtich-red whitespace-nowrap">
                            -{formatMoney(spentInCategory)}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="my-6">
            <div className="relative h-[88px]">
                {safeCategories.map((category, index) =>
                    renderMetadata(category, index, 'top')
                )}
            </div>

            <div className="flex gap-2 h-20 rounded-xl">
                {safeCategories.map((category, index) => {
                    const { isSelected, spentInCategory, spentPctWithinCategory } =
                        getCategoryDisplayData(category);

                    return (
                        <div
                            key={category.id}
                            className="relative flex items-end bg-tichtich-primary-100 justify-start rounded-lg p-2 transition-all duration-200 ease-out overflow-hidden"
                            style={{
                                width: `${basePercents[index]}%`,
                                minWidth: '40px',
                            }}
                        >
                            {isSelected && spentInCategory > 0 && (
                                <div
                                    className="absolute right-0 top-0 h-full bg-tichtich-primary-200"
                                    style={{
                                        width: `${spentPctWithinCategory}%`,
                                    }}
                                />
                            )}
                            <span className="relative z-10 text-sm font-semibold text-black">
                                {basePercents[index]}%
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="relative mt-2 h-[88px]">
                {safeCategories.map((category, index) =>
                    renderMetadata(category, index, 'bottom')
                )}
            </div>
        </div>
    );
}
