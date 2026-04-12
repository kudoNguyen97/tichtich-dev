import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import WalletSelector from '@/components/adult/missions/WalletSelector';
import { TargetMissionConfirmModal } from '@/components/adult/missions/TargetMissionConfirmModal';
import { goalSchema } from '@/components/adult/missions/targetGoalFormSchema';
import type { GoalFormData } from '@/components/adult/missions/targetGoalFormSchema';
import { formWalletIdToWalletType } from '@/components/adult/missions/walletOptions';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichModal } from '@/components/common/TichTichModal';
import { MoneyAmountField } from '@/components/common/MoneyAmountField';
import { formatVndAmount } from '@/components/adult/reward/rewardFormat';
import { useCreateMission } from '@/features/missions/hooks/useMissions';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { showError } from '@/lib/toast';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { cn } from '@/utils/cn';
import {
    getTodayCalendarDate,
    isoDateStringToCalendarDate,
    minEndDateAfterStart,
} from '@/utils/targetGoalDates';
import { calendarYmdToMissionUtcBounds } from '@/utils/missionDatePayload';
import { MissionDatePickerDialog } from '@/components/adult/missions/MissionDatePickerDialog';

const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const day = days[d.getDay()];
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()} (${day})`;
};

const getDaysBetween = (start: string, end: string) => {
    if (!start || !end) return 0;
    const a = dayjs(start, 'YYYY-MM-DD');
    const b = dayjs(end, 'YYYY-MM-DD');
    if (!a.isValid() || !b.isValid()) return 0;
    return Math.max(0, b.diff(a, 'day'));
};

function firstFormErrorMessage(errors: FieldErrors<GoalFormData>): string {
    const keys: (keyof GoalFormData)[] = [
        'name',
        'message',
        'amount',
        'wallet',
        'startDate',
        'endDate',
    ];
    for (const key of keys) {
        const e = errors[key];
        if (e && typeof e === 'object' && 'message' in e) {
            const m = (e as { message?: string }).message;
            if (typeof m === 'string' && m.length > 0) return m;
        }
    }
    return 'Vui lòng kiểm tra lại thông tin.';
}

/** Gợi ý: chữ số đã gõ × 1.000 và × 10.000 (giống màn thưởng), trong khoảng hợp lệ. */
const MAX_TARGET_AMOUNT = 10_000_000;

function getTargetAmountSuggestions(typedDigits: string): number[] {
    const n = parseInt(typedDigits, 10);
    if (!n || isNaN(n)) return [];
    const candidates = [n * 1_000, n * 10_000];
    return candidates.filter((v) => v >= 1 && v <= MAX_TARGET_AMOUNT);
}

const MissionForm = () => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        clearErrors,
        watch,
        reset,
        formState: { errors },
    } = useForm<GoalFormData>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: '',
            message: '',
            amount: undefined,
            wallet: '',
            startDate: '',
            endDate: '',
        },
    });

    const [amountDisplay, setAmountDisplay] = useState('');
    const [typedDigits, setTypedDigits] = useState('');
    const [currentAmount, setCurrentAmount] = useState<number | undefined>(
        undefined
    );
    const [suggestionTagsDismissed, setSuggestionTagsDismissed] =
        useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState<
        null | 'start' | 'end'
    >(null);
    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
        null
    );
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<GoalFormData | null>(null);

    const createMission = useCreateMission();
    const navigate = useNavigate();
    const messageVal = watch('message') || '';
    const nameVal = watch('name') || '';
    const startDate = watch('startDate') || '';
    const endDate = watch('endDate') || '';
    const daysBetween = getDaysBetween(startDate, endDate);

    const onSubmit = (data: GoalFormData) => {
        setSubmitErrorMessage(null);
        setPendingData(data);
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
        setPendingData(null);
    };

    const handleConfirmCreate = async () => {
        if (!pendingData) return;

        const profileId = useAuthStore.getState().managedKidProfileId;
        if (!profileId) {
            showError('Không tìm thấy trẻ để gán mục tiêu.');
            return;
        }

        const walletType = formWalletIdToWalletType(pendingData.wallet);
        if (!walletType) {
            showError('Ví không hợp lệ.');
            return;
        }

        const { startDay, endDay } = calendarYmdToMissionUtcBounds(
            pendingData.startDate,
            pendingData.endDate
        );

        try {
            await createMission.mutateAsync({
                profileId,
                title: pendingData.name,
                targetAmount: pendingData.amount,
                walletType,
                startDay,
                endDay,
            });
            useNotificationStore.getState().show({
                title: 'Đã tạo mục tiêu',
                variant: 'success',
            });
            setConfirmOpen(false);
            setPendingData(null);
            reset();
            setAmountDisplay('');
            setTypedDigits('');
            setCurrentAmount(undefined);
            setSuggestionTagsDismissed(false);
            navigate({ to: '/adult/mission-success' });
        } catch {
            /* lỗi đã xử lý trong useCreateMission */
        }
    };

    const onInvalid = (formErrors: FieldErrors<GoalFormData>) => {
        setSubmitErrorMessage(firstFormErrorMessage(formErrors));
    };

    const startCal = isoDateStringToCalendarDate(startDate);

    const pickerValue =
        datePickerTarget === 'start'
            ? startDate
            : datePickerTarget === 'end'
              ? endDate
              : '';

    const pickerMin =
        datePickerTarget === 'start'
            ? getTodayCalendarDate()
            : datePickerTarget === 'end' && startCal
              ? minEndDateAfterStart(startCal)
              : getTodayCalendarDate().add({ days: 1 });

    const handleDateSelect = (iso: string) => {
        if (datePickerTarget === 'start') {
            setValue('startDate', iso, {
                shouldValidate: true,
                shouldDirty: true,
            });
            const endIso = getValues('endDate');
            if (endIso) {
                const s = isoDateStringToCalendarDate(iso);
                const e = isoDateStringToCalendarDate(endIso);
                if (s && e && e.compare(s) <= 0) {
                    setValue('endDate', '', {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                }
            }
        } else if (datePickerTarget === 'end') {
            setValue('endDate', iso, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const handleAmountChange = (val: string) => {
        setSuggestionTagsDismissed(false);
        const digits = val.replace(/\D/g, '');
        const num = digits ? parseInt(digits, 10) : NaN;
        setTypedDigits(digits);
        setCurrentAmount(isNaN(num) ? undefined : num);
        setAmountDisplay(isNaN(num) ? '' : formatVndAmount(num));
        if (isNaN(num)) {
            setValue('amount', undefined as unknown as number, {
                shouldValidate: false,
                shouldDirty: true,
            });
            clearErrors('amount');
        } else {
            setValue('amount', num, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    const pickSuggestion = (amount: number) => {
        setAmountDisplay(formatVndAmount(amount));
        setTypedDigits(String(amount / 1000));
        setCurrentAmount(amount);
        setValue('amount', amount, { shouldValidate: true, shouldDirty: true });
        setSuggestionTagsDismissed(true);
    };

    const suggestions = getTargetAmountSuggestions(typedDigits);
    const amountFieldError =
        typedDigits.length > 0 ? errors.amount?.message : undefined;

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className=""
            noValidate
        >
            <div className="space-y-5 p-4 rounded-lg bg-tichtich-primary-300  mb-4">
                {/* Tên mục tiêu */}
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-tichtich-black">
                        Tên mục tiêu mới <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('name')}
                        placeholder="Nhập tên mục tiêu"
                        maxLength={100}
                        rows={3}
                        className={[
                            'w-full rounded-lg border border-tichtich-black bg-white mt-2',
                            'px-4 py-3 text-sm text-gray-700 resize-none',
                            'outline-none transition-colors placeholder:text-gray-300',
                            'focus:ring-1 focus:ring-tichtich-primary-200',
                            errors.name
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-amber-300 hover:border-amber-400 focus:border-orange-400',
                        ].join(' ')}
                    />
                    <div className="flex justify-between">
                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                        <span className="text-xs text-gray-500">
                            {nameVal.length}/100
                        </span>
                    </div>
                </div>

                {/* Lời nhắn */}
                <div className="space-y-1.5">
                    <label className="text-base font-semibold text-tichtich-black">
                        Lời nhắn cho con <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('message')}
                        placeholder="Ghi chú thêm cho con"
                        maxLength={150}
                        rows={3}
                        className={[
                            'w-full rounded-lg border border-tichtich-black bg-white mt-2',
                            'px-4 py-3 text-sm text-gray-700 resize-none',
                            'outline-none transition-colors placeholder:text-gray-300',
                            'focus:ring-1 focus:ring-tichtich-primary-200',
                            errors.message
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-amber-300 hover:border-amber-400 focus:border-orange-400',
                        ].join(' ')}
                    />
                    <div className="flex justify-between">
                        <p className="text-xs text-muted-foreground">
                            {messageVal.length}/150
                        </p>
                        {errors.message && (
                            <p className="text-xs text-destructive">
                                {errors.message.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Số tiền */}
                <Controller
                    name="amount"
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <MoneyAmountField
                            label="Số tiền cần tích"
                            isRequired
                            value={amountDisplay}
                            onChange={handleAmountChange}
                            onBlur={onBlur}
                            error={amountFieldError}
                            suggestions={
                                suggestionTagsDismissed ? [] : suggestions
                            }
                            selectedAmount={currentAmount}
                            onPickSuggestion={pickSuggestion}
                            placeholder="0"
                        />
                    )}
                />

                {/* Ví */}
                <Controller
                    name="wallet"
                    control={control}
                    render={({ field }) => (
                        <WalletSelector
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.wallet?.message}
                        />
                    )}
                />

                {/* Thời gian */}
                <div className="space-y-2">
                    <label className="text-base font-semibold text-tichtich-black">
                        Thời gian <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-stretch gap-3 mt-2">
                        <div className="flex-1 space-y-1">
                            <button
                                type="button"
                                onClick={() => setDatePickerTarget('start')}
                                aria-haspopup="dialog"
                                aria-expanded={datePickerTarget === 'start'}
                                className={cn(
                                    'w-full rounded-xl border bg-white px-4 py-3 text-left cursor-pointer',
                                    'outline-none transition-colors focus:ring-2 focus:ring-tichtich-primary-200',
                                    errors.startDate
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-tichtich-black hover:border-amber-400'
                                )}
                            >
                                <span className="block text-sm text-gray-500">
                                    Ngày bắt đầu
                                </span>
                                <span className="mt-0.5 block text-sm font-bold text-tichtich-black">
                                    {startDate
                                        ? formatDateLabel(startDate)
                                        : 'Chọn ngày'}
                                </span>
                            </button>
                            {errors.startDate && (
                                <p className="text-xs text-destructive">
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>

                        {daysBetween > 0 && (
                            <span className="flex shrink-0 items-center self-center text-sm font-semibold text-tichtich-primary-200">
                                {daysBetween} ngày
                            </span>
                        )}

                        <div className="flex-1 space-y-1">
                            <button
                                type="button"
                                disabled={!startDate}
                                onClick={() =>
                                    startDate && setDatePickerTarget('end')
                                }
                                aria-haspopup="dialog"
                                aria-expanded={datePickerTarget === 'end'}
                                className={cn(
                                    'w-full rounded-xl border bg-white px-4 py-3 text-left cursor-pointer',
                                    'outline-none transition-colors focus:ring-2 focus:ring-tichtich-primary-200',
                                    !startDate &&
                                        'cursor-not-allowed opacity-50',
                                    errors.endDate
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-tichtich-black hover:border-amber-400',
                                    !startDate && 'hover:border-tichtich-black'
                                )}
                            >
                                <span className="block text-xs text-gray-500">
                                    Ngày kết thúc
                                </span>
                                <span className="mt-0.5 block text-sm font-bold text-tichtich-black">
                                    {endDate
                                        ? formatDateLabel(endDate)
                                        : 'Chọn ngày'}
                                </span>
                            </button>
                            {errors.endDate && (
                                <p className="text-xs text-destructive">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <TichTichButton
                type="submit"
                className="w-full py-3.5 rounded-xl bg-tichtich-primary-200 text-white font-semibold text-sm transition-colors  cursor-pointer"
            >
                Tạo mục tiêu
            </TichTichButton>

            <MissionDatePickerDialog
                isOpen={datePickerTarget !== null}
                onClose={() => setDatePickerTarget(null)}
                resetKey={datePickerTarget ?? 'closed'}
                value={pickerValue}
                minValue={pickerMin}
                onSelect={handleDateSelect}
            />

            <TichTichModal
                isOpen={submitErrorMessage !== null}
                onClose={() => setSubmitErrorMessage(null)}
                title="Thông tin chưa hợp lệ"
                size="sm"
                footer={
                    <TichTichButton
                        type="button"
                        className="w-full"
                        onPress={() => setSubmitErrorMessage(null)}
                    >
                        Đóng
                    </TichTichButton>
                }
            >
                <p className="text-center text-sm text-tichtich-black">
                    {submitErrorMessage}
                </p>
            </TichTichModal>

            <TargetMissionConfirmModal
                isOpen={confirmOpen && pendingData !== null}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmCreate}
                isPending={createMission.isPending}
                data={pendingData}
            />
        </form>
    );
};

export default MissionForm;
