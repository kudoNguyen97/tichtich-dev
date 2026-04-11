import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import WalletSelector from '@/components/adult/targets/WalletSelector';
import { TichTichButton } from '@/components/common/TichTichButton';
import { MoneyAmountField } from '@/components/common/MoneyAmountField';
import { formatVndAmount } from '@/components/adult/reward/rewardFormat';

const goalSchema = z.object({
    name: z
        .string()
        .min(1, 'Vui lòng nhập tên mục tiêu')
        .max(100, 'Tối đa 100 ký tự'),
    message: z
        .string()
        .min(1, 'Vui lòng nhập lời nhắn')
        .max(150, 'Tối đa 150 ký tự'),
    amount: z
        .number({ error: 'Vui lòng nhập số tiền' })
        .min(1, 'Số tiền phải lớn hơn 0'),
    wallet: z.string().min(1, 'Vui lòng chọn ví'),
    startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
    endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
});

type GoalFormData = z.infer<typeof goalSchema>;

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
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const GoalForm = () => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
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
    const messageVal = watch('message') || '';
    const startDate = watch('startDate') || '';
    const endDate = watch('endDate') || '';
    const daysBetween = getDaysBetween(startDate, endDate);

    const onSubmit = (data: GoalFormData) => {
        console.log('Form submitted:', data);
    };

    const handleAmountChange = (val: string) => {
        const digits = val.replace(/\D/g, '');
        const num = digits ? parseInt(digits, 10) : NaN;
        setAmountDisplay(isNaN(num) ? '' : formatVndAmount(num));
        if (isNaN(num)) {
            setValue('amount', undefined as unknown as number, {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setValue('amount', num, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="space-y-5 p-4 rounded-lg bg-tichtich-primary-300  mb-4">
                {/* Tên mục tiêu */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-tichtich-black">
                        Tên mục tiêu mới <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('name')}
                        placeholder="Placeholder"
                        maxLength={100}
                        rows={2}
                        className={[
                            'w-full rounded-xl border border-tichtich-black bg-white',
                            'px-4 py-3 text-sm text-gray-700 resize-none',
                            'outline-none transition-colors placeholder:text-gray-300',
                            'focus:ring-2 focus:ring-tichtich-primary-200',
                            errors.name
                                ? 'border-red-400 focus:ring-red-200'
                                : 'border-amber-300 hover:border-amber-400 focus:border-orange-400',
                        ].join(' ')}
                    />
                </div>

                {/* Lời nhắn */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-tichtich-black">
                        Lời nhắn cho con <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('message')}
                        placeholder="Hãy cố gắng hoàn thành mục tiêu nhé!"
                        maxLength={150}
                        rows={3}
                        className={[
                            'w-full rounded-xl border border-tichtich-black bg-white',
                            'px-4 py-3 text-sm text-gray-700 resize-none',
                            'outline-none transition-colors placeholder:text-gray-300',
                            'focus:ring-2 focus:ring-tichtich-primary-200',
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
                            error={errors.amount?.message}
                            suggestions={[]}
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
                    <label className="text-sm font-semibold text-tichtich-black">
                        Thời gian <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-1">
                            <span className="text-xs text-tichtich-black">
                                Ngày bắt đầu
                            </span>
                            <input
                                type="date"
                                {...register('startDate')}
                                className={[
                                    'w-full rounded-xl border border-tichtich-black bg-white',
                                    'px-4 py-3 text-sm text-gray-700 resize-none',
                                    'outline-none transition-colors placeholder:text-gray-300',
                                    'focus:ring-2 focus:ring-tichtich-primary-200',
                                    errors.startDate
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-amber-300 hover:border-amber-400 focus:border-orange-400',
                                ].join(' ')}
                            />
                            {startDate && (
                                <p className="text-xs font-medium text-tichtich-black">
                                    {formatDateLabel(startDate)}
                                </p>
                            )}
                            {errors.startDate && (
                                <p className="text-xs text-destructive">
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>

                        {daysBetween > 0 && (
                            <span className="text-sm font-semibold text-tichtich-primary-200 pt-4">
                                {daysBetween} ngày
                            </span>
                        )}

                        <div className="flex-1 space-y-1">
                            <span className="text-xs text-tichtich-black">
                                Ngày kết thúc
                            </span>
                            <input
                                type="date"
                                {...register('endDate')}
                                className={[
                                    'w-full rounded-xl border border-tichtich-black bg-white',
                                    'px-4 py-3 text-sm text-gray-700 resize-none',
                                    'outline-none transition-colors placeholder:text-gray-300',
                                    'focus:ring-2 focus:ring-tichtich-primary-200',
                                    errors.endDate
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-amber-300 hover:border-amber-400 focus:border-orange-400',
                                ].join(' ')}
                            />
                            {endDate && (
                                <p className="text-xs font-medium text-tichtich-black">
                                    {formatDateLabel(endDate)}
                                </p>
                            )}
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
        </form>
    );
};

export default GoalForm;
