import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { BottomNav } from './BottomNav';
import { PageTransition } from '@/components/ui/PageTransition';
import { AppBar } from '@/components/layout/AppBar';
import { cn } from '@/utils/cn';

export interface AppBarConfig {
    title?: string;
    subtitle?: string;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    /** ClassName gộp thêm cho `<AppBar />` (ví dụ viền brand) */
    appBarClassName?: string;
}

export interface AppLayoutOutletContext {
    setAppBar: (config: AppBarConfig) => void;
}

const AppLayoutContext = createContext<AppLayoutOutletContext | null>(null);

interface AppLayoutProps {
    defaultTitle?: string;
    defaultSubtitle?: string;
    defaultLeftAction?: React.ReactNode;
    defaultRightAction?: React.ReactNode;
    className?: string;
    appLayoutClassName?: string;
}

const DEFAULT_TITLE = 'TichTich';

/** Các route con tự gọi `setAppBar` — không reset app bar theo default khi đổi pathname trong nhánh này (tránh ghi đè sau effect của trang con / sau reload). */
const PATH_CHILD_MANAGES_APP_BAR = /^\/adult\/setting\//;

/** Màn tự vẽ header trong page — không render `<AppBar />` toàn cục. */
const PATH_HIDE_GLOBAL_APP_BAR =
    /^\/adult\/setting\/change-pin(?:-success)?\/?$/;

export function AppLayout({
    defaultTitle = DEFAULT_TITLE,
    defaultSubtitle,
    defaultLeftAction,
    defaultRightAction,
    className,
    appLayoutClassName,
}: AppLayoutProps) {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const hideGlobalAppBar = PATH_HIDE_GLOBAL_APP_BAR.test(pathname);
    const hideBottomNav =
        pathname === '/adult/information' ||
        pathname.startsWith('/adult/information/') ||
        pathname.startsWith('/adult/setting/');

    const [title, setTitle] = useState(defaultTitle);
    const [subtitle, setSubtitle] = useState(defaultSubtitle ?? '');
    const [leftAction, setLeftAction] =
        useState<React.ReactNode>(defaultLeftAction);
    const [rightAction, setRightAction] =
        useState<React.ReactNode>(defaultRightAction);
    const [appBarClassName, setAppBarClassName] = useState<string | undefined>();

    useEffect(() => {
        if (PATH_CHILD_MANAGES_APP_BAR.test(pathname)) {
            return;
        }
        setTitle(defaultTitle);
        setSubtitle(defaultSubtitle ?? '');
        setLeftAction(defaultLeftAction);
        setRightAction(defaultRightAction);
        setAppBarClassName(undefined);
    }, [
        pathname,
        defaultTitle,
        defaultSubtitle,
        defaultLeftAction,
        defaultRightAction,
    ]);

    const setAppBar = useCallback((config: AppBarConfig) => {
        if (config.title !== undefined) setTitle(config.title);
        if (config.subtitle !== undefined) setSubtitle(config.subtitle);
        if (config.leftAction !== undefined) setLeftAction(config.leftAction);
        if (config.rightAction !== undefined)
            setRightAction(config.rightAction);
        if (config.appBarClassName !== undefined)
            setAppBarClassName(config.appBarClassName);
    }, []);

    return (
        <AppLayoutContext.Provider value={{ setAppBar }}>
            {!hideGlobalAppBar && (
                <AppBar
                    title={title}
                    subtitle={subtitle || undefined}
                    leftAction={leftAction}
                    rightAction={rightAction}
                    className={cn(className, appBarClassName)}
                />
            )}
            <div
                className={cn(
                    'mobile-container bg-white',
                    hideBottomNav ? 'mb-0' : appLayoutClassName
                )}
            >
                <main className="min-h-screen">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
                {!hideBottomNav && <BottomNav />}
            </div>
        </AppLayoutContext.Provider>
    );
}

export function useAppLayoutContext(): AppLayoutOutletContext {
    const ctx = useContext(AppLayoutContext);
    if (!ctx) {
        throw new Error('useAppLayoutContext must be used within AppLayout');
    }
    return ctx;
}
