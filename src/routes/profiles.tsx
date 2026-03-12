import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import type { Profile } from '@/features/auth/types/auth.type';

export const Route = createFileRoute('/profiles')({
    component: ProfilesPage,
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: '/login' });
        }
    },
});

function ProfilesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const profiles = useAuthStore((s) => s.profiles);
    const setSelectedProfile = useAuthStore((s) => s.setSelectedProfile);

    const handleSelect = (profile: Profile) => {
        setSelectedProfile(profile);
        navigate({ to: '/profile-pin' });
    };

    return (
        <div className="flex min-h-full flex-1 flex-col bg-[url('/images/background-illustration-desktop.png')] bg-cover bg-center">
            <div className="px-4 pt-8 pb-6">
                <h1 className="text-center text-xl font-bold text-tichtich-black">
                    {t('profiles.title')}
                </h1>
                <p className="mt-2 text-center text-sm font-medium text-tichtich-black/80">
                    {t('profiles.subtitle')}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                    {profiles.map((profile) => (
                        <ProfileCard
                            key={profile.id}
                            profile={profile}
                            onSelect={() => handleSelect(profile)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
