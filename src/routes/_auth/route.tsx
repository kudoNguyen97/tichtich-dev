import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthShell,
  beforeLoad: async () => {
    throw redirect({ to: '/login' });
  },
})

function AuthShell() {
  return  <div className="mobile-container">
        <Outlet />
      </div>
}
