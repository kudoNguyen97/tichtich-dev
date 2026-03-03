import type { CSSProperties } from 'react';
import {
    UNSTABLE_ToastRegion as ToastRegion,
    UNSTABLE_Toast as Toast,
    UNSTABLE_ToastQueue as ToastQueue,
    UNSTABLE_ToastContent as ToastContent,
    Button,
    Text,
} from 'react-aria-components';
import type { ToastProps } from 'react-aria-components';
import { X } from 'lucide-react';
import { flushSync } from 'react-dom';
import { cn } from '@/utils/cn';

type ToastVariant = 'success' | 'error' | 'info';

export interface ToastContent {
    title: string;
    description?: string;
    variant?: ToastVariant;
}

export const toastQueue = new ToastQueue<ToastContent>({
    wrapUpdate(fn) {
        if ('startViewTransition' in document) {
            document.startViewTransition(() => flushSync(fn));
        } else {
            fn();
        }
    },
});

const variantStyles: Record<ToastVariant, string> = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
};

export function AppToastRegion() {
    return (
        <ToastRegion
            queue={toastQueue}
            className="fixed bottom-4 right-4 z-1000 flex flex-col-reverse gap-2 outline-none focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
        >
            {({ toast }) => (
                <AppToast toast={toast}>
                    <ToastContent className="flex min-w-0 flex-1 flex-col">
                        <Text
                            slot="title"
                            className="text-sm font-semibold text-white"
                        >
                            {toast.content.title}
                        </Text>
                        {toast.content.description && (
                            <Text
                                slot="description"
                                className="text-xs text-white/80"
                            >
                                {toast.content.description}
                            </Text>
                        )}
                    </ToastContent>
                    <Button
                        slot="close"
                        aria-label="Close"
                        className="flex size-8 flex-none cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-0 text-white outline-none hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 pressed:bg-white/15"
                    >
                        <X className="size-4" />
                    </Button>
                </AppToast>
            )}
        </ToastRegion>
    );
}

function AppToast(props: ToastProps<ToastContent>) {
    const variant = props.toast.content.variant ?? 'info';
    return (
        <Toast
            {...props}
            style={{ viewTransitionName: props.toast.key } as CSSProperties}
            className={cn(
                'flex w-[280px] items-center gap-3 rounded-lg px-4 py-3 font-sans outline-none [view-transition-class:toast] focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2',
                variantStyles[variant]
            )}
        />
    );
}
