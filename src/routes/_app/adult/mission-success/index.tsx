import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { MissionSuccessCard } from '@/components/adult/missions/MissionSuccessCard';
import { MissionThreeTargetsNotice } from '@/components/adult/missions/MissionThreeTargetsNotice';
import { TichTichButton } from '@/components/common/TichTichButton';
import { useMissionsByProfileIdKid } from '@/features/missions/hooks/useMissions';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/_app/adult/mission-success/')({
    component: MissionSuccessPage,
});

function MissionSuccessPage() {
    const navigate = useNavigate();
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    const {
        data: missions,
        isLoading,
        isError,
    } = useMissionsByProfileIdKid(managedKidProfileId ?? '');

    useEffect(() => {
        if (!managedKidProfileId) {
            navigate({ to: '/adult' });
        }
    }, [managedKidProfileId, navigate]);

    if (!managedKidProfileId) {
        return null;
    }

    const list = missions ?? [];
    const showNotice = list.length >= 3;

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[url('/icons/target-mission/bg-tichtich-mission.png')] bg-cover bg-center no-repeat bg-tichtich-primary-300">
            <div className="relative z-10 flex flex-1 flex-col px-4 pb-8 pt-8">
                <header className="space-y-1 pb-4 text-center">
                    <h1 className="text-lg font-bold text-tichtich-black">
                        Tạo mục tiêu thành công
                    </h1>
                </header>

                <div className="flex flex-1 flex-col gap-4">
                    {showNotice && <MissionThreeTargetsNotice />}

                    {isLoading && (
                        <p className="text-center text-sm text-tichtich-black/70">
                            Đang tải…
                        </p>
                    )}

                    {isError && (
                        <p className="text-center text-sm text-destructive">
                            Không tải được danh sách mục tiêu.
                        </p>
                    )}

                    {!isLoading && !isError && list.length === 0 && (
                        <p className="text-center text-sm text-tichtich-black/70">
                            Chưa có mục tiêu.
                        </p>
                    )}

                    <ul className="flex flex-col gap-4">
                        {list.map((m) => (
                            <li key={m.id}>
                                <MissionSuccessCard mission={m} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto pt-8">
                    <TichTichButton
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => navigate({ to: '/adult' })}
                    >
                        Về lại trang chủ
                    </TichTichButton>
                </div>
            </div>
        </div>
    );
}
