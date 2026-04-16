import { cn } from '@/utils/cn';

export interface WalletOverviewCardProps {
    icon: string;
    label: string;
    balance: number;
    className?: string;
}

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

export function WalletOverviewCard({
    icon,
    label,
    balance,
    className,
}: WalletOverviewCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-tichtich-primary-200 bg-tichtich-primary-300 p-4 flex items-center gap-3',
                className
            )}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <img
                    src={icon}
                    alt={label}
                    className="h-8 w-8 object-contain"
                />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-tichtich-black truncate">
                    {label}
                </p>
                <p className="text-base font-bold text-tichtich-black">
                    {formatMoney(balance)} đ
                </p>
            </div>
        </div>
    );
}
