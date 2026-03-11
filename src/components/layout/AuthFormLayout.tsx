import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { AppBar } from '@/components/layout/AppBar';
import { cn } from '@/utils/cn';

interface AuthFormLayoutProps {
    title: string;
    children: React.ReactNode;
    submitButton?: React.ReactNode;
    backTo?: string;
    className?: string;
}

/**
 * Layout cho các trang auth (login, register) với AppBar và NavBar cố định ở đáy.
 * NavBar chứa nút submit form.
 */
export function AuthFormLayout({
    title,
    children,
    submitButton,
    backTo = '/login',
    className,
}: AuthFormLayoutProps) {
    return (
        <>
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

            <main className={cn('flex-1 overflow-y-auto pb-24', className)}>
                {children}
            </main>

            {submitButton && (
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
                        paddingBottom:
                            'calc(12px + env(safe-area-inset-bottom))',
                    }}
                >
                    {submitButton}
                </nav>
            )}
        </>
    );
}
