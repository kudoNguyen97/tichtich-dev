import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/landing-page-demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/landing-page-demo"!</div>
}
