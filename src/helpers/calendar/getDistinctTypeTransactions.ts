import type { WalletTransaction } from '@/features/wallets/types/wallet.type';

/**
 * Returns one representative transaction per distinct `type`, preserving
 * insertion order. Used for deduplicating icons both in day cells and footer.
 *
 * Example: 9 deposit + 5 batch-deposit + 4 savings
 * → [firstDeposit, firstBatchDeposit, firstSavings] (3 items)
 */
export function getDistinctTypeTransactions(
    transactions: WalletTransaction[]
): WalletTransaction[] {
    const seen = new Set<string>();
    const result: WalletTransaction[] = [];

    for (const tx of transactions) {
        if (!seen.has(tx.type)) {
            seen.add(tx.type);
            result.push(tx);
        }
    }

    return result;
}
