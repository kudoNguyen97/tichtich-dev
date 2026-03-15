import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_app/adult/character')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_app/adult/character"!</div>;
}
