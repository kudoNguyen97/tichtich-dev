import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ProfileCard } from '@/components/profiles/ProfileCard';
import type { Profile } from '@/features/profiles/types';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/profiles')({
    component: ProfilesPage,
    beforeLoad: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: '/login' });
        }
    },
});

const MOCK_PROFILES: Profile[] = [
    { id: '1', name: 'Trần Quang Huy', type: 'parent' },
    { id: '2', name: 'Trần Quốc Bảo', type: 'boy' },
    { id: '3', name: 'Trần Tuệ Mẫn', type: 'girl' },
    { id: '4', name: 'Trần Gia Phúc', type: 'boy' },
];

function ProfilesPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
                    {MOCK_PROFILES.map((profile) => (
                        <ProfileCard
                            key={profile.id}
                            profile={profile}
                            onSelect={() => {
                                console.log(profile);
                                navigate({ to: '/profile-pin' });
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
