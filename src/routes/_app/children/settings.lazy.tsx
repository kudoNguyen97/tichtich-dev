import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/children/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/children/settings"!</div>
}
