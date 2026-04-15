import { useProgressBar } from '@react-aria/progress';
import { Star } from 'lucide-react';
import type { Mission } from '@/features/missions/types/mission.type';
import { cn } from '@/utils/cn';
import { missionWalletIconSrc } from '@/helpers/adult/missions/missionWalletIconSrc';
import {
    formatMissionEndDayVi,
    getMissionStatusBadge,
    missionStatusBadgeClassName,
} from '@/helpers/adult/missions/missionSuccessDisplay';

function MissionProgressRow({ percent }: { percent: number }) {
    const clamped = Math.min(100, Math.max(0, percent));
    const { progressBarProps } = useProgressBar({
        value: clamped,
        minValue: 0,
        maxValue: 100,
        valueLabel: `${Math.round(clamped)}%`,
        'aria-label': 'Tiến độ mục tiêu',
    });

    return (
        <div className="flex w-full items-center gap-2 pt-1">
            <div
                {...progressBarProps}
                className="flex min-w-0 flex-1 flex-col gap-1"
            >
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/80">
                    <div
                        className="h-full rounded-full bg-tichtich-primary-200 transition-[width]"
                        style={{ width: `${clamped}%` }}
                    />
                </div>
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-tichtich-black">
                {Math.round(clamped)}%
            </span>
        </div>
    );
}

export function MissionSuccessCard({ mission }: { mission: Mission }) {
    const badge = getMissionStatusBadge(mission);
    const iconSrc = missionWalletIconSrc(mission.walletType);
    const deadline = formatMissionEndDayVi(mission.endDay);
    const pct = mission.progress?.progressPercent ?? 0;

    return (
        <article
            className={cn(
                'rounded-xl border border-tichtich-primary-200 bg-tichtich-primary-300 p-4 shadow-sm'
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex-2 gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mb-2.5',
                                    'bg-tichtich-primary-100'
                                )}
                            >
                                <img
                                    src={iconSrc}
                                    alt=""
                                    className="h-8 w-8 object-contain"
                                />
                            </div>
                            <span
                                className={cn(
                                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold text-tichtich-black',
                                    missionStatusBadgeClassName(badge.variant)
                                )}
                            >
                                {badge.label}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-base font-medium leading-snug text-tichtich-black">
                        {mission.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#595959]">
                        Hạn: {deadline}
                    </p>
                    <MissionProgressRow percent={pct} />
                </div>
                <div className="flex-1 flex items-center justify-end gap-0.5 text-tichtich-primary-200">
                    <span className="text-base font-bold tabular-nums">
                        {mission.rewardPoint}
                    </span>
                    <Star
                        className="size-5 fill-tichtich-primary-200 text-tichtich-primary-200"
                        aria-hidden
                    />
                </div>
            </div>
        </article>
    );
}
