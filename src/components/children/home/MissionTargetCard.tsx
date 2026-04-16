import type React from 'react';
import { useProgressBar } from '@react-aria/progress';
import type { Mission } from '@/features/missions/types/mission.type';
import { cn } from '@/utils/cn';
import { missionWalletIconSrc } from '@/helpers/adult/missions/missionWalletIconSrc';
import {
    formatMissionEndDayVi,
    getMissionStatusBadge,
    missionStatusBadgeClassName,
} from '@/helpers/adult/missions/missionSuccessDisplay';

function MissionProgressBar({ percent }: { percent: number }) {
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

const formatMoney = (n: number) => n.toLocaleString('vi-VN');

interface MissionTargetCardProps {
    mission: Mission;
    appendAction?: React.ReactNode;
}

export function MissionTargetCard({
    mission,
    appendAction,
}: MissionTargetCardProps) {
    const badge = getMissionStatusBadge(mission);
    const iconSrc = missionWalletIconSrc(mission.walletType);
    const deadline = formatMissionEndDayVi(mission.endDay);
    const pct = mission.progress?.progressPercent ?? 0;

    return (
        <article className="rounded-xl border border-tichtich-primary-200 bg-tichtich-primary-300 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tichtich-primary-100">
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

                    <h3 className="text-base font-medium leading-snug text-tichtich-black">
                        {mission.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#595959]">
                        Hạn: {deadline}
                    </p>
                </div>

                <span className="shrink-0 text-base font-bold tabular-nums text-tichtich-black">
                    {formatMoney(mission.amount)} đ
                </span>
            </div>

            <MissionProgressBar percent={pct} />

            {appendAction && <div className="mt-3">{appendAction}</div>}
        </article>
    );
}
