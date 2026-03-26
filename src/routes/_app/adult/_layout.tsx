import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { User, RefreshCw } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { TichTichButton } from '@/components/common/TichTichButton';
import {
    AdultAppBarLeftAvatarButton,
    AdultAppBarRightBellButton,
} from '@/components/adult/AdultAppBarActions';

export const Route = createFileRoute('/_app/adult/_layout')({
    beforeLoad: () => {
        const { selectedProfile } = useAuthStore.getState();
        if (!selectedProfile || selectedProfile.profileType !== 'adult') {
            throw redirect({ to: '/profiles' });
        }
    },
    component: AdultAppLayout,
});

function AdultAppLayout() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const allProfiles = useAuthStore((s) => s.profiles);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const titlePrefix =
        selectedProfile?.gender === 'male' ? 'Chào ba của' : 'Chào mẹ của';

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
        navigate({ to: '/adult/setting/information' });
    };

    return (
        <>
            <AppLayout
                defaultTitle={titlePrefix}
                defaultSubtitle={subtitleKidName}
                defaultLeftAction={
                    <AdultAppBarLeftAvatarButton
                        selectedProfile={selectedProfile}
                        onPress={() => setIsSheetOpen(true)}
                    />
                }
                defaultRightAction={<AdultAppBarRightBellButton />}
                appLayoutClassName="mb-20"
            />

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
                        <User className="size-5" />
                        <span>Chuyển đổi tài khoản</span>
                    </TichTichButton>
                    <TichTichButton
                        variant="primary"
                        size="md"
                        fullWidth
                        onPress={handleAccountInfo}
                    >
                        <RefreshCw className="h-5 w-5" />
                        <span>Thông tin tài khoản</span>
                    </TichTichButton>
                </div>
            </BottomSheet>
        </>
    );
}
