import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { Outlet } from '@tanstack/react-router';
import { BottomNav } from './BottomNav';
import { PageTransition } from '@/components/ui/PageTransition';
import { AppBar } from '@/components/layout/AppBar';

export interface AppBarConfig {
    title?: string;
    subtitle?: string;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
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
}

const DEFAULT_TITLE = 'TichTich';

export function AppLayout({
    defaultTitle = DEFAULT_TITLE,
    defaultSubtitle,
    defaultLeftAction,
    defaultRightAction,
    className,
}: AppLayoutProps) {
    const [title, setTitle] = useState(defaultTitle);
    const [subtitle, setSubtitle] = useState(defaultSubtitle ?? '');
    const [leftAction, setLeftAction] =
        useState<React.ReactNode>(defaultLeftAction);
    const [rightAction, setRightAction] =
        useState<React.ReactNode>(defaultRightAction);

    useEffect(() => {
        setTitle(defaultTitle);
        setSubtitle(defaultSubtitle ?? '');
        setLeftAction(defaultLeftAction);
        setRightAction(defaultRightAction);
    }, [defaultTitle, defaultSubtitle, defaultLeftAction, defaultRightAction]);

    const setAppBar = useCallback((config: AppBarConfig) => {
        if (config.title !== undefined) setTitle(config.title);
        if (config.subtitle !== undefined) setSubtitle(config.subtitle);
        if (config.leftAction !== undefined) setLeftAction(config.leftAction);
        if (config.rightAction !== undefined)
            setRightAction(config.rightAction);
    }, []);

    return (
        <AppLayoutContext.Provider value={{ setAppBar }}>
            <AppBar
                title={title}
                subtitle={subtitle || undefined}
                leftAction={leftAction}
                rightAction={rightAction}
                className={className}
            />
            <div className="mobile-container bg-white">
                <main className="min-h-screen">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
                <BottomNav />
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
