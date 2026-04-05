export type ProfileTransactionStatus =
    | 'pending'
    | 'completed'
    | 'failed'
    | 'cancelled';

export interface ProfileTransaction {
    id: string;
    sender: Sender;
    receiver: Receiver;
    amount: number;
    status: ProfileTransactionStatus;
    title: string;
    description: string;
    isManual: boolean;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export interface Sender {
    id: string;
    userId: string;
    profileType: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    age: number;
    wallets: any[];
    pinCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface Receiver {
    id: string;
    userId: string;
    profileType: string;
    fullName: string;
    gender: string;
    wallets: Wallet[];
    pinCode: string;
    isOnboardingCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Wallet {
    id: string;
    walletType: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProfileTransactionPayload {
    fromProfileId: string;
    toProfileId: string;
    amount: number;
    note: string;
}
