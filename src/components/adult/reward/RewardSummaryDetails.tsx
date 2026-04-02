import { formatRewardAmountDisplay } from './rewardFormat';

interface RewardSummaryDetailsProps {
    amount: number;
    childName: string;
    message: string;
    dateFormatted: string;
}

export function RewardSummaryDetails({
    amount,
    message,
    childName,
    dateFormatted,
}: RewardSummaryDetailsProps) {
    const rows = [
        { label: 'Số tiền thưởng', value: formatRewardAmountDisplay(amount) },
        { label: 'Dành cho con', value: childName },
        { label: 'Lời nhắn', value: message },
        { label: 'Ngày', value: dateFormatted },
    ];

    return (
        <div
            className="rounded-xl bg-tichtich-primary-100 px-4 py-3.5 space-y-3"
            role="region"
            aria-label="Chi tiết tóm tắt"
        >
            {rows.map(({ label, value }) => (
                <div
                    key={label}
                    className="flex items-center justify-between gap-3 text-sm text-tichtich-black"
                >
                    <span className="font-medium">{label}</span>
                    <span
                        className={
                            label === 'Số tiền thưởng'
                                ? 'font-bold tabular-nums text-right'
                                : 'font-semibold text-right'
                        }
                    >
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
}
