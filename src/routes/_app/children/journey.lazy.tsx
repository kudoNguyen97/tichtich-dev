import { createLazyFileRoute } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';

export const Route = createLazyFileRoute('/_app/children/journey')({
    component: RouteComponent,
});

function RouteComponent() {
    const profile = useSelectedChildProfile();
    if (!profile) return null;
    return (
        <div className="px-4 py-6">
            <h2 className="text-lg font-semibold text-tichtich-black">
                Hành trình — {profile.fullName}
            </h2>
        </div>
    );
}
