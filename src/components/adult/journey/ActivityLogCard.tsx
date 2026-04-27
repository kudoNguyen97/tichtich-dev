import type {
    ActivityLog,
    WalletDistributionEntry,
} from '@/features/activity-logs/types/activityLog.type';
import {
    formatRelativeDay,
    getActivityDisplayTitle,
    getJourneyActivityIconSrc,
    normalizeWalletDistributions,
} from '@/helpers/journey/activityLogDisplay';
import { cn } from '@/utils/cn';
import charityIcon from '@/assets/icons/charity-heart.svg';
import educationIcon from '@/assets/icons/target-mission/learning.svg';
import savingsIcon from '@/assets/icons/target-mission/saving.svg';
import allowanceIcon from '@/assets/icons/target-mission/candy.svg';

function formatAmount(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

const WALLET_DISTRIBUTION_ICONS: Record<string, string> = {
    charity: charityIcon,
    education: educationIcon,
    saving: savingsIcon,
    spending: allowanceIcon,
};

interface WalletBadgeProps {
    entry: WalletDistributionEntry;
}

function WalletBadge({ entry }: WalletBadgeProps) {
    const walletType = entry.wallet_type ?? entry.walletType ?? 'spending';
    return (
        <div className="flex items-center gap-1">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-tichtich-primary-200">
                <img
                    src={WALLET_DISTRIBUTION_ICONS[walletType]}
                    alt=""
                    className="h-3.5 w-3.5 object-contain"
                />
            </div>
            <span className="text-xs text-tichtich-black">
                {formatAmount(entry.amount)}
            </span>
        </div>
    );
}

export interface ActivityLogCardProps {
    activity: ActivityLog;
    className?: string;
}

export function ActivityLogCard({ activity, className }: ActivityLogCardProps) {
    const title = getActivityDisplayTitle(activity);
    const iconSrc = getJourneyActivityIconSrc(activity);
    const relativeDay = formatRelativeDay(activity.createdAt);
    const isWalletDistribution =
        activity.activityType === 'wallet_distribution';
    const walletDistributions = normalizeWalletDistributions(
        activity.metadata?.wallet_distributions
    );

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-lg bg-tichtich-primary-300 p-3',
                className
            )}
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tichtich-primary-100">
                <img src={iconSrc} alt="" className="h-6 w-6 object-contain" />
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-1">
                <p className="text-sm font-bold text-tichtich-black leading-snug">
                    {title}
                </p>

                {isWalletDistribution && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-0.5">
                        {walletDistributions.map((entry, idx) => (
                            <WalletBadge key={idx} entry={entry} />
                        ))}
                    </div>
                )}

                <p className="text-xs text-neutral-500">{relativeDay}</p>
            </div>
        </div>
    );
}
