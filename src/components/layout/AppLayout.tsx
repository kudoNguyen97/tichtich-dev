import { Outlet } from '@tanstack/react-router';
import { BottomNav } from './BottomNav';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from 'react-aria-components';
import { AppBar } from '@/components/layout/AppBar';

export function AppLayout() {
    return (
        <>
            <AppBar
                leftAction={<Button>Add</Button>}
                title="TichTich"
                subtitle="TichTich"
                rightAction={<Button>Add</Button>}
            />
            <div className="mobile-container bg-white">
                <main className="min-h-screen">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
                <BottomNav />
            </div>
        </>
    );
}
