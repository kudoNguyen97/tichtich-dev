import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { TichTichButton } from '@/components/common/TichTichButton';

const rewardSuccessSearchSchema = z.object({
    amount: z.coerce.number(),
    childName: z.string().min(1),
    date: z.string().min(1),
});

export const Route = createFileRoute('/_app/adult/reward-success/')({
    validateSearch: (search: Record<string, unknown>) => {
        const parsed = rewardSuccessSearchSchema.safeParse(search);
        if (!parsed.success) {
            throw redirect({ to: '/adult' });
        }
        return parsed.data;
    },
    component: RewardSuccessPage,
});

function formatRewardAmount(n: number): string {
    return (
        new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n) + ' đ'
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm font-medium text-tichtich-black">
            <span className="shrink-0">{label}</span>
            <span className="text-right font-semibold">{value}</span>
        </div>
    );
}

function RewardSuccessPage() {
    const { amount, childName, date } = Route.useSearch();
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col bg-[#FEF4D1]">
            <div className="px-5 pt-8 pb-4">
                <h1 className="text-center text-lg font-bold text-tichtich-black">
                    Con đã nhận được phần thưởng
                </h1>
            </div>

            <div className="mx-4 overflow-hidden rounded-t-3xl bg-[#F7931E]">
                <div className="flex h-[220px] w-full items-center justify-center px-2 pt-4 pb-2">
                    <img
                        className="max-h-full w-full object-contain"
                        src="/images/reward-adult/pig-family.png"
                        alt=""
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-8 pt-4">
                <div className="space-y-3 rounded-2xl bg-[#F9B826] px-4 py-5">
                    <DetailRow
                        label="Số tiền thưởng:"
                        value={formatRewardAmount(amount)}
                    />
                    <DetailRow label="Dành cho con:" value={childName} />
                    <DetailRow label="Ngày:" value={date} />
                </div>

                <div className="mt-auto pt-8">
                    <TichTichButton
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => navigate({ to: '/adult' })}
                    >
                        Về trang chủ
                    </TichTichButton>
                </div>
            </div>
        </div>
    );
}
