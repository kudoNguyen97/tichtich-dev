import { createLazyFileRoute } from '@tanstack/react-router';
import { useSelectedChildProfile } from '@/hooks/useSelectedChildProfile';
import { RouteIcon } from 'lucide-react';

export const Route = createLazyFileRoute('/_app/children/_layout/journey')({
    component: RouteComponent,
});

function RouteComponent() {
    const profile = useSelectedChildProfile();
    if (!profile) return null;
    return (
        <div className="flex flex-col items-center justify-center px-6 py-12">
            <div className="size-20 rounded-full bg-tichtich-primary-200/10 flex items-center justify-center mb-4">
                <RouteIcon size={40} className="text-tichtich-primary-200" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Quản lý hành trình
            </h2>
            <p className="text-gray-600 text-center">
                Tính năng đang phát triển
            </p>
        </div>
    );
}
