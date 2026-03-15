import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_app/adult/treasury')({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_app/adult/treasury"!</div>;
}
