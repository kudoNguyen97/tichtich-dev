import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { cn } from '@/utils/cn';

// ─── Subcomponents ────────────────────────────────────────────────────────────

interface AuthFormAppBarProps {
    title: string;
    backTo?: string;
    className?: string;
}

function AuthFormAppBar({ title, backTo = '/login', className }: AuthFormAppBarProps) {
    return (
        <AppBar
            title={title}
            leftAction={
                <Link
                    to={backTo}
                    className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                    aria-label="Quay lại"
                >
                    <ArrowLeft className="size-5 text-tichtich-black" />
                </Link>
            }
            className={className}
        />
    );
}

interface AuthFormContentProps {
    children: React.ReactNode;
    className?: string;
}

function AuthFormContent({ children, className }: AuthFormContentProps) {
    return (
        <main className={cn('flex-1 overflow-y-auto pb-24', className)}>
            {children}
        </main>
    );
}

interface AuthFormFooterProps {
    children: React.ReactNode;
    className?: string;
}

function AuthFormFooter({ children, className }: AuthFormFooterProps) {
    return (
        <nav
            className={cn(
                'fixed bottom-0 left-1/2 z-50 -translate-x-1/2',
                'w-full max-w-[720px] px-4 pb-3 pt-6',
                'bg-white/95 backdrop-blur-sm',
                'border-t border-gray-200',
                'safe-bottom',
                className
            )}
            style={{
                paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
            }}
        >
            {children}
        </nav>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface AuthFormLayoutProps {
    children: React.ReactNode;
}

/**
 * Compound layout for auth pages (login, register, profile-pin).
 *
 * Usage:
 * ```tsx
 * <AuthFormLayout>
 *   <AuthFormLayout.AppBar title="Register" backTo="/login" />
 *   <AuthFormLayout.Content>
 *     <form>...</form>
 *   </AuthFormLayout.Content>
 *   <AuthFormLayout.Footer>
 *     <TichTichButton>Submit</TichTichButton>
 *   </AuthFormLayout.Footer>
 * </AuthFormLayout>
 * ```
 */
function AuthFormLayoutRoot({ children }: AuthFormLayoutProps) {
    return <>{children}</>;
}

export const AuthFormLayout = Object.assign(AuthFormLayoutRoot, {
    AppBar: AuthFormAppBar,
    Content: AuthFormContent,
    Footer: AuthFormFooter,
});
