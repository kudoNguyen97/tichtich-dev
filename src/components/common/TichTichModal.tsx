/**
 * Modal Component
 * Built on react-aria Dialog + ModalOverlay
 * Sizes: sm | md | lg | full
 */

import {
    Modal as AriaModal,
    ModalOverlay,
    Dialog,
    Heading,
} from 'react-aria-components';
import type { DialogProps } from 'react-aria-components';
import { cn } from '@/utils/cn';

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {string} [props.title]
 * @param {'sm'|'md'|'lg'|'full'} [props.size='md']
 * @param {boolean} [props.isDismissable=true]
 * @param {React.ReactNode} [props.children]
 * @param {React.ReactNode} [props.footer]
 * @param {string} [props.className]
 */

interface TichTichModalProps extends DialogProps {
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    isDismissable?: boolean;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function TichTichModal({
    isOpen,
    onClose,
    title,
    size = 'md',
    isDismissable = true,
    children,
    footer,
    className,
    ...props
}: TichTichModalProps) {
    const sizeClass = {
        sm: 'max-w-xs',
        md: 'max-w-sm',
        lg: 'max-w-lg',
        full: 'max-w-full mx-4',
    }[size];

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose?.()}
            isDismissable={isDismissable}
            className={({ isEntering, isExiting }) =>
                cn(
                    'fixed inset-0 z-50 flex items-center justify-center',
                    'bg-black/40 backdrop-blur-[2px]',
                    isEntering && 'animate-in fade-in duration-200',
                    isExiting && 'animate-out fade-out duration-150'
                )
            }
        >
            <AriaModal
                className={({ isEntering, isExiting }) =>
                    cn(
                        'w-full',
                        sizeClass,
                        isEntering &&
                            'animate-in zoom-in-95 fade-in duration-200',
                        isExiting &&
                            'animate-out zoom-out-95 fade-out duration-150'
                    )
                }
            >
                <Dialog
                    className={cn(
                        'relative mx-4 rounded-2xl bg-tichtich-primary-300 shadow-modal outline-none',
                        'flex flex-col',
                        className
                    )}
                    {...props}
                >
                    {title && (
                        <div className="px-6 pt-6 pb-2 text-center">
                            <Heading
                                slot="title"
                                className="text-base font-semibold text-tichtich-black"
                            >
                                {title}
                            </Heading>
                        </div>
                    )}

                    <div className="flex-1 px-6 py-4 text-sm text-gray-700">
                        {children}
                    </div>

                    {footer && (
                        <div className="flex items-center gap-3 px-6 pb-6 pt-2">
                            {footer}
                        </div>
                    )}
                </Dialog>
            </AriaModal>
        </ModalOverlay>
    );
}

/**
 * ConfirmModal — two-button confirmation pattern (seen in design: "Bạn muốn đăng xuất?")
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onConfirm
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.cancelLabel='Đóng']
 * @param {string} [props.confirmLabel='Xác nhận']
 * @param {'primary'|'danger'} [props.confirmVariant='primary']
 * @param {boolean} [props.isLoading]
 */

interface TichTichConfirmModalProps extends TichTichModalProps {
    title?: string;
    description?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    confirmVariant?: 'primary' | 'danger';
    isLoading?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
}

export function TichTichConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Bạn có chắc không?',
    description,
    cancelLabel = 'Đóng',
    confirmLabel = 'Xác nhận',
    confirmVariant = 'primary',
    isLoading = false,
}: TichTichConfirmModalProps) {
    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={() => onClose?.()}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className={cn(
                            'flex-1 h-12 rounded-full border-2 border-tichtich-black',
                            'bg-white text-sm font-semibold text-tichtich-black',
                            'transition-all active:scale-[0.97] cursor-pointer'
                        )}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            'flex-1 h-12 rounded-full text-sm font-semibold',
                            'transition-all active:scale-[0.97] cursor-pointer border-none',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            confirmVariant === 'danger'
                                ? 'bg-tichtich-red text-white hover:brightness-110'
                                : 'bg-tichtich-primary-200 text-white hover:brightness-110'
                        )}
                    >
                        {isLoading ? (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </>
            }
        >
            {description && (
                <p className="text-center text-sm text-gray-600">
                    {description}
                </p>
            )}
        </TichTichModal>
    );
}
