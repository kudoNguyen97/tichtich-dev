import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
// import { useAuthStore } from '@/features/auth'
import { CHILD_NAV_ITEMS, PARENT_NAV_ITEMS } from '@/constants/navItems';

export function BottomNav() {
    const { t } = useTranslation();
    // const { activeProfile } = useAuthStore()
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;

    //   const navItems = activeProfile?.type === 'parent'
    //     ? PARENT_NAV_ITEMS
    //     : CHILD_NAV_ITEMS
    const navItems = CHILD_NAV_ITEMS;

    function isActive(to: string): boolean {
        // Exact match cho index routes
        if (to === '/' || to === '/parent') return currentPath === to;
        // Prefix match cho sub-routes
        return currentPath.startsWith(to);
    }

    return (
        <nav
            className={cn(
                'fixed bottom-0 left-1/2 -translate-x-1/2 z-50',
                'w-full max-w-[720px]',
                'bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl',
                'border-t border-surface-100 dark:border-surface-800',
                'safe-bottom'
            )}
            style={{ height: 'calc(64px + env(safe-area-inset-bottom))' }}
        >
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const active = isActive(item.to);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1',
                                'flex-1 h-full rounded-2xl',
                                'transition-all duration-200 pressable',
                                active
                                    ? 'text-brand-500'
                                    : 'text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300'
                            )}
                        >
                            <div
                                className={cn(
                                    'relative flex items-center justify-center',
                                    'w-10 h-6 rounded-2xl transition-all duration-300',
                                    active && 'bg-brand-50 dark:bg-brand-950/50'
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'transition-all duration-200',
                                        active
                                            ? 'size-5 stroke-[2.5]'
                                            : 'size-5 stroke-[1.8]'
                                    )}
                                />
                                {active && (
                                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    'text-[10px] font-display font-medium leading-none transition-all duration-200',
                                    active ? 'opacity-100' : 'opacity-60'
                                )}
                            >
                                {t(item.labelKey)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
