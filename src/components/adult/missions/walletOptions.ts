import type { WalletType } from '@/features/missions/types/mission.type';

export interface WalletFormOption {
    id: string;
    label: string;
    icon: string;
    /** Giá trị gửi API missions */
    walletType: WalletType;
}

/** Id lưu trong form (TargetForm `wallet`) — khác tên API một số chỗ */
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
