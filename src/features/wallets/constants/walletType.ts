export const WALLET_TYPE = {
    CHARITY: 'charity',
    EDUCATION: 'education',
    SAVING: 'saving',
    SPENDING: 'spending',
} as const;

export type WalletTypeValue = (typeof WALLET_TYPE)[keyof typeof WALLET_TYPE];
