import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/children/character')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/children/character"!</div>
}
