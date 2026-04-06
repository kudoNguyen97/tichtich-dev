import { useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
// import type { ProfileWallet } from '@/features/auth/types/auth.type';
import { useGetReceivedTransactions } from '@/features/profile-transactions/hooks/useProfileTransactions';
import { RewardTransactionDialog } from '@/components/children/home/RewardTransactionDialog';

export const Route = createFileRoute('/_app/children/_layout/')({
    component: RouteComponent,
});

// function formatBalance(n: number): string {
//     return (
//         new Intl.NumberFormat('vi-VN', {
//             style: 'decimal',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         }).format(n) + ' ₫'
//     );
// }

// function totalBalanceFromWallets(wallets: ProfileWallet[]): number {
//     if (!Array.isArray(wallets)) return 0;
//     return wallets.reduce(
//         (sum, w) => sum + (typeof w.balance === 'number' ? w.balance : 0),
//         0
//     );
// }

function RouteComponent() {
    const navigate = useNavigate();
    const profile = useSelectedChildProfile();
    const { data: transactions } = useGetReceivedTransactions(
        profile?.id ?? ''
    );

    const pending = useMemo(
        () => (transactions ?? []).filter((t) => t.status === 'pending'),
        [transactions]
    );

    const rewards = useMemo(
        () =>
            pending.map((t) => ({
                id: t.id,
                amount: t.amount,
                message: t.title,
            })),
        [pending]
    );

    const totalAmount = useMemo(
        () => pending.reduce((sum, t) => sum + t.amount, 0),
        [pending]
    );

    if (!profile) return null;

    return (
        <div>
            {pending.length > 0 && (
                <RewardTransactionDialog
                    isOpen={true}
                    totalAmount={totalAmount}
                    rewards={rewards}
                    onShare={(reward, index) => {
                        navigate({
                            to: `/children/treasury?share=${reward.id}&index=${index}`,
                        });
                    }}
                    onClose={() => {}}
                    navigateTo="/adult/journey"
                />
            )}
        </div>
    );
}
