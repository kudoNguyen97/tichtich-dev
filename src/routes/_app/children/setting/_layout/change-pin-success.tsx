import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { ArrowLeft, Check } from 'lucide-react';

import { TichTichButton } from '@/components/common/TichTichButton';
import { AppBar } from '@/components/layout/AppBar';
import { ProfileAvatar } from '@/components/profile-pin/ProfileAvatar';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute(
    '/_app/children/setting/_layout/change-pin-success'
)({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);

    useEffect(() => {
        if (!selectedProfile || selectedProfile.profileType !== 'kid') {
            navigate({ to: '/profiles', replace: true });
        }
    }, [selectedProfile, navigate]);

    if (!selectedProfile || selectedProfile.profileType !== 'kid') {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-[url('/images/adult/success-background.png')] bg-contain bg-center bg-no-repeat bg-tichtich-primary-300">
            <AppBar
                title="Đổi mã PIN"
                subtitle=""
                leftAction={
                    <Button
                        onPress={() => navigate({ to: '/children/settings' })}
                        className="-ml-2 cursor-pointer p-2"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </Button>
                }
                rightAction={null}
                className="border-b border-tichtich-primary-200 bg-tichtich-primary-300 shadow-none"
            />

            <div className="flex flex-1 flex-col items-center justify-start px-5 pb-8 pt-6">
                <ProfileAvatar profile={selectedProfile} size="sm" />
                <p className="mb-4 mt-2 text-center text-base font-medium text-tichtich-black">
                    {selectedProfile.fullName}
                </p>
                <p className="mb-10 text-center text-[32px] font-bold text-tichtich-black">
                    Đổi mã PIN thành công!
                </p>
                <div className="flex h-[109px] w-[109px] flex-col items-center justify-center rounded-full bg-tichtich-primary-100">
                    <Check className="size-16 font-bold text-tichtich-primary-200" />
                </div>
            </div>
            <div className="px-5 pb-8 pt-4">
                <TichTichButton
                    variant="outline"
                    size="lg"
                    fullWidth
                    onPress={() =>
                        navigate({ to: '/children/settings', replace: true })
                    }
                >
                    Quay lại cài đặt
                </TichTichButton>
            </div>
        </div>
    );
}
