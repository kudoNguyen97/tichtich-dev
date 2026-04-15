import type { WalletType } from '@/features/missions/types/mission.type';

export interface WalletFormOption {
    id: string;
    label: string;
    icon: string;
    /** Gia tri gui API missions */
    walletType: WalletType;
}

/** Id luu trong form (TargetForm `wallet`) — khac ten API mot so cho */
export const WALLET_FORM_OPTIONS: WalletFormOption[] = [
    {
        id: 'savings',
        label: 'Tiết kiệm',
        icon: '/icons/target-mission/saving.svg',
        walletType: 'saving',
    },
    {
        id: 'learning',
        label: 'Học tập',
        icon: '/icons/target-mission/learning.svg',
        walletType: 'education',
    },
    {
        id: 'charity',
        label: 'Từ thiện',
        icon: '/icons/target-mission/heart.svg',
        walletType: 'charity',
    },
    {
        id: 'spending',
        label: 'Tiêu vặt',
        icon: '/icons/target-mission/candy.svg',
        walletType: 'spending',
    },
];

export function getWalletLabel(formWalletId: string): string {
    return WALLET_FORM_OPTIONS.find((w) => w.id === formWalletId)?.label ?? '—';
}

export function formWalletIdToWalletType(
    formWalletId: string
): WalletType | null {
    const opt = WALLET_FORM_OPTIONS.find((w) => w.id === formWalletId);
    return opt?.walletType ?? null;
}
