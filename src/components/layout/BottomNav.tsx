import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { ADULT_NAV_ITEMS, CHILD_NAV_ITEMS } from '@/constants/navItems';
import type { NavItem } from '@/constants/navItems';

export function BottomNav() {
    const { t } = useTranslation();
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;

    const isAdultPath = currentPath.startsWith('/adult');
    const navItems = isAdultPath ? ADULT_NAV_ITEMS : CHILD_NAV_ITEMS;

    function isActive(item: NavItem): boolean {
        if (item.to === '/children' || item.to === '/adult')
            return currentPath === item.to;
        return currentPath.startsWith(item.to);
    }

    return (
        <nav
            className={cn(
                'fixed bottom-0 left-1/2 z-50 -translate-x-1/2',
                'w-full max-w-[720px]',
                'rounded-t-2xl bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)]',
                'border-t border-gray-100',
                'safe-bottom'
            )}
            style={{
                paddingBottom: 'env(safe-area-inset-bottom)',
                minHeight: 'calc(72px + env(safe-area-inset-bottom))',
            }}
        >
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center gap-1.5',
                                'min-w-0 rounded-xl py-1.5',
                                'transition-colors duration-200',
                                'hover:bg-tichtich-primary-300 active:bg-tichtich-primary-300',
                                active
                                    ? 'text-tichtich-primary-200'
                                    : 'text-tichtich-black hover:text-tichtich-primary-200/80'
                            )}
                        >
                            {item.iconSrc ? (
                                <span
                                    className={cn(
                                        'inline-block size-6 shrink-0 bg-current transition-colors duration-200',
                                        'mask-contain mask-no-repeat mask-center'
                                    )}
                                    style={{
                                        maskImage: `url(${item.iconSrc})`,
                                        WebkitMaskImage: `url(${item.iconSrc})`,
                                    }}
                                />
                            ) : item.icon ? (
                                <item.icon
                                    className={cn(
                                        'size-6 shrink-0 transition-all duration-200',
                                        active ? 'stroke-[2.5]' : 'stroke-[1.8]'
                                    )}
                                />
                            ) : null}
                            <span
                                className={cn(
                                    'text-[11px] font-medium leading-tight transition-colors duration-200',
                                    active ? 'font-semibold' : ''
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
