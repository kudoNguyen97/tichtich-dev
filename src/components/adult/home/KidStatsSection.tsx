import { useMemo } from 'react';
import savingIcon from '@/assets/icons/home-adult/saving.svg';
import charityIcon from '@/assets/icons/home-adult/charity.svg';
import spendMoneyIcon from '@/assets/icons/home-adult/spend-money.svg';
import type { WalletTransaction } from '@/features/wallets/types/wallet.type';
import { WALLET_TYPE } from '@/features/wallets/constants/walletType';

interface KidStatsSectionProps {
    transactions: WalletTransaction[];
}

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

interface StatCardItem {
    icon: string;
    label: string;
    value: string;
}

export function KidStatsSection({ transactions }: KidStatsSectionProps) {
    const items: StatCardItem[] = useMemo(() => {
        const savingDeposits = transactions.filter(
            (t) =>
                t.type === 'deposit' &&
                t.wallet?.walletType === WALLET_TYPE.SAVING
        );
        const savingTotal = savingDeposits.reduce(
            (sum, t) => sum + t.amount,
            0
        );
        const savingCount = savingDeposits.length;

        const charityTotal = transactions
            .filter(
                (t) =>
                    t.type === 'deposit' &&
                    t.wallet?.walletType === WALLET_TYPE.CHARITY
            )
            .reduce((sum, t) => sum + t.amount, 0);

        return [
            {
                icon: savingIcon,
                label: 'chia tổng số tiền vào ngăn tiết kiệm',
                value: `${formatMoney(savingTotal)}đ`,
            },
            {
                icon: savingIcon,
                label: 'đạt số lần chia tiền vào ví tiết kiệm',
                value: `${savingCount} lần`,
            },
            {
                icon: charityIcon,
                label: 'chia tổng số tiền vào ngăn từ thiện',
                value: `${formatMoney(charityTotal)}đ`,
            },
            {
                icon: spendMoneyIcon,
                label: 'đã tiết kiệm và không chi trong',
                value: '0 ngày',
            },
        ];
    }, [transactions]);

    return (
        <section className="bg-tichtich-primary-300 rounded-lg p-4">
            <h2 className="mb-3 text-2xl font-bold text-tichtich-primary-200">
                30 ngày gần nhất, con đã...
            </h2>
            <div className="flex flex-col gap-3">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-lg bg-tichtich-primary-100 p-4 text-white"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/95">
                                <img
                                    src={item.icon}
                                    alt=""
                                    aria-hidden
                                    className="size-5 object-contain"
                                />
                            </div>
                            <span className="text-base">{item.label}</span>
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-tichtich-black">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
