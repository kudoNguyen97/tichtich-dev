import { Slider, SliderTrack, SliderThumb, Label } from 'react-aria-components';
import { Sparkles } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Format số theo định dạng VND */
const formatVND = (num: number) => num.toLocaleString('vi-VN');

/** Ghép classNames (thay thế cn() của shadcn) */
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

// ─── CategorySlider ──────────────────────────────────────────────────────────

/**
 * Props:
 *  - category   { id, name, icon: LucideIcon, color }
 *  - value      number   (giá trị hiện tại, đơn vị VND)
 *  - maxValue   number   (ngân sách còn lại cho danh mục này)
 *  - totalAmount number  (tổng số tiền — dùng làm trục tham chiếu)
 *  - onChange   (value: number) => void
 *  - percentage number
 */

interface CategorySliderProps {
    category: {
        id: string;
        name: string;
        icon: string;
    };
    value: number;
    maxValue: number;
    totalAmount: number;
    onChange: (value: number) => void;
}

export function CategorySlider({
    category,
    value,
    maxValue,
    totalAmount,
    onChange,
}: CategorySliderProps) {
    /**
     * React Aria's <Slider> nhận value theo đơn vị thực.
     * step=1000 → bước nhảy 1.000 đ cho gọn.
     */
    const handleChange = (val: number) => {
        // Clamp về maxValue để không vượt ngân sách còn lại
        const clamped = Math.max(0, Math.min(val, maxValue));
        onChange(clamped);
    };

    return (
        <Slider
            minValue={0}
            maxValue={totalAmount > 0 ? totalAmount : maxValue}
            value={value}
            step={1000}
            onChange={handleChange}
            className="w-full"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <Label className="font-bold text-foreground text-base select-none">
                    {category.name}
                </Label>
                <div className="flex items-center gap-1">
                    <span className="font-bold text-foreground text-base">
                        {formatVND(value)} đ
                    </span>
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
            </div>

            {/* Track + Thumb */}
            <SliderTrack className="relative h-3 bg-muted rounded-full cursor-pointer bg-white touch-none select-none">
                {() => {
                    const pct =
                        totalAmount > 0
                            ? Math.min((value / totalAmount) * 100, 100)
                            : 0;

                    return (
                        <>
                            {/* Progress fill */}
                            <div
                                className="absolute top-0 left-0 h-full bg-tichtich-primary-200 rounded-full"
                                style={{ width: `${pct}%` }}
                            />

                            {/* Thumb với icon danh mục */}
                            <SliderThumb
                                className={cn(
                                    'absolute top-1/2 -translate-y-1/2',
                                    'w-7 h-7 rounded-lg bg-tichtich-primary-100',
                                    'flex items-center justify-center',
                                    'shadow-lg cursor-grab active:cursor-grabbing',
                                    'outline-none',
                                    'data-focus-visible:ring-2 data-focus-visible:ring-tichtich-primary-100 data-focus-visible:ring-offset-2'
                                )}
                                style={{
                                    transform: 'translate(-50%, 0)',
                                }}
                            >
                                <div className="w-7 h-7 rounded-lg bg-tichtich-primary-100 flex items-center justify-center">
                                    <img
                                        src={category.icon}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </SliderThumb>
                        </>
                    );
                }}
            </SliderTrack>
        </Slider>
    );
}
