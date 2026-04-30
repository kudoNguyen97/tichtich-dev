import coinIllustration from '@/assets/icons/coin-Illustration.svg';

interface KidWalletOverviewCardProps {
    kidName: string;
    totalBalance: number;
}

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

export function KidWalletOverviewCard({
    kidName,
    totalBalance,
}: KidWalletOverviewCardProps) {
    return (
        <div className="relative overflow-hidden rounded-lg bg-tichtich-primary-300 py-10 px-4">
            <div className="relative z-10 flex flex-col gap-1">
                <p className="text-base font-semibold text-tichtich-black">
                    {kidName.trim().split(' ').filter(Boolean).pop() ?? ''}
                </p>

                <p className="text-3xl font-extrabold text-tichtich-primary-200">
                    {formatMoney(totalBalance)} đ
                </p>
            </div>
            <img
                src={coinIllustration}
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute -bottom-2 -right-2 h-35 w-auto select-none"
            />
        </div>
    );
}
