import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { MissionSuccessCard } from '@/components/adult/missions/MissionSuccessCard';
import {
    useDeleteMission,
    useMissionsByProfileIdKid,
} from '@/features/missions/hooks/useMissions';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { showError } from '@/lib/toast';

export const Route = createFileRoute('/_app/adult/journey/_layout/goals')({
    component: GoalsPage,
});

const FIXED_TIPS = [
    {
        title: 'Gắn với lòng biết ơn hoặc sẻ chia',
        description:
            'Hãy khơi gợi những câu chuyện tử tế. Cùng con tạo mục tiêu tặng quà cho người thân, bạn bè hoặc giúp đỡ người khác.',
    },
    {
        title: 'Cùng lên kế hoạch món đồ yêu thích',
        description:
            'Thay vì mua ngay, hãy giúp con lập kế hoạch tiết kiệm. Bé sẽ thêm trân trọng quá trình nỗ lực của mình.',
    },
    {
        title: 'Gợi ý con tiết kiệm nhiều hơn',
        description:
            'Khuyến khích con để dành thêm hoặc tự tìm "thu nhập" qua việc nhà, hành động tốt, hay thành tích học tập đáng khen.',
    },
];

function GoalsPage() {
    const navigate = useNavigate();
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const [deletingMissionId, setDeletingMissionId] = useState<string | null>(
        null
    );

    const { data: missions, isLoading, isError } = useMissionsByProfileIdKid(
        managedKidProfileId ?? ''
    );
    const { mutateAsync: deleteMission } = useDeleteMission();

    useEffect(() => {
        if (!managedKidProfileId) {
            navigate({ to: '/adult/journey' });
        }
    }, [managedKidProfileId, navigate]);

    const handleDeleteMission = async (missionId: string) => {
        try {
            setDeletingMissionId(missionId);
            await deleteMission(missionId);
            useNotificationStore.getState().show({
                title: 'Đã xóa mục tiêu',
                description: 'Mục tiêu đã được gỡ khỏi danh sách.',
                variant: 'success',
            });
        } catch (error) {
            showError(error);
        } finally {
            setDeletingMissionId(null);
        }
    };

    const list = missions ?? [];

    if (!managedKidProfileId) return null;

    return (
        <>
            <AppBar
                title="Danh sách mục tiêu"
                leftAction={
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/adult/journey' })}
                        className="flex items-center justify-center"
                        aria-label="Quay lại"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </button>
                }
                rightAction={null}
            />

            <div className="w-full max-w-[720px] mx-auto px-4 pt-4 pb-8 bg-tichtich-primary-300 min-h-[calc(100vh-56px)]">
                {isLoading ? (
                    <p className="text-center text-sm text-tichtich-black/70 py-6">
                        Đang tải danh sách mục tiêu...
                    </p>
                ) : isError ? (
                    <p className="text-center text-sm text-destructive py-6">
                        Không tải được danh sách mục tiêu.
                    </p>
                ) : list.length === 0 ? (
                    <p className="text-center text-sm text-tichtich-black/70 py-6">
                        Chưa có mục tiêu.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {list.map((mission) => (
                            <li key={mission.id}>
                                <MissionSuccessCard
                                    mission={mission}
                                    showDelete
                                    isDeleting={deletingMissionId === mission.id}
                                    onDelete={handleDeleteMission}
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <section className="mt-6">
                    <h2 className="mb-3 flex items-center gap-2 text-[30px] font-semibold font-display text-tichtich-black">
                        <Lightbulb className="size-6 text-tichtich-black" />
                        <span className="text-xl font-semibold">
                            3 gợi ý nhỏ cùng con tạo mục tiêu
                        </span>
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {FIXED_TIPS.map((tip) => (
                            <li
                                key={tip.title}
                                className="rounded-xl border border-tichtich-primary-200 bg-white/70 px-4 py-3"
                            >
                                <h3 className="text-xl font-bold text-tichtich-black">
                                    {tip.title}
                                </h3>
                                <p className="mt-1 text-sm text-tichtich-black">
                                    {tip.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
}
