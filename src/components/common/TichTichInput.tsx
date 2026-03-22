/**
 * Input Component
 * Supports: label, helper text, error state, left/right adornment, character count
 */

import {
    TextField,
    Label,
    Input as AriaInput,
    FieldError,
    Text,
} from 'react-aria-components';
import type { TextFieldProps } from 'react-aria-components';
import { cn } from '@/utils/cn';

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.placeholder]
 * @param {string} [props.helperText]
 * @param {string} [props.errorMessage]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isDisabled]
 * @param {boolean} [props.isReadOnly]
 * @param {boolean} [props.isInvalid]
 * @param {React.ReactNode} [props.leftAdornment]
 * @param {React.ReactNode} [props.rightAdornment]
 * @param {number} [props.maxLength]
 * @param {'text'|'email'|'password'|'number'|'tel'} [props.type='text']
 * @param {string} [props.className]
 * @param {string} [props.inputClassName]
 */

interface TichTichInputProps extends TextFieldProps {
    label?: string;
    placeholder?: string;
    helperText?: string;
    errorMessage?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    leftAdornment?: React.ReactNode;
    rightAdornment?: React.ReactNode;
    maxLength?: number;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    inputClassName?: string;
    children?: React.ReactNode;
}

export function TichTichInput({
    label,
    placeholder,
    helperText,
    errorMessage,
    isRequired = false,
    isDisabled = false,
    isReadOnly = false,
    isInvalid = false,
    leftAdornment,
    rightAdornment,
    maxLength,
    type = 'text',
    value,
    onChange,
    className,
    inputClassName,
    ...props
}: TichTichInputProps) {
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
            type={type}
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

            <div className="relative flex items-center">
                {leftAdornment && (
                    <span className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
                        {leftAdornment}
                    </span>
                )}

                <AriaInput
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={cn(
                        'w-full rounded-xl border bg-white text-sm text-tichtich-black',
                        'placeholder:text-gray-#BFBFBF transition-all duration-200 outline-none',
                        'px-4 py-3.5 text-base',
                        leftAdornment && 'pl-10',
                        rightAdornment && 'pr-11',
                        hasError
                            ? 'border-tichtich-red focus:border-tichtich-red focus:ring-2 focus:ring-tichtich-red/15'
                            : 'border-tichtich-black focus:border-tichtich-primary-200 focus:ring-2 focus:ring-tichtich-primary-200/15',
                        isDisabled &&
                            'bg-gray-50 text-gray-400 cursor-not-allowed',
                        isReadOnly && 'bg-gray-50 cursor-default',
                        inputClassName
                    )}
                />

                {rightAdornment && (
                    <span className="absolute right-3.5 flex items-center">
                        {rightAdornment}
                    </span>
                )}
            </div>

            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    {errorMessage ? (
                        <FieldError className="text-xs text-tichtich-red">
                            {errorMessage}
                        </FieldError>
                    ) : helperText ? (
                        <Text
                            slot="description"
                            className="text-xs text-gray-400"
                        >
                            {helperText}
                        </Text>
                    ) : null}
                </div>
                {maxLength != null && (
                    <span className="shrink-0 text-xs text-gray-400">
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
        </TextField>
    );
}
