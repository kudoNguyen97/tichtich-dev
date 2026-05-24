import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { TichTichButton } from '@/components/common/TichTichButton';
import { ResetWalletSuccessCard } from '@/components/adult/reset-profile/ResetWalletSuccessCard';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useKidProfileDetail } from '@/features/profiles/hooks/useProfiles';

type SuccessSearch = {
    amount: number;
    kidId: string;
};

export const Route = createFileRoute(
    '/_app/adult/reset-profile/_layout/success'
)({
    component: ResetWalletSuccessPage,
    validateSearch: (search: Record<string, unknown>): SuccessSearch => ({
        amount: Number(search.amount) || 0,
        kidId: String(search.kidId ?? ''),
    }),
    head: () => ({ meta: [{ title: 'Tích Tích - Đặt lại ví thành công' }] }),
});

function ResetWalletSuccessPage() {
    const navigate = useNavigate();
    const { amount, kidId } = Route.useSearch();
    const adultId = useAuthStore((s) => s.selectedProfile?.id);

    const { data: kidDetail } = useKidProfileDetail(kidId, adultId ?? '');

    useEffect(() => {
        if (!amount || !kidId) {
            navigate({ to: '/adult', replace: true });
        }
    }, [amount, kidId, navigate]);

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-tichtich-primary-300">
            <div className="pointer-events-none absolute inset-0 z-0">
                <img
                    src="/images/success-background.png"
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative z-10 flex flex-1 flex-col px-4 py-8">
                <h1 className="pb-8 text-center text-2xl font-bold text-tichtich-black">
                    Đặt lại ví cho con thành công!
                </h1>

                {kidDetail && (
                    <ResetWalletSuccessCard
                        profile={kidDetail}
                        newBalance={amount}
                    />
                )}

                <div className="mt-auto">
                    <TichTichButton
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => navigate({ to: '/adult' })}
                    >
                        Trở về trang chủ
                    </TichTichButton>
                </div>
            </div>
        </div>
    );
}
