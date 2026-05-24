import type { WalletType } from '@/features/wallets/types/wallet.type';
import { WALLET_TYPE } from '@/features/wallets/constants/walletType';

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
    {
        walletType: WALLET_TYPE.SAVING,
        label: 'Tiết kiệm',
        icon: '/icons/save.svg',
    },
    {
        walletType: WALLET_TYPE.EDUCATION,
        label: 'Học tập',
        icon: '/icons/study.svg',
    },
    {
        walletType: WALLET_TYPE.CHARITY,
        label: 'Từ thiện',
        icon: '/icons/charity-heart.svg',
    },
    {
        walletType: WALLET_TYPE.SPENDING,
        label: 'Tiêu vặt',
        icon: '/icons/candy.svg',
    },
];

export function getWalletDisplay(
    walletType: WalletType
): WalletDisplayConfig | undefined {
    return WALLET_DISPLAY_CONFIG.find((c) => c.walletType === walletType);
}
