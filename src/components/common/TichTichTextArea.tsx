import {
    FieldError,
    Label,
    Text,
    TextArea,
    TextField,
} from 'react-aria-components';
import type { TextFieldProps } from 'react-aria-components';
import { cn } from '@/utils/cn';

interface TichTichTextAreaProps extends TextFieldProps {
    label?: string;
    placeholder?: string;
    helperText?: string;
    errorMessage?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    textAreaClassName?: string;
}

export function TichTichTextArea({
    label,
    placeholder,
    helperText,
    errorMessage,
    isRequired = false,
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    maxLength,
    value,
    onChange,
    className,
    textAreaClassName,
    ...props
}: TichTichTextAreaProps) {
    const { 'aria-label': ariaLabelProp, ...restProps } = props;
    const hasError = isInvalid || !!errorMessage;
    const charCount = typeof value === 'string' ? value.length : 0;

    const ariaLabelForField =
        label != null && label !== ''
            ? undefined
            : (ariaLabelProp ?? placeholder ?? 'Nhập nội dung');

    return (
        <TextField
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isInvalid={hasError}
            isRequired={isRequired}
            value={value}
            onChange={onChange}
            className={cn('flex flex-col gap-1.5', className)}
            {...restProps}
            aria-label={ariaLabelForField}
        >
            {label && (
                <Label className="text-base font-bold text-tichtich-black">
                    {label}
                    {isRequired && (
                        <span
                            className="ml-0.5 text-tichtich-red"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </Label>
            )}

            <TextArea
                placeholder={placeholder}
                maxLength={maxLength}
                className={cn(
                    'w-full rounded-lg border bg-white px-3 py-3 text-sm text-tichtich-black',
                    'outline-none transition-all duration-200 resize-none min-h-24',
                    hasError
                        ? 'border-tichtich-red focus:border-tichtich-red focus:ring-1 focus:ring-tichtich-red/20'
                        : 'border-tichtich-black focus-visible:ring-1 focus-visible:ring-tichtich-primary-200',
                    isDisabled && 'bg-gray-50 text-gray-400 cursor-not-allowed',
                    isReadOnly && 'bg-gray-50 cursor-default',
                    textAreaClassName
                )}
            />

            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    {errorMessage ? (
                        <FieldError className="text-xs text-tichtich-red">
                            {errorMessage}
                        </FieldError>
                    ) : helperText ? (
                        <Text
                            slot="description"
                            className="text-xs text-gray-500"
                        >
                            {helperText}
                        </Text>
                    ) : null}
                </div>
                {maxLength != null && (
                    <span className="shrink-0 text-xs text-gray-500">
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
        </TextField>
    );
}
