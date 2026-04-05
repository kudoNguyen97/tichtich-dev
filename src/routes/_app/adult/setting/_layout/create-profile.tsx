import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDate } from '@internationalized/date';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    MinusCircle,
    Plus,
} from 'lucide-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { I18nProvider } from 'react-aria';
import {
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    DateInput,
    DatePicker,
    DateSegment,
    Dialog,
    FieldError,
    Group,
    Heading,
    Label,
    Popover,
} from 'react-aria-components';
import { z } from 'zod';

import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { AppBar } from '@/components/layout/AppBar';
import { cn } from '@/utils/cn';
import { useCreateProfile } from '@/features/profiles/hooks/useProfiles';
import dayjs from 'dayjs';

export const Route = createFileRoute(
    '/_app/adult/setting/_layout/create-profile'
)({
    component: RouteComponent,
});

const calendarDateSchema = z
    .custom<CalendarDate | null>(
        (val) => val === null || val instanceof CalendarDate,
        'Ngày sinh không hợp lệ'
    )
    .refine((val): val is CalendarDate => val !== null, {
        message: 'Vui lòng nhập ngày sinh',
    });

const childProfileSchema = z.object({
    fullName: z
        .string()
        .transform((s) => s.trim())
        .pipe(
            z
                .string()
                .min(1, 'Vui lòng nhập họ và tên bé')
                .max(120, 'Họ và tên tối đa 120 ký tự')
        ),
    birthDate: calendarDateSchema,
    gender: z
        .enum(['male', 'female'])
        .nullable()
        .refine((value): value is 'male' | 'female' => value !== null, {
            message: 'Vui lòng chọn giới tính',
        }),
});

const createProfileSchema = z.object({
    children: z
        .array(childProfileSchema)
        .min(1, 'Cần ít nhất một hồ sơ bé để tiếp tục'),
});

type ChildGender = 'male' | 'female' | null;

type CreateProfileFormInput = {
    children: Array<{
        fullName: string;
        birthDate: CalendarDate | null;
        gender: ChildGender;
    }>;
};

const defaultChild: CreateProfileFormInput['children'][number] = {
    fullName: '',
    birthDate: null,
    gender: null,
};

function getChildCardTheme(gender: ChildGender): {
    cardBg: string;
    iconSrc: string;
    iconAlt: string;
} {
    if (gender === 'male') {
        return {
            cardBg: 'bg-tichtich-blue',
            iconSrc: '/pig-full-body-male.svg',
            iconAlt: 'Heo bé trai',
        };
    }
    if (gender === 'female') {
        return {
            cardBg: 'bg-tichtich-pink',
            iconSrc: '/pig-full-body-female.svg',
            iconAlt: 'Heo bé gái',
        };
    }
    return {
        cardBg: 'bg-white',
        iconSrc: '/pig-full-body.svg',
        iconAlt: 'Heo mặc định',
    };
}

function RouteComponent() {
    const navigate = useNavigate();
    const { mutate: createProfileMutation } = useCreateProfile();

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CreateProfileFormInput>({
        resolver: zodResolver(createProfileSchema),
        mode: 'onChange',
        defaultValues: {
            children: [defaultChild],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'children',
    });

    const childrenValues = watch('children');
    const canSubmit = isValid && fields.length > 0 && !isSubmitting;

    const onSubmit = (data: CreateProfileFormInput) => {
        createProfileMutation(
            data.children.map((child) => ({
                fullName: child.fullName,
                birthDate: dayjs(child.birthDate?.toString()).format(
                    'YYYY-MM-DD'
                ),
                profileType: 'kid',
                gender: child.gender ?? undefined,
            }))
        );
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#f6f6f6]">
            <AppBar
                title="Tạo tài khoản cho con"
                subtitle=""
                leftAction={
                    <Button
                        onPress={() => navigate({ to: '/adult/settings' })}
                        className="-ml-2 cursor-pointer p-2"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </Button>
                }
                rightAction={null}
                className="bg-[#f6f6f6] shadow-none"
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-1 flex-col px-4 pb-28 pt-4"
            >
                <div className="flex flex-1 flex-col gap-4">
                    {fields.map((field, index) => {
                        const gender = childrenValues[index]?.gender ?? null;
                        const theme = getChildCardTheme(gender);
                        const fieldError = errors.children?.[index];

                        return (
                            <section
                                key={field.id}
                                className={cn(
                                    'rounded-2xl border border-black/10 p-4 shadow-[0_1px_6px_rgba(0,0,0,0.08)]',
                                    theme.cardBg
                                )}
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <button
                                        type="button"
                                        className={cn(
                                            'inline-flex size-7 items-center justify-center rounded-full text-red-500 transition-colors',
                                            index === 0 &&
                                                'pointer-events-none opacity-0'
                                        )}
                                        onClick={() => remove(index)}
                                        aria-label={`Xóa hồ sơ bé ${index + 1}`}
                                        disabled={index === 0}
                                    >
                                        <MinusCircle className="size-6 fill-red-500 text-white" />
                                    </button>
                                    <img
                                        src={theme.iconSrc}
                                        alt={theme.iconAlt}
                                        className="size-28 object-contain"
                                    />
                                    <div className="size-7" aria-hidden />
                                </div>

                                <div className="space-y-3.5">
                                    <Controller
                                        name={`children.${index}.fullName`}
                                        control={control}
                                        render={({ field: nameField }) => (
                                            <TichTichInput
                                                label="Họ và Tên"
                                                isRequired
                                                placeholder="Họ và Tên bé"
                                                value={nameField.value}
                                                onChange={nameField.onChange}
                                                onBlur={nameField.onBlur}
                                                isInvalid={Boolean(
                                                    fieldError?.fullName
                                                )}
                                                errorMessage={
                                                    fieldError?.fullName
                                                        ?.message
                                                }
                                            />
                                        )}
                                    />

                                    <I18nProvider locale="vi-VN">
                                        <Controller
                                            name={`children.${index}.birthDate`}
                                            control={control}
                                            render={({
                                                field: dateField,
                                                fieldState,
                                            }) => (
                                                <DatePicker
                                                    value={dateField.value}
                                                    onChange={(v) =>
                                                        dateField.onChange(v)
                                                    }
                                                    isRequired
                                                    isInvalid={
                                                        !!fieldState.error
                                                    }
                                                    granularity="day"
                                                    className="flex flex-col gap-1.5"
                                                >
                                                    <Label className="text-base font-bold text-tichtich-black">
                                                        Ngày sinh
                                                        <span
                                                            className="ml-0.5 text-tichtich-red"
                                                            aria-hidden
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Group
                                                        className={cn(
                                                            'flex w-full min-w-0 flex-row items-stretch overflow-hidden rounded-xl border bg-white transition-shadow outline-none',
                                                            fieldState.error
                                                                ? 'border-tichtich-red focus-within:border-tichtich-red focus-within:ring-2 focus-within:ring-tichtich-red/15'
                                                                : 'border-tichtich-black focus-within:border-tichtich-primary-200 focus-within:ring-2 focus-within:ring-tichtich-primary-200/15'
                                                        )}
                                                    >
                                                        <DateInput className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5 px-4 py-3.5 text-base">
                                                            {(segment) => (
                                                                <DateSegment
                                                                    segment={
                                                                        segment
                                                                    }
                                                                    className={({
                                                                        isPlaceholder,
                                                                        type,
                                                                    }) =>
                                                                        cn(
                                                                            'rounded px-0.5 text-tichtich-black outline-none',
                                                                            type ===
                                                                                'literal' &&
                                                                                'text-gray-400',
                                                                            isPlaceholder &&
                                                                                'text-gray-400'
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </DateInput>
                                                        <Button className="flex shrink-0 items-center justify-center border-l border-tichtich-black/10 bg-white px-3.5 outline-none">
                                                            <CalendarIcon
                                                                className="size-5 text-tichtich-primary-200"
                                                                aria-hidden
                                                            />
                                                        </Button>
                                                    </Group>
                                                    {fieldState.error ? (
                                                        <FieldError className="text-xs text-tichtich-red">
                                                            {
                                                                fieldState.error
                                                                    .message
                                                            }
                                                        </FieldError>
                                                    ) : null}
                                                    <Popover
                                                        className="rounded-2xl border border-gray-200 bg-white p-2 shadow-lg outline-none"
                                                        offset={8}
                                                    >
                                                        <Dialog className="outline-none">
                                                            <Calendar className="min-w-[280px]">
                                                                <div className="mb-2 flex items-center justify-between gap-2 px-1">
                                                                    <Button
                                                                        slot="previous"
                                                                        className="flex size-9 items-center justify-center rounded-lg text-tichtich-black outline-none hover:bg-gray-100"
                                                                    >
                                                                        <ChevronLeft
                                                                            className="size-5"
                                                                            aria-hidden
                                                                        />
                                                                    </Button>
                                                                    <Heading className="flex-1 text-center text-sm font-semibold capitalize" />
                                                                    <Button
                                                                        slot="next"
                                                                        className="flex size-9 items-center justify-center rounded-lg text-tichtich-black outline-none hover:bg-gray-100"
                                                                    >
                                                                        <ChevronRight
                                                                            className="size-5"
                                                                            aria-hidden
                                                                        />
                                                                    </Button>
                                                                </div>
                                                                <CalendarGrid weekdayStyle="short">
                                                                    {(date) => (
                                                                        <CalendarCell
                                                                            date={
                                                                                date
                                                                            }
                                                                            className={({
                                                                                isSelected,
                                                                                isFocused,
                                                                                isDisabled,
                                                                            }) =>
                                                                                cn(
                                                                                    'flex size-9 items-center justify-center rounded-lg text-sm outline-none',
                                                                                    isDisabled &&
                                                                                        'cursor-default opacity-40',
                                                                                    isSelected &&
                                                                                        'bg-tichtich-primary-200 font-semibold text-white',
                                                                                    !isSelected &&
                                                                                        !isDisabled &&
                                                                                        'hover:bg-gray-100',
                                                                                    isFocused &&
                                                                                        !isSelected &&
                                                                                        'ring-2 ring-tichtich-primary-200/15'
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                </CalendarGrid>
                                                            </Calendar>
                                                        </Dialog>
                                                    </Popover>
                                                </DatePicker>
                                            )}
                                        />
                                    </I18nProvider>

                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-base font-bold text-tichtich-black">
                                            Giới tính
                                            <span
                                                className="ml-0.5 text-tichtich-red"
                                                aria-hidden
                                            >
                                                *
                                            </span>
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setValue(
                                                        `children.${index}.gender`,
                                                        'male',
                                                        {
                                                            shouldDirty: true,
                                                            shouldTouch: true,
                                                        }
                                                    );
                                                    await trigger(
                                                        `children.${index}.gender`
                                                    );
                                                }}
                                                className={cn(
                                                    'relative h-14 overflow-hidden rounded-xl border px-4 text-left text-lg transition-colors cursor-pointer',
                                                    gender === 'male'
                                                        ? 'border-tichtich-black bg-tichtich-blue'
                                                        : 'border-tichtich-black bg-black/25'
                                                )}
                                            >
                                                Nam
                                                <img
                                                    src="/images/pig-boy-kid.png"
                                                    alt=""
                                                    aria-hidden
                                                    className="pointer-events-none absolute -bottom-1 right-1 h-13 w-auto object-contain"
                                                />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setValue(
                                                        `children.${index}.gender`,
                                                        'female',
                                                        {
                                                            shouldDirty: true,
                                                            shouldTouch: true,
                                                        }
                                                    );
                                                    await trigger(
                                                        `children.${index}.gender`
                                                    );
                                                }}
                                                className={cn(
                                                    'relative h-14 overflow-hidden rounded-xl border px-4 text-left text-lg transition-colors cursor-pointer',
                                                    gender === 'female'
                                                        ? 'border-tichtich-black bg-tichtich-pink'
                                                        : 'border-tichtich-black bg-black/25'
                                                )}
                                            >
                                                Nữ
                                                <img
                                                    src="/images/pig-gird-kid.png"
                                                    alt=""
                                                    aria-hidden
                                                    className="pointer-events-none absolute -bottom-1 right-1 h-13 w-auto object-contain"
                                                />
                                            </button>
                                        </div>
                                        {fieldError?.gender?.message ? (
                                            <p className="text-xs text-tichtich-red">
                                                {fieldError.gender.message}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </section>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => append(defaultChild)}
                        className="flex h-14 items-center justify-center gap-2 rounded-xl border border-dashed border-tichtich-primary-200 bg-white/70 text-lg font-semibold text-tichtich-primary-200"
                    >
                        <Plus className="size-5" />
                        Thêm con
                    </button>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-[720px] border-t border-gray-200/80 bg-[#f6f6f6] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <TichTichButton
                        type="submit"
                        variant={canSubmit ? 'primary' : 'disabled'}
                        size="lg"
                        fullWidth
                        isDisabled={!canSubmit}
                    >
                        Tiếp tục
                    </TichTichButton>
                </div>
            </form>
        </div>
    );
}
