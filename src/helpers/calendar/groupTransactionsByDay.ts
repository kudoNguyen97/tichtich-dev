import dayjs from 'dayjs';
import type { WalletTransaction } from '@/features/wallets/types/wallet.type';

export function groupTransactionsByDay(
    transactions: WalletTransaction[]
): Record<string, WalletTransaction[]> {
    const grouped: Record<string, WalletTransaction[]> = {};

    for (const tx of transactions) {
        const key = dayjs(tx.createdAt).format('YYYY-MM-DD');
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(tx);
    }

    return grouped;
}
