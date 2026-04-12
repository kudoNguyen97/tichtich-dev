// import { AppLayout } from '@/components/layout/AppLayout';
import {
    createFileRoute,
    Outlet,
    redirect,
    useNavigate,
} from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { useEffect, useMemo, useState } from 'react';
import { AdultAppBarLeftAvatarButton } from '@/components/adult/AdultAppBarActions';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { TichTichButton } from '@/components/common/TichTichButton';
import { RefreshCw, User } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { RewardTransactionDialog } from '@/components/children/home/RewardTransactionDialog';
import { useGetReceivedTransactions } from '@/features/profile-transactions/hooks/useProfileTransactions';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';

export const Route = createFileRoute('/_app/children/_layout')({
    beforeLoad: () => {
        const { selectedProfile } = useAuthStore.getState();
        if (!selectedProfile || selectedProfile.profileType !== 'kid') {
            throw redirect({ to: '/profiles' });
        }
    },
    component: ChildrenAppLayout,
});

function ChildrenAppLayout() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const allProfiles = useAuthStore((s) => s.profiles);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isRewardTransactionDialogOpen, setIsRewardTransactionDialogOpen] =
        useState(false);

    const titlePrefix = 'Xin chào';

    const kidProfiles = allProfiles.filter((p) => p.profileType === 'kid');
    const subtitleKidName =
        kidProfiles.find((p) => p.id === managedKidProfileId)?.fullName ??
        kidProfiles[0]?.fullName;

    const handleSwitchAccount = () => {
        setIsSheetOpen(false);
        navigate({ to: '/profiles' });
    };

    const handleAccountInfo = () => {
        setIsSheetOpen(false);
        navigate({ to: '/children/settings' });
    };
    const profile = useSelectedChildProfile();
    const { data: transactions } = useGetReceivedTransactions(
        profile?.id ?? ''
    );

    const pending = useMemo(
        () => (transactions ?? []).filter((t) => t.status === 'pending'),
        [transactions]
    );

    const rewards = useMemo(
        () =>
            pending.map((t) => ({
                id: t.id,
                amount: t.amount,
                message: t.title,
            })),
        [pending]
    );

    useEffect(() => {
        if (pending.length > 0) {
            setIsRewardTransactionDialogOpen(true);
        }
    }, [pending]);

    const totalAmount = useMemo(
        () => pending.reduce((sum, t) => sum + t.amount, 0),
        [pending]
    );
    return (
        <>
            <AppBar
                title={titlePrefix}
                subtitle={subtitleKidName}
                className="bg-tichtich-primary-300 border-b border-gray-200"
                leftAction={
                    <AdultAppBarLeftAvatarButton
                        selectedProfile={selectedProfile}
                        onPress={() => setIsSheetOpen(true)}
                    />
                }
            />
            <div className="bg-[url('/images/background-illustration-desktop.png')] bg-cover bg-center min-h-screen">
                <Outlet />
                {pending.length > 0 && (
                    <RewardTransactionDialog
                        isOpen={isRewardTransactionDialogOpen}
                        totalAmount={totalAmount}
                        rewards={rewards}
                        onShare={(reward, index) => {
                            setIsRewardTransactionDialogOpen(false);

                            navigate({
                                to: `/children/treasury?share=${reward.id}&index=${index}`,
                            });
                        }}
                        onClose={() => {}}
                        navigateTo="/adult/journey"
                    />
                )}
            </div>
            <BottomNav />
            <BottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title="Tuỳ chọn"
            >
                <div className="flex flex-col gap-3">
                    <TichTichButton
                        variant="primary"
                        size="md"
                        fullWidth
                        onPress={handleSwitchAccount}
                    >
                        <RefreshCw className="h-5 w-5" />
                        <span>Chuyển đổi tài khoản</span>
                    </TichTichButton>
                    <TichTichButton
                        variant="primary"
                        size="md"
                        fullWidth
                        onPress={handleAccountInfo}
                    >
                        <User className="size-5" />
                        <span>Thông tin tài khoản</span>
                    </TichTichButton>
                </div>
            </BottomSheet>
        </>
    );
}
