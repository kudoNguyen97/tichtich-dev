import { AppLayout } from '@/components/layout/AppLayout'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/children')({
  component: AppLayout,
})
