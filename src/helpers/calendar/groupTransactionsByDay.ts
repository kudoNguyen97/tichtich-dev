import dayjs from 'dayjs';
import type { WalletTransaction } from '@/features/wallets/types/wallet.type';

export function groupTransactionsByDay(
    transactions: WalletTransaction[]
): Record<string, WalletTransaction[]> {
    const grouped = new Map<string, WalletTransaction[]>();

    for (const tx of transactions) {
        const key = dayjs(tx.createdAt).format('YYYY-MM-DD');
        const existing = grouped.get(key);
        if (existing) {
            existing.push(tx);
        } else {
            grouped.set(key, [tx]);
        }
    }

    return Object.fromEntries(grouped);
}
