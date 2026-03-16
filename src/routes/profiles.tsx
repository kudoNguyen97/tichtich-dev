import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import type { Profile } from '@/features/auth/types/auth.type';
import { authService } from '@/features/auth/api/auth.service';
import { LoadingTichTich } from '@/components/common/LoadingTichTich';

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
    const setProfiles = useAuthStore((s) => s.setProfiles);
    const clearSelectedProfile = useAuthStore((s) => s.clearSelectedProfile);

    const { data: profiles = [], isLoading } = useQuery({
        queryKey: ['meProfiles'],
        queryFn: async () => {
            const res = await authService.meProfiles();

            return res;
        },
    });

    useEffect(() => {
        clearSelectedProfile();
        if (profiles.length > 0) {
            setProfiles(profiles);
        }
    }, [profiles, setProfiles, clearSelectedProfile]);

    const handleSelect = (profile: Profile) => {
        navigate({
            to: '/profile-pin',
            search: { profileId: profile.id },
        });
    };

    return (
        <div className="flex min-h-full flex-1 flex-col bg-[url('/images/background-illustration-desktop.png')] bg-cover bg-center">
            {isLoading && <LoadingTichTich isLoading={isLoading} />}
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
