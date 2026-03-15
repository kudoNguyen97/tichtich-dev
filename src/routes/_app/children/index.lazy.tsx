import { createLazyFileRoute } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import type { ProfileWallet } from '@/features/auth/types/auth.type';

export const Route = createLazyFileRoute('/_app/children/')({
    component: RouteComponent,
});

function formatBalance(n: number): string {
    return (
        new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n) + ' ₫'
    );
}

function totalBalanceFromWallets(wallets: ProfileWallet[]): number {
    if (!Array.isArray(wallets)) return 0;
    return wallets.reduce(
        (sum, w) => sum + (typeof w?.balance === 'number' ? w.balance : 0),
        0
    );
}

function RouteComponent() {
    const profile = useSelectedChildProfile();

    if (!profile) return null;

    const totalBalance = totalBalanceFromWallets(profile.wallets ?? []);

    return (
        <div className="">
            <div className="px-4 pt-8 pb-6">
                <h1 className="text-center text-xl font-bold text-tichtich-black">
                    Chào mẹ của {profile.fullName}
                </h1>
                <p className="mt-2 text-center text-tichtich-black/80">
                    Tổng số dư: {formatBalance(totalBalance)}
                </p>
            </div>
        </div>
    );
}
