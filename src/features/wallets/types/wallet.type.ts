export type WalletType = 'charity' | 'education' | 'saving' | 'spending';

export interface Wallet {
    id: string;
    walletType: WalletType;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface WalletUpdateItem {
    walletId: string;
    amount: number;
}

export interface BatchDepositPayload {
    walletUpdates: WalletUpdateItem[];
    type: 'deposit';
    title: string;
    description: string;
}
