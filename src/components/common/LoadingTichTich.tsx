import { cn } from '@/utils/cn'

interface LoadingTichTichProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

const sizes = {
  sm: 'size-4 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-[3px]',
}

export function LoadingTichTich({ size = 'md', className, fullScreen }: LoadingTichTichProps) {
  const spinner = (
    <span
      className={cn(
        'rounded-full border-surface-300 border-t-brand-500 animate-spin dark:border-surface-600 dark:border-t-brand-400',
        sizes[size],
        className
      )}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-50 dark:bg-surface-950 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <LoadingTichTich size="lg" />
    </div>
  )
}
