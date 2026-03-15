import { AppLayout } from '@/components/layout/AppLayout';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

function ChildrenAppLayout() {
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    return (
        <AppLayout
            defaultTitle="TichTich"
            defaultSubtitle={selectedProfile?.fullName}
        />
    );
}

export const Route = createFileRoute('/_app/children')({
    beforeLoad: () => {
        const { selectedProfile } = useAuthStore.getState();
        if (!selectedProfile || selectedProfile.profileType !== 'kid') {
            throw redirect({ to: '/profiles' });
        }
    },
    component: ChildrenAppLayout,
});
