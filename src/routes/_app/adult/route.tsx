import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { Button } from 'react-aria-components';
import { Bell, User, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { TichTichButton } from '@/components/common/TichTichButton';

function AdultAppLayout() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const allProfiles = useAuthStore((s) => s.profiles);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const titlePrefix =
        selectedProfile?.gender === 'male' ? 'Chào ba của' : 'Chào mẹ của';

    const firstChild = allProfiles.find((p) => p.profileType === 'kid');

    const handleSwitchAccount = () => {
        setIsSheetOpen(false);
        navigate({ to: '/profiles' });
    };

    const handleAccountInfo = () => {
        setIsSheetOpen(false);
        // TODO: điều hướng tới trang thông tin tài khoản khi có thiết kế
    };

    return (
        <>
            <AppLayout
                defaultTitle={titlePrefix}
                defaultSubtitle={firstChild?.fullName}
                defaultLeftAction={
                    <Button
                        className="cursor-pointer group"
                        onPress={() => setIsSheetOpen(true)}
                    >
                        <div
                            className={cn(
                                'relative',
                                'size-10 rounded-full flex items-center justify-center transition-transform duration-150 group-hover:scale-105 group-hover:shadow-lg',
                                selectedProfile?.gender === 'male'
                                    ? 'bg-tichtich-primary-100'
                                    : 'bg-tichtich-primary-200'
                            )}
                        >
                            <img
                                src={
                                    selectedProfile?.gender === 'male'
                                        ? '/images/avatar/adult-fullface.png'
                                        : '/images/avatar/girlkid-fullface.png'
                                }
                                alt="Avatar"
                                className="size-full w-6 h-6 transition-transform duration-150 group-hover:scale-110"
                            />
                            <RefreshCw
                                className={cn(
                                    cn(
                                        'absolute bottom-0 right-0 size-4 text-white font-bold',
                                        'transition-transform duration-150 group-hover:scale-110',
                                        selectedProfile?.gender === 'male'
                                            ? 'text-tichtich-primary-200'
                                            : 'text-tichtich-primary-100'
                                    )
                                )}
                                strokeWidth={2.5}
                            />
                        </div>
                    </Button>
                }
                defaultRightAction={
                    <Button className="cursor-pointer group">
                        <div className="size-10 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-150 bg-tichtich-primary-300">
                            <Bell
                                className="size-6 text-tichtich-primary-200 font-bold"
                                strokeWidth={2.5}
                            />
                        </div>
                    </Button>
                }
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

export const Route = createFileRoute('/_app/adult')({
    beforeLoad: () => {
        const { selectedProfile } = useAuthStore.getState();
        if (!selectedProfile || selectedProfile.profileType !== 'adult') {
            throw redirect({ to: '/profiles' });
        }
    },
    component: AdultAppLayout,
});
