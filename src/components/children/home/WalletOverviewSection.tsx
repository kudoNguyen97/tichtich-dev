import type { Wallet, WalletType } from '@/features/wallets/types/wallet.type';
import { WalletOverviewCard } from './WalletOverviewCard';

interface WalletDisplayConfig {
    walletType: WalletType;
    label: string;
    icon: string;
}

const WALLET_DISPLAY_CONFIG: WalletDisplayConfig[] = [
    { walletType: 'saving', label: 'Tiết kiệm', icon: '/icons/save.svg' },
    { walletType: 'education', label: 'Học tập', icon: '/icons/study.svg' },
    {
        walletType: 'charity',
        label: 'Từ thiện',
        icon: '/icons/charity-heart.svg',
    },
    { walletType: 'spending', label: 'Tiêu vặt', icon: '/icons/candy.svg' },
];

interface WalletOverviewSectionProps {
    wallets: Wallet[] | undefined;
}

export function WalletOverviewSection({ wallets }: WalletOverviewSectionProps) {
    const walletMap = new Map(
        (wallets ?? []).map((w) => [w.walletType, w.balance])
    );

    return (
        <section>
            <h2 className="text-lg font-bold text-tichtich-black mb-3">
                Ngăn kho báu
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {WALLET_DISPLAY_CONFIG.map((config) => (
                    <WalletOverviewCard
                        key={config.walletType}
                        icon={config.icon}
                        label={config.label}
                        balance={walletMap.get(config.walletType) ?? 0}
                    />
                ))}
            </div>
        </section>
    );
}
