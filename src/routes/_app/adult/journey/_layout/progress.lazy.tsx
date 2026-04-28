import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { TichTichButton } from '@/components/common/TichTichButton';
import { useRecentActivities } from '@/features/activity-logs/hooks/useActivityLogs';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/utils/cn';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export const Route = createLazyFileRoute(
    '/_app/adult/journey/_layout/progress'
)({
    component: ProgressPage,
});

const TOTAL_STEPS = 10;

function getLastWeekRange(): { start: Dayjs; end: Dayjs } {
    const today = dayjs();
    const day = today.day();
    const daysToLastSat = day === 6 ? 0 : day + 1;
    const end = today.subtract(daysToLastSat, 'day');
    const start = end.subtract(7, 'day');
    return { start, end };
}

function ProgressPage() {
    const navigate = useNavigate();
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const { data, isPending } = useRecentActivities({
        profileId: managedKidProfileId ?? '',
        limit: 100,
        enabled: Boolean(managedKidProfileId),
        options: {
            meta: {
                globalLoading: true,
            },
        },
    });

    const activities = data?.data ?? [];
    const spendingCount = activities.filter(
        (a) => a.activityType === 'spending'
    ).length;
    const filledCount = Math.min(spendingCount, TOTAL_STEPS);
    const percent = Math.round((filledCount / TOTAL_STEPS) * 100);
    const isReady = spendingCount >= TOTAL_STEPS;

    const { start, end } = getLastWeekRange();
    const dateRangeLabel = `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`;

    if (!managedKidProfileId) return null;

    return (
        <>
            <AppBar
                title="Hành trình tiến bộ của con"
                leftAction={
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/adult/journey' })}
                        className="flex items-center justify-center cursor-pointer hover:bg-orange-50 rounded-full p-1"
                        aria-label="Quay lại"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </button>
                }
                rightAction={null}
                className="bg-tichtich-primary-300"
            />

            <div className="w-full max-w-[720px] mx-auto px-4 flex flex-col gap-6 bg-tichtich-primary-300 h-screen ">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-tichtich-black font-display">
                        AI đồng hành cùng bạn
                    </h1>
                    <p className="text-base text-tichtich-black leading-relaxed">
                        Cùng con hoàn thành 10 lần chia tiền đầu tiên – để Tích
                        Tích bật mí những thói quen tích cực con đang hình
                        thành!
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {isPending ? (
                        <div className="h-5 w-36 rounded bg-black/10 animate-pulse" />
                    ) : (
                        <p className="text-sm font-semibold text-tichtich-black">
                            Tiến độ: {filledCount}/{TOTAL_STEPS} ({percent}%)
                        </p>
                    )}

                    <div className="flex gap-1">
                        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'h-8 flex-1 rounded-lg',
                                    isPending
                                        ? 'bg-black/10 animate-pulse'
                                        : i < filledCount
                                          ? 'bg-tichtich-primary-100 border border-tichtich-primary-200'
                                          : 'bg-gray-200'
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <TichTichButton
                        variant={isReady ? 'primary' : 'disabled'}
                        size="lg"
                        fullWidth
                        isDisabled={!isReady}
                        onPress={() =>
                            navigate({ to: '/adult/journey/finance-report' })
                        }
                    >
                        Xuất báo cáo tuần
                    </TichTichButton>
                    <p className="text-xs text-tichtich-black/50">
                        {dateRangeLabel}
                    </p>
                </div>
            </div>
        </>
    );
}
