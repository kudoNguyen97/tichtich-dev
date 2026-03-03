import { Outlet } from '@tanstack/react-router'
import { BottomNav } from './BottomNav'
import { PageTransition } from '@/components/ui/PageTransition'

export function AppLayout() {
  return (
    <div className="mobile-container bg-white">
      <main className="min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <BottomNav />
    </div>
  )
}
