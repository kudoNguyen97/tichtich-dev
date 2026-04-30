import type { Wallet } from '@/features/wallets/types/wallet.type';

export type WalletType = 'charity' | 'education' | 'saving' | 'spending';

export type MissionStatus =
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'resolved'
    | 'failed'
    | string;

export interface MissionProgress {
    id: string;
    missionId: string;
    profileId: string;
    walletId: string;
    currentBalance: number;
    targetAmount: number;
    progressPercent: number;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    profileId: string;
    walletType: WalletType;
    amount: number;
    startDay: string;
    endDay: string;
    rewardPoint: number;
    status: MissionStatus;
    progress?: MissionProgress;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMissionPayload {
    profileId: string;
    title: string;
    amount: number;
    walletType: WalletType;
    startDay: string;
    endDay: string;
}

export interface DeleteMissionData {
    missionId: string;
    isDeleteSuccess: boolean;
}

export interface MissionResolveData {
    profileId: string;
    wallet: Wallet;
    mission: Mission;
    isFirstMission: boolean;
}
