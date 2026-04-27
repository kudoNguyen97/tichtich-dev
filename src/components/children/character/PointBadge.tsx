import { Star } from 'lucide-react';

const MAX = 200;

interface PointBadgeProps {
    points: number;
    onClick?: () => void;
}

export function PointBadge({ points, onClick }: PointBadgeProps) {
    const pct = Math.min(100, (points / MAX) * 100);

    return (
        <div className="flex flex-col items-end ">
            <div className="max-w-[150px] min-w-[100px] flex flex-col gap-1.5">
                <div
                    className="flex items-center justify-center gap-2 rounded-full border border-tichtich-primary-200 bg-white/95 p-4 py-2 cursor-pointer"
                    onClick={onClick}
                >
                    <span className="text-[34px] leading-none font-extrabold tabular-nums text-black">
                        {points}
                    </span>
                    <Star className="size-5 -translate-y-0.5 fill-tichtich-primary-200 text-tichtich-primary-200" />
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white">
                    <div
                        className="h-full rounded-full bg-tichtich-primary-200 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
