import { ProfileAvatar } from '@/components/profile-pin/ProfileAvatar';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { TichTichButton } from '@/components/common/TichTichButton';

export const Route = createLazyFileRoute('/create-success')({
    component: CreateSuccessPage,
});

function CreateSuccessPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) navigate({ to: '/login', replace: true });
        else if (!selectedProfile) navigate({ to: '/profiles', replace: true });
    }, [isAuthenticated, selectedProfile, navigate]);

    if (!selectedProfile) return null;

    const handleContinue = () => {
        const target =
            selectedProfile.profileType === 'adult' ? '/adult' : '/children';
        navigate({ to: target, replace: true });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[url('/images/success-background.png')] bg-no-repeat bg-contain bg-tichtich-primary-300 bg-center p-5">
            <div className="flex flex-1 flex-col items-center justify-start mt-6">
                <ProfileAvatar profile={selectedProfile} size="sm" />
                <p className="text-center text-base font-medium text-tichtich-black mt-2 mb-4">
                    {selectedProfile.fullName}
                </p>
                <p className="text-[32px] font-bold text-center">
                    Tạo mã PIN thành công!
                </p>
                <div className="flex flex-col items-center justify-center w-[109px] h-[109px] bg-tichtich-primary-100 rounded-full mt-10">
                    <Check className="size-16 font-bold text-tichtich-primary-200" />
                </div>
            </div>
            <div className="pb-8 pt-4 px-4">
                <TichTichButton size="lg" fullWidth onPress={handleContinue}>
                    {t('profilePin.continue')}
                </TichTichButton>
            </div>
        </div>
    );
}
