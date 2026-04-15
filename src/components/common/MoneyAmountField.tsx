import { useRef } from 'react';
import { useTextField } from '@react-aria/textfield';
import { cn } from '@/utils/cn';
import { formatRewardAmountDisplay } from '@/helpers/adult/reward/rewardFormat';

export interface MoneyAmountFieldProps {
    label: string;
    isRequired?: boolean;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    placeholder?: string;
    suggestions: number[];
    selectedAmount?: number;
    /** Bắt buộc khi `suggestions` có phần tử (chip gọi callback). */
    onPickSuggestion?: (amount: number) => void;
    suggestionGroupLabel?: string;
    className?: string;
}

const inputClassName = [
    'w-full h-[52px] rounded-xl border bg-white',
    'pl-4 pr-10 text-lg font-bold text-orange-500',
    'outline-none transition-colors placeholder:text-gray-300',
    'focus:ring-1 focus:ring-orange-300',
].join(' ');

export function MoneyAmountField({
    label,
    isRequired = false,
    value,
    onChange,
    onBlur,
    error,
    placeholder = '0',
    suggestions,
    selectedAmount,
    onPickSuggestion,
    suggestionGroupLabel = 'Gợi ý số tiền',
    className,
}: MoneyAmountFieldProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { labelProps, inputProps, errorMessageProps } = useTextField(
        {
            label,
            isRequired,
            value,
            onChange,
            onBlur,
            validationState: error ? 'invalid' : 'valid',
            inputMode: 'numeric',
            autoComplete: 'off',
        },
        ref
    );

    return (
        <div className={cn(className)}>
            <div className="mb-5">
                <label
                    {...labelProps}
                    className="flex items-center gap-1 text-base font-bold text-gray-700 mb-2"
                >
                    {label}{' '}
                    {isRequired && (
                        <span className="text-red-500" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>

                <div className="relative">
                    <input
                        {...inputProps}
                        ref={ref}
                        placeholder={placeholder}
                        className={cn(
                            inputClassName,
                            error
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-tichtich-black hover:border-tichtich-primary-200 focus:border-tichtich-primary-200'
                        )}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-orange-400 pointer-events-none select-none">
                        đ
                    </span>
                </div>

                {error ? (
                    <p
                        {...errorMessageProps}
                        role="alert"
                        className="mt-1.5 text-xs text-red-500"
                    >
                        {error}
                    </p>
                ) : null}
            </div>

            {suggestions.length > 0 ? (
                <div
                    role="group"
                    aria-label={suggestionGroupLabel}
                    className="flex flex-wrap gap-2 -mt-2 mb-5"
                >
                    {suggestions.map((amount) => {
                        const isSelected = amount === selectedAmount;
                        return (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => onPickSuggestion?.(amount)}
                                aria-pressed={isSelected}
                                className={[
                                    'px-4 py-2 cursor-pointer rounded-lg border text-sm font-bold transition-colors',
                                    isSelected
                                        ? 'bg-tichtich-primary-200 border-tichtich-primary-200 text-white'
                                        : 'bg-white border-tichtich-black text-tichtich-black hover:bg-tichtich-primary-300/40 hover:border-tichtich-primary-200',
                                ].join(' ')}
                            >
                                {formatRewardAmountDisplay(amount)}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
