import { cn } from '@/utils/cn'

interface AppBarProps {
  title: string
  subtitle?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  className?: string
}

export function AppBar({
  title,
  subtitle,
  leftAction,
  rightAction,
  className,
}: AppBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'max-w-[720px] mx-auto',
        'h-14 px-4',
        'border-b border-gray-200 bg-white',
        'grid grid-cols-[40px_1fr_40px] items-center',
        className
      )}
    >
      <div className="flex items-center justify-start">
        {leftAction}
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-lg font-bold font-display text-tichtich-black leading-tight truncate w-full text-center">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-surface-400 font-body truncate w-full text-center">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end">
        {rightAction}
      </div>
    </header>
  )
}