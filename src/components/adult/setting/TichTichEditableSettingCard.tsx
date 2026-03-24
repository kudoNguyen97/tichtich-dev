import { useCallback, useState } from 'react';
import { Button } from 'react-aria-components';
import { cn } from '@/utils/cn';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';

export type TichTichEditableSettingCardVariant = 'count' | 'currency';

export type TichTichEditableSettingCardProps = {
    label: string;
    variant: TichTichEditableSettingCardVariant;
    value: number;
    onSave: (next: number) => void;
    min?: number;
    max?: number;
    className?: string;
    countUnit?: string;
};

const DEFAULT_COUNT_MIN = 0;
const DEFAULT_COUNT_MAX = 999_999;

function formatVndDisplay(n: number): string {
    return `${new Intl.NumberFormat('vi-VN').format(n)} đ`;
}

function parseDigitsOnly(s: string): string {
    return s.replace(/\D/g, '');
}

function parseVndDraft(s: string): number | null {
    const digits = parseDigitsOnly(s);
    if (digits === '') return null;
    const n = parseInt(digits, 10);
    return Number.isFinite(n) ? n : null;
}

function formatVndDraftDisplay(digits: string): string {
    if (digits === '') return '';
    const n = parseInt(digits, 10);
    if (!Number.isFinite(n)) return '';
    return new Intl.NumberFormat('vi-VN').format(n);
}

function clampCount(n: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, Math.round(n)));
}

function parseCountDraft(s: string): number | null {
    const t = s.trim();
    if (t === '') return null;
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : null;
}

export function TichTichEditableSettingCard({
    label,
    variant,
    value,
    onSave,
    min: minProp,
    max: maxProp,
    className,
    countUnit = 'lần',
}: TichTichEditableSettingCardProps) {
    const min = minProp ?? DEFAULT_COUNT_MIN;
    const max = maxProp ?? DEFAULT_COUNT_MAX;

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const beginEdit = useCallback(() => {
        setErrorMessage(undefined);
        if (variant === 'count') {
            setDraft(String(value));
        } else {
            setDraft(parseDigitsOnly(String(Math.max(0, Math.floor(value)))));
        }
        setIsEditing(true);
    }, [variant, value]);

    const cancelEdit = useCallback(() => {
        setDraft('');
        setErrorMessage(undefined);
        setIsEditing(false);
    }, []);

    const applyCountStep = useCallback(
        (delta: number) => {
            setDraft((prev) => {
                const current = parseCountDraft(prev);
                const base = current ?? 0;
                const next = clampCount(base + delta, min, max);
                return String(next);
            });
            setErrorMessage(undefined);
        },
        [min, max]
    );

    const handleSave = useCallback(() => {
        if (variant === 'count') {
            const n = parseCountDraft(draft);
            if (n === null) {
                setErrorMessage('Nhập số hợp lệ');
                return;
            }
            const next = clampCount(n, min, max);
            onSave(next);
        } else {
            const n = parseVndDraft(draft);
            if (n === null) {
                setErrorMessage('Nhập số tiền hợp lệ');
                return;
            }
            onSave(n);
        }
        setErrorMessage(undefined);
        setIsEditing(false);
    }, [variant, draft, min, max, onSave]);

    const viewValue =
        variant === 'count' ? `${value} ${countUnit}` : formatVndDisplay(value);

    const countStepper = (
        <div className="flex h-full min-h-11 items-stretch border-l border-tichtich-black">
            <Button
                type="button"
                aria-label="Giảm"
                onPress={() => applyCountStep(-1)}
                className="flex min-w-10 items-center justify-center px-2 text-lg font-semibold text-tichtich-black transition hover:bg-black/5 pressed:bg-black/10"
            >
                −
            </Button>
            <div className="w-px shrink-0 bg-tichtich-black" aria-hidden />
            <Button
                type="button"
                aria-label="Tăng"
                onPress={() => applyCountStep(1)}
                className="flex min-w-10 items-center justify-center px-2 text-lg font-semibold text-tichtich-black transition hover:bg-black/5 pressed:bg-black/10"
            >
                +
            </Button>
        </div>
    );

    const countRightAdornment = (
        <div className="flex items-stretch">
            <span className="flex items-center pr-2 text-base font-semibold text-tichtich-black">
                {countUnit}
            </span>
            {countStepper}
        </div>
    );

    return (
        <div
            className={cn(
                'rounded-lg bg-tichtich-primary-300 px-5 py-4 border border-[#E5E5E5]',
                className
            )}
        >
            {!isEditing ? (
                <div className="flex flex-col gap-3">
                    <p className="text-base font-medium text-tichtich-black">
                        {label}
                    </p>
                    <div className="min-w-0 flex-1 flex items-center justify-between">
                        <p className="mt-1 text-base font-bold text-tichtich-black">
                            {viewValue}
                        </p>
                        <TichTichButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onPress={beginEdit}
                            className="shrink-0"
                        >
                            Chỉnh sửa
                        </TichTichButton>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <p className="text-base font-semibold text-tichtich-black">
                        {label}
                    </p>

                    {variant === 'count' ? (
                        <TichTichInput
                            type="number"
                            value={draft}
                            onChange={setDraft}
                            errorMessage={errorMessage}
                            isInvalid={!!errorMessage}
                            inputMode="numeric"
                            aria-label={label}
                            rightAdornment={countRightAdornment}
                            inputClassName="pr-[9.5rem] font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                    ) : (
                        <TichTichInput
                            type="text"
                            inputMode="numeric"
                            value={formatVndDraftDisplay(draft)}
                            onChange={(v) => setDraft(parseDigitsOnly(v))}
                            errorMessage={errorMessage}
                            isInvalid={!!errorMessage}
                            aria-label={label}
                            rightAdornment={
                                <span className="text-base font-semibold text-tichtich-black">
                                    đ
                                </span>
                            }
                        />
                    )}

                    <div className="flex justify-end gap-2">
                        <TichTichButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onPress={cancelEdit}
                        >
                            Đóng
                        </TichTichButton>
                        <TichTichButton
                            type="button"
                            variant="primary"
                            size="sm"
                            onPress={handleSave}
                        >
                            Lưu
                        </TichTichButton>
                    </div>
                </div>
            )}
        </div>
    );
}
