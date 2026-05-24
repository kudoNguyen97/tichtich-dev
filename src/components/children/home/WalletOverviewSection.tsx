import type { Wallet } from '@/features/wallets/types/wallet.type';
import { WALLET_DISPLAY_CONFIG } from '@/features/wallets/constants/walletDisplay';
import { WalletOverviewCard } from './WalletOverviewCard';

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
