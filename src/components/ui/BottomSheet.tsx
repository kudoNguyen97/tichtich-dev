import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Modal, ModalOverlay } from 'react-aria-components';
import { cn } from '@/utils/cn';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
    isDismissable?: boolean;
}

export function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
    className,
    isDismissable = false,
}: BottomSheetProps) {
    return (
        <ModalOverlay
            isOpen={isOpen}
            isDismissable={isDismissable}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            className="fixed inset-0 z-60 flex items-end justify-center bg-black/40"
        >
            <Modal
                className={cn(
                    'w-full max-w-[720px] mx-auto rounded-t-xl bg-tichtich-primary-300',
                    'shadow-[0_-4px_20px_rgba(0,0,0,0.15)]',
                    'data-entering:animate-in data-entering:slide-in-from-bottom-4 data-entering:duration-200',
                    'data-exiting:animate-out data-exiting:slide-out-to-bottom-4 data-exiting:duration-150',
                    className
                )}
            >
                <div className="relative">
                    <div className="flex items-center justify-between px-6 pt-4 pb-3">
                        <span className="flex-1 text-center text-lg font-semibold text-tichtich-black">
                            {title}
                        </span>
                        <button
                            type="button"
                            aria-label="Close"
                            className="absolute right-4 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full cursor-pointer bg-transparent text-tichtich-black"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="px-5 pb-6 pt-1">{children}</div>
                </div>
            </Modal>
        </ModalOverlay>
    );
}
