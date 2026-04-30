import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from 'react-aria-components';
import { CreateKidProfileForm } from '@/components/profiles/CreateKidProfileForm';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const Route = createFileRoute('/create-profile')({
    beforeLoad: () => {
        const { isAuthenticated, profiles } = useAuthStore.getState();
        if (!isAuthenticated) {
            throw redirect({ to: '/login' });
        }
        if (profiles.some((p) => p.profileType === 'kid')) {
            throw redirect({ to: '/profiles' });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const handleBack = () => {
        // logoutMutate(undefined, {
        //     onSuccess: () => navigate({ to: '/login', replace: true }),
        // });
        logout();
        navigate({ to: '/login' });
    };

    return (
        <CreateKidProfileForm
            appBarLeftAction={
                <Button
                    onPress={handleBack}
                    className="-ml-2 cursor-pointer p-2"
                >
                    <ArrowLeft className="size-6 text-tichtich-black" />
                </Button>
            }
            onCreateSuccess={() => navigate({ to: '/profiles', replace: true })}
        />
    );
}
