import { AppLayout } from '@/components/layout/AppLayout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/children')({
    component: AppLayout,
});
