import type { WalletType } from '@/features/missions/types/mission.type';

const WALLET_TYPE_TO_ICON: Record<WalletType, string> = {
    saving: '/icons/target-mission/saving.svg',
    education: '/icons/target-mission/learning.svg',
    charity: '/icons/target-mission/heart.svg',
    spending: '/icons/target-mission/candy.svg',
};

export function missionWalletIconSrc(walletType: WalletType): string {
    return WALLET_TYPE_TO_ICON[walletType];
}
