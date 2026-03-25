import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { ArrowLeft, Check } from 'lucide-react';

import { ProfileAvatar } from '@/components/profile-pin/ProfileAvatar';
import { TichTichButton } from '@/components/common/TichTichButton';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { cn } from '@/utils/cn';

export const Route = createFileRoute(
    '/_app/adult/setting/change-pin-success'
)({
    component: ChangePinSuccessPage,
});

function ChangePinSuccessPage() {
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);

    useEffect(() => {
        if (!selectedProfile || selectedProfile.profileType !== 'adult') {
            navigate({ to: '/profiles', replace: true });
        }
    }, [selectedProfile, navigate]);

    if (!selectedProfile || selectedProfile.profileType !== 'adult') {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-[url('/images/success-background.png')] bg-contain bg-center bg-no-repeat bg-tichtich-primary-300">
            <header
                className={cn(
                    'sticky top-0 z-50 mx-auto grid min-h-14 w-full max-w-[720px]',
                    'grid-cols-[40px_1fr_40px] items-center bg-tichtich-primary-300 px-4',
                    'pt-[max(0px,env(safe-area-inset-top))]'
                )}
            >
                <div className="flex items-center justify-start">
                    <Button
                        className="cursor-pointer p-2 -ml-2"
                        onPress={() =>
                            navigate({ to: '/adult/settings', replace: true })
                        }
                        aria-label="Quay lại"
                    >
                        <ArrowLeft className="size-6 text-tichtich-black" />
                    </Button>
                </div>
                <div aria-hidden className="min-w-0" />
                <div aria-hidden className="w-10" />
            </header>

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
                        navigate({ to: '/adult/settings', replace: true })
                    }
                >
                    Quay lại cài đặt
                </TichTichButton>
            </div>
        </div>
    );
}
