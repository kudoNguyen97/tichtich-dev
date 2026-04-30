import type { WalletType } from '@/features/wallets/types/wallet.type';

export interface WalletDisplayConfig {
    walletType: WalletType;
    label: string;
    icon: string;
}

/**
 * Shared display config for the kid's wallets (label + icon by walletType).
 * Used by WalletOverviewSection (home dashboard) and MissionStartedDialog
 * (post-start mission summary) to keep wording/icons in sync.
 */
export const WALLET_DISPLAY_CONFIG: WalletDisplayConfig[] = [
    { walletType: 'saving', label: 'Tiết kiệm', icon: '/icons/save.svg' },
    { walletType: 'education', label: 'Học tập', icon: '/icons/study.svg' },
    {
        walletType: 'charity',
        label: 'Từ thiện',
        icon: '/icons/charity-heart.svg',
    },
    { walletType: 'spending', label: 'Tiêu vặt', icon: '/icons/candy.svg' },
];

export function getWalletDisplay(
    walletType: WalletType
): WalletDisplayConfig | undefined {
    return WALLET_DISPLAY_CONFIG.find((c) => c.walletType === walletType);
}
