import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTextField } from '@react-aria/textfield';
import dayjs from 'dayjs';
import { TichTichButton } from '@/components/common/TichTichButton';
import { MoneyAmountField } from '@/components/common/MoneyAmountField';
import { RewardSummaryModal } from '@/components/adult/reward/RewardSummaryModal';
import { formatVndAmount } from '@/components/adult/reward/rewardFormat';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useCreateProfileTransaction } from '@/features/profile-transactions/hooks/useProfileTransactions';
import { showError } from '@/lib/toast';

// ─── Constants ──────────────────────────────────────────────────────────────
const MAX_AMOUNT = 10_000_000;
const MIN_AMOUNT = 1_000;
const MAX_MSG_LEN = 100;

// ─── Zod schema ─────────────────────────────────────────────────────────────
const schema = z.object({
    amount: z
        .number({
            error: 'Vui lòng nhập số tiền thưởng hợp lệ.',
        })
        .min(MIN_AMOUNT, `Số tiền tối thiểu là ${formatVndAmount(MIN_AMOUNT)}đ.`)
        .refine(
            (v) => v % 1000 === 0,
            'Số tiền phải tròn nghìn (ví dụ: 1.000đ).'
        ),

    message: z
        .string()
        .min(1, 'Vui lòng nhập lời nhắn cho con.')
        .max(MAX_MSG_LEN, `Lời nhắn không được vượt quá ${MAX_MSG_LEN} ký tự.`),
});

type RewardFormValues = z.infer<typeof schema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate suggestion tags based on the raw digits the user typed.
 * Strategy: typed digits × 1,000 and × 10,000, capped at MAX_AMOUNT.
 */
function getSuggestions(typedDigits: string) {
    const n = parseInt(typedDigits, 10);
    if (!n || isNaN(n)) return [];
    const candidates = [n * 1_000, n * 10_000];
    return candidates.filter((v) => v >= MIN_AMOUNT && v <= MAX_AMOUNT);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// ─── MessageField ─────────────────────────────────────────────────────────────
function MessageField({ value, onChange, onBlur, error }: any) {
    const ref = useRef(null);
    const { labelProps, inputProps, errorMessageProps } = useTextField(
        {
            label: 'Lời nhắn cho con',
            isRequired: true,
            inputElementType: 'textarea',
            value,
            onChange,
            onBlur,
            validationState: error ? 'invalid' : 'valid',
        },
        ref
    );

    const len = value?.length ?? 0;

    return (
        <div className="mb-5">
            <label
                {...labelProps}
                className="flex items-center gap-1 text-sm font-bold text-gray-700 mb-2"
            >
                Lời nhắn cho con <span className="text-red-500">*</span>
            </label>

            <textarea
                {...inputProps}
                ref={ref}
                rows={4}
                placeholder="Con đã đạt điểm mười môn toán!"
                className={[
                    'w-full rounded-xl border bg-white',
                    'px-4 py-3 text-sm text-gray-700 resize-none',
                    'outline-none transition-colors placeholder:text-gray-300',
                    'focus:ring-2 focus:ring-orange-300',
                    error
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-amber-300 hover:border-amber-400 focus:border-orange-400',
                ].join(' ')}
            />

            <div className="flex items-center justify-between mt-1">
                <p
                    {...errorMessageProps}
                    role="alert"
                    className="text-xs text-red-500 min-h-[16px]"
                >
                    {error}
                </p>
                <span
                    aria-live="polite"
                    className={`text-xs tabular-nums ${len > MAX_MSG_LEN ? 'text-red-500 font-semibold' : 'text-gray-400'}`}
                >
                    {len}/{MAX_MSG_LEN}
                </span>
            </div>
        </div>
    );
}

export const Route = createLazyFileRoute('/_app/adult/_layout/reward')({
    component: RouteComponent,
});

function RouteComponent() {
    const [displayValue, setDisplayValue] = useState('');
    const [typedDigits, setTypedDigits] = useState('');
    const [currentAmount, setCurrentAmount] = useState<number | undefined>(
        undefined
    );
    const [suggestionTagsDismissed, setSuggestionTagsDismissed] =
        useState(false);
    const [rewardSummary, setRewardSummary] = useState<{
        amount: number;
        dateFormatted: string;
    } | null>(null);

    const profiles = useAuthStore((s) => s.profiles);
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const navigate = useNavigate();
    const {
        mutateAsync: createProfileTransaction,
        isPending: isSendingReward,
    } = useCreateProfileTransaction();

    const {
        control,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { amount: undefined, message: '' },
        mode: 'onTouched',
    });

    const formValues = watch();
    const canSubmit = schema.safeParse(formValues).success;

    const handleAmountChange = (val: any) => {
        setSuggestionTagsDismissed(false);
        const digits = val.replace(/\D/g, '');
        const num = digits ? parseInt(digits, 10) : NaN;
        setTypedDigits(digits);
        setCurrentAmount(isNaN(num) ? undefined : num);
        setDisplayValue(isNaN(num) ? '' : formatVndAmount(num));
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

    const pickSuggestion = (amount: any) => {
        setDisplayValue(formatVndAmount(amount));
        setTypedDigits(String(amount / 1000));
        setCurrentAmount(amount);
        setValue('amount', amount, { shouldValidate: true, shouldDirty: true });
        setSuggestionTagsDismissed(true);
    };

    const onValid = (data: RewardFormValues) => {
        setRewardSummary({
            amount: data.amount,
            dateFormatted: dayjs().format('DD/MM/YYYY'),
        });
    };

    const handleSendReward = async () => {
        if (!rewardSummary) return;

        const fromProfileId =
            selectedProfile?.profileType === 'adult'
                ? selectedProfile.id
                : profiles.find((p) => p.profileType === 'adult')?.id;

        const toProfileId =
            managedKidProfileId ??
            profiles.find((p) => p.profileType === 'kid')?.id ??
            null;

        if (!fromProfileId || !toProfileId) {
            showError('Không tìm thấy phụ huynh hoặc trẻ để gửi thưởng.');
            return;
        }

        const tx = await createProfileTransaction({
            fromProfileId,
            toProfileId,
            amount: rewardSummary.amount,
            note: formValues.message,
        });

        const childName =
            tx.receiver.fullName ||
            profiles.find((p) => p.id === toProfileId)?.fullName ||
            'Con';

        navigate({
            to: '/adult/reward-success',
            search: {
                amount: tx.amount,
                childName,
                date: dayjs(tx.createdAt).format('DD/MM/YYYY'),
            },
            replace: true,
        });

        setRewardSummary(null);
    };

    const suggestions = getSuggestions(typedDigits);
    const amountFieldError =
        typedDigits.length > 0 ? errors.amount?.message : undefined;

    return (
        <div className="flex flex-col items-center justify-center px-4">
            <div className="w-full h-[300px]">
                <img
                    className="w-full h-full object-contain"
                    src="/images/reward-adult/pig-family.png"
                    alt=""
                />
            </div>
            <p className="text-tichtich-black text-base font-bold text-center mt-2">
                Nhập số tiền để thưởng cho con
            </p>

            <div className="bg-tichtich-primary-300 border border-tichtich-primary-200 rounded-2xl px-5 py-6 w-full my-4">
                <form onSubmit={handleSubmit(onValid)} noValidate>
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field: { onBlur } }) => (
                            <MoneyAmountField
                                label="Tặng thưởng"
                                isRequired
                                value={displayValue}
                                onChange={handleAmountChange}
                                onBlur={onBlur}
                                error={amountFieldError}
                                suggestions={
                                    suggestionTagsDismissed ? [] : suggestions
                                }
                                selectedAmount={currentAmount}
                                onPickSuggestion={pickSuggestion}
                            />
                        )}
                    />

                    <Controller
                        name="message"
                        control={control}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <MessageField
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={errors.message?.message}
                            />
                        )}
                    />
                </form>
            </div>
            <TichTichButton
                variant="outline"
                size="lg"
                fullWidth
                onPress={() => void handleSubmit(onValid)()}
                isDisabled={isSubmitting || !canSubmit}
            >
                Xác nhận
            </TichTichButton>

            <RewardSummaryModal
                isOpen={rewardSummary !== null}
                onClose={() => setRewardSummary(null)}
                amount={rewardSummary?.amount ?? 0}
                dateFormatted={rewardSummary?.dateFormatted ?? ''}
                message={formValues.message || ''}
                onSend={handleSendReward}
                isSending={isSendingReward}
            />
        </div>
    );
}
