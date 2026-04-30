import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from 'react-aria-components';
import { CreateKidProfileForm } from '@/components/profiles/CreateKidProfileForm';

export const Route = createFileRoute(
    '/_app/adult/setting/_layout/create-profile'
)({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    return (
        <CreateKidProfileForm
            appBarLeftAction={
                <Button
                    onPress={() => navigate({ to: '/adult/settings' })}
                    className="-ml-2 cursor-pointer p-2"
                >
                    <ArrowLeft className="size-6 text-tichtich-black" />
                </Button>
            }
        />
    );
}
