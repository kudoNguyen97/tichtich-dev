import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Pencil,
} from 'lucide-react';
import { CalendarDate } from '@internationalized/date';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { TichTichInput } from '@/components/common/TichTichInput';
import { TichTichButton } from '@/components/common/TichTichButton';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useAppLayoutContext } from '@/components/layout/AppLayout';
import { useAdultAppLayoutContext } from '@/routes/_app/adult/-AdultAppLayoutContext';
// import {
//     AdultAppBarLeftAvatarButton,
//     AdultAppBarRightBellButton,
// } from '@/components/adult/AdultAppBarActions';
import { cn } from '@/utils/cn';
import { useNotificationStore } from '@/stores/useNotificationStore';
import type { Profile } from '@/features/auth/types/auth.type';
import {
    useProfileDetail,
    useUpdateProfile,
} from '@/features/profiles/hooks/useProfiles';
import { showError } from '@/lib/toast';
import dayjs from 'dayjs';

export const Route = createFileRoute('/_app/adult/setting/information')({
    component: AdultInformationPage,
});

function isoToCalendarDate(iso: string | undefined): CalendarDate | null {
    if (!iso) return null;
    const d = dayjs(iso);
    if (!d.isValid()) return null;
    return new CalendarDate(d.year(), d.month() + 1, d.date());
}

function calendarDateToIsoDateString(d: CalendarDate): string {
    return dayjs(new Date(d.year, d.month - 1, d.day))
        .startOf('day')
        .format('YYYY-MM-DD');
}

const VN_MOBILE_PHONE = /^0(3|5|7|8|9)\d{8}$/;
// const MIN_ADULT_AGE = 18;
// const MAX_AGE = 120;

// function validateBirthDate(d: CalendarDate | null): string | undefined {
//     if (!d) return 'Vui lòng nhập ngày sinh';
//     const tz = getLocalTimeZone();
//     const t = today(tz);
//     if (d.compare(t) > 0) return 'Ngày sinh không được ở tương lai';
//     const maxBirth = t.subtract({ years: MIN_ADULT_AGE });
//     const minBirth = t.subtract({ years: MAX_AGE });
//     if (d.compare(maxBirth) > 0) {
//         return `Bạn phải từ ${MIN_ADULT_AGE} tuổi trở lên`;
//     }
//     if (d.compare(minBirth) < 0) return 'Ngày sinh không hợp lệ';
//     return undefined;
// }

const calendarDateSchema = z
    .custom<CalendarDate | null>(
        (val) => val === null || val instanceof CalendarDate,
        'Ngày sinh không hợp lệ'
    )
    .refine((val): val is CalendarDate => val !== null, {
        message: 'Vui lòng nhập ngày sinh',
    });
// .superRefine((val, ctx) => {
//     const err = validateBirthDate(val);
//     if (err) {
//         ctx.addIssue({ code: z.ZodIssueCode.custom, message: err });
//     }
// });

const adultInformationSchema = z.object({
    fullName: z
        .string()
        .transform((s) => s.trim())
        .pipe(
            z
                .string()
                .min(1, 'Vui lòng nhập họ và tên')
                .max(120, 'Họ và tên tối đa 120 ký tự')
        ),
    phone: z
        .string()
        .transform((s) => s.replace(/\s/g, ''))
        .pipe(
            z
                .string()
                .min(1, 'Vui lòng nhập số điện thoại')
                .regex(
                    VN_MOBILE_PHONE,
                    'Số điện thoại không hợp lệ (10 số, di động Việt Nam)'
                )
        ),
    gender: z.enum(['male', 'female']),
    birthDate: calendarDateSchema,
});

/** Giá trị form trong UI (có thể chưa chọn ngày sinh) */
type AdultInformationFormInput = {
    fullName: string;
    phone: string;
    gender: 'male' | 'female';
    birthDate: CalendarDate | null;
};

/** Giá trị sau khi submit + zod validate thành công */
type AdultInformationFormSubmitted = z.output<typeof adultInformationSchema>;

function AdultInformationPage() {
    const navigate = useNavigate();
    const { setAppBar } = useAppLayoutContext();
    const { openAccountSheet } = useAdultAppLayoutContext();
    const openAccountSheetRef = useRef(openAccountSheet);
    openAccountSheetRef.current = openAccountSheet;

    const user = useAuthStore((s) => s.user);
    const selectedProfile = useAuthStore((s) => s.selectedProfile);

    const adultProfile = useMemo((): Profile | null => {
        if (!selectedProfile || selectedProfile.profileType !== 'adult')
            return null;
        return selectedProfile;
    }, [selectedProfile]);

    const {
        data: profileDetailData,
        isLoading: isProfileDetailLoading,
        isFetching: isProfileDetailFetching,
    } = useProfileDetail(adultProfile?.id ?? '');
    const isProfileDetailPending =
        Boolean(adultProfile?.id) &&
        (isProfileDetailLoading || isProfileDetailFetching);

    const initialFormData = useMemo(() => {
        if (!user || !adultProfile) return null;
        const profileDetail = profileDetailData as
            | (Profile & { phone?: string; email?: string })
            | undefined;
        return {
            fullName: profileDetail?.fullName ?? user.fullName,
            phone: profileDetail?.phone ?? user.phone,
            gender: profileDetail?.gender ?? adultProfile.gender,
            birthDate: isoToCalendarDate(
                profileDetail?.dateOfBirth ?? adultProfile.dateOfBirth
            ),
            email: profileDetail?.email ?? user.email,
        };
    }, [user, adultProfile, profileDetailData]);

    const { control, handleSubmit, reset, watch, setValue, clearErrors } =
        useForm<
            AdultInformationFormInput,
            unknown,
            AdultInformationFormSubmitted
        >({
            resolver: zodResolver(adultInformationSchema),
            defaultValues: {
                fullName: '',
                phone: '',
                gender: 'male',
                birthDate: null,
            },
        });

    const gender = watch('gender');

    const [isEditing, setIsEditing] = useState(false);
    const [isOpenSelectGender, setIsOpenSelectGender] = useState(false);

    const { mutateAsync: updateProfile, isPending: isSavingProfile } =
        useUpdateProfile();
    const isSaving = isSavingProfile;

    useEffect(() => {
        if (!initialFormData || isEditing) return;
        reset({
            fullName: initialFormData.fullName,
            phone: initialFormData.phone,
            gender: initialFormData.gender,
            birthDate: initialFormData.birthDate,
        });
    }, [initialFormData, isEditing, reset]);

    const resetDraft = useCallback(() => {
        if (!initialFormData) return;
        reset({
            fullName: initialFormData.fullName,
            phone: initialFormData.phone,
            gender: initialFormData.gender,
            birthDate: initialFormData.birthDate,
        });
    }, [initialFormData, reset]);

    useEffect(() => {
        if (!selectedProfile || selectedProfile.profileType !== 'adult') {
            navigate({ to: '/profiles' });
        }
    }, [selectedProfile, navigate]);

    useEffect(() => {
        setAppBar({
            title: 'Thông tin tài khoản',
            subtitle: '',
            leftAction: (
                <Button
                    className="cursor-pointer p-2 -ml-2"
                    onPress={() => navigate({ to: '/adult/settings' })}
                    aria-label="Quay lại"
                >
                    <ArrowLeft className="size-6 text-tichtich-black" />
                </Button>
            ),
            rightAction: null,
            appBarClassName:
                'border-b-2 border-tichtich-primary-200 shadow-none',
        });
    }, [navigate, setAppBar]);

    if (!user || !adultProfile || !initialFormData) {
        return null;
    }

    const fieldLocked = !isEditing;

    const handleCancel = () => {
        resetDraft();
        clearErrors();
        setIsEditing(false);
        setIsOpenSelectGender(false);
    };

    const onSubmit = async (data: AdultInformationFormSubmitted) => {
        try {
            await updateProfile({
                id: adultProfile.id,
                data: {
                    fullName: data.fullName,
                    gender: data.gender,
                    dateOfBirth: calendarDateToIsoDateString(data.birthDate),
                    phone: data.phone,
                },
            });

            useNotificationStore.getState().show({
                title: 'Đã lưu',
                description: 'Thông tin đã được cập nhật.',
                variant: 'success',
            });
            setIsEditing(false);
        } catch (e) {
            showError(e);
        }
    };

    const avatarSrc =
        gender === 'female'
            ? '/images/face-icons/female-adult.png'
            : '/images/face-icons/male-adult.png';

    return (
        <>
            <LoadingTichTich isLoading={isProfileDetailPending} />
            <div className="flex min-h-full flex-col px-4 pt-2">
                <div className="flex flex-col gap-6">
                    <section className="rounded-2xl border border-tichtich-black bg-white p-4 shadow-sm">
                        <div className="mb-6 flex flex-col items-center gap-4">
                            <div className="relative">
                                <div
                                    className={cn(
                                        'flex size-28 items-center justify-center overflow-hidden rounded-2xl',
                                        gender === 'male'
                                            ? 'bg-tichtich-primary-100'
                                            : 'bg-tichtich-primary-200'
                                    )}
                                >
                                    <img
                                        src={avatarSrc}
                                        alt=""
                                        className="size-[90%] object-contain"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={cn(
                                        'absolute -bottom-1 -right-1 flex size-9 items-center justify-center',
                                        'rounded-full bg-white shadow-md ring-1 ring-black/10',
                                        'transition hover:bg-gray-50',
                                        !isEditing &&
                                            'pointer-events-none opacity-60'
                                    )}
                                    aria-label="Đổi ảnh đại diện"
                                    onClick={() => {
                                        setIsOpenSelectGender(true);
                                    }}
                                >
                                    <Pencil className="size-4 text-tichtich-black" />
                                </button>
                            </div>

                            {isOpenSelectGender && (
                                <div className="flex gap-4">
                                    {(['male', 'female'] as const).map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            disabled={fieldLocked}
                                            onClick={() => {
                                                setValue('gender', g);
                                                setIsOpenSelectGender(false);
                                            }}
                                            className={cn(
                                                'flex size-20 cursor-pointer items-center justify-center rounded-full transition border-2 border-tichtich-primary-100',
                                                g === 'male'
                                                    ? 'bg-tichtich-primary-100'
                                                    : 'bg-tichtich-primary-200',
                                                fieldLocked &&
                                                    'cursor-default opacity-90'
                                            )}
                                            aria-label={
                                                g === 'male' ? 'Nam' : 'Nữ'
                                            }
                                        >
                                            <img
                                                src={
                                                    g === 'male'
                                                        ? '/images/face-icons/male-adult.png'
                                                        : '/images/face-icons/female-adult.png'
                                                }
                                                alt=""
                                                className="size-12 object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TichTichInput
                                        label="Họ và tên"
                                        isRequired
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        isDisabled={fieldLocked}
                                        placeholder="Họ và tên"
                                        isInvalid={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                    />
                                )}
                            />
                            <I18nProvider locale="vi-VN">
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <DatePicker
                                            value={field.value}
                                            onChange={(v) => field.onChange(v)}
                                            isDisabled={fieldLocked}
                                            isRequired
                                            isInvalid={!!fieldState.error}
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
                                                        : 'border-tichtich-black focus-within:border-tichtich-primary-200 focus-within:ring-2 focus-within:ring-tichtich-primary-200/15',
                                                    fieldLocked &&
                                                        'cursor-not-allowed bg-gray-50'
                                                )}
                                            >
                                                <DateInput
                                                    className={cn(
                                                        'flex min-w-0 flex-1 flex-wrap items-center gap-0.5 px-4 py-3.5 text-base',
                                                        fieldLocked &&
                                                            'cursor-not-allowed text-gray-400'
                                                    )}
                                                >
                                                    {(segment) => (
                                                        <DateSegment
                                                            segment={segment}
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
                                                <Button
                                                    className={cn(
                                                        'flex shrink-0 items-center justify-center border-l border-tichtich-black/10 px-3.5 outline-none',
                                                        fieldState.error
                                                            ? 'border-tichtich-red bg-white'
                                                            : 'bg-white',
                                                        fieldLocked &&
                                                            'cursor-not-allowed'
                                                    )}
                                                >
                                                    <CalendarIcon
                                                        className="size-5 text-tichtich-primary-200"
                                                        aria-hidden
                                                    />
                                                </Button>
                                            </Group>
                                            {fieldState.error ? (
                                                <FieldError className="text-xs text-tichtich-red">
                                                    {fieldState.error.message}
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
                                                                    date={date}
                                                                    className={({
                                                                        isSelected,
                                                                        isFocused,
                                                                        isDisabled,
                                                                    }) =>
                                                                        cn(
                                                                            'flex size-9 items-center  justify-center rounded-lg text-sm outline-none',
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
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TichTichInput
                                        label="Số điện thoại"
                                        isRequired
                                        type="tel"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        isDisabled={fieldLocked}
                                        placeholder="Nhập số điện thoại"
                                        isInvalid={fieldState.invalid}
                                        errorMessage={fieldState.error?.message}
                                    />
                                )}
                            />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-tichtich-black bg-white p-4 shadow-sm">
                        <h2 className="mb-4 text-xs font-bold text-tichtich-black">
                            Thông tin đăng nhập
                        </h2>
                        <TichTichInput
                            label="Email"
                            type="email"
                            value={initialFormData.email}
                            isDisabled
                        />
                    </section>
                </div>

                <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[720px] mx-auto border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    {!isEditing ? (
                        <TichTichButton
                            variant="outline"
                            size="lg"
                            fullWidth
                            onPress={() => {
                                clearErrors();
                                setIsEditing(true);
                            }}
                        >
                            Chỉnh sửa
                        </TichTichButton>
                    ) : (
                        <div className="flex gap-3">
                            <TichTichButton
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                onPress={handleCancel}
                                isDisabled={isSaving}
                            >
                                Hủy
                            </TichTichButton>
                            <TichTichButton
                                variant="primary"
                                size="lg"
                                className="flex-1"
                                onPress={() => void handleSubmit(onSubmit)()}
                                isLoading={isSaving}
                            >
                                Lưu
                            </TichTichButton>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
