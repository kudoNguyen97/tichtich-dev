import { createLazyFileRoute } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import type { ProfileWallet } from '@/features/auth/types/auth.type';
import { Gift, Home, User } from 'lucide-react';

export const Route = createLazyFileRoute('/_app/children/_layout/')({
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
        (sum, w) => sum + (typeof w.balance === 'number' ? w.balance : 0),
        0
    );
}

function RouteComponent() {
    const profile = useSelectedChildProfile();

    if (!profile) return null;

    const totalBalance = totalBalanceFromWallets(profile.wallets);

    return (
        <div>
            <div className="flex flex-col items-center justify-center px-6 py-12">
                <div className="size-20 rounded-full bg-tichtich-primary-200/10 flex items-center justify-center mb-4">
                    <Home size={40} className="text-tichtich-primary-200" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Chào mẹ của {profile.fullName}
                </h2>
                <p className="text-gray-600 text-center">
                    Tính năng đang phát triển
                </p>
            </div>
        </div>
    );
}
