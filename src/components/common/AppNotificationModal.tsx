import { TichTichModal } from '@/components/common/TichTichModal';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { cn } from '@/utils/cn';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { TichTichButton } from '@/components/common/TichTichButton';

const variantConfig = {
    success: {
        icon: CheckCircle,
        iconClassName: 'text-emerald-600',
        titleClassName: 'text-tichtich-black',
    },
    error: {
        icon: XCircle,
        iconClassName: 'text-tichtich-red',
        titleClassName: 'text-tichtich-black',
    },
    info: {
        icon: Info,
        iconClassName: 'text-blue-600',
        titleClassName: 'text-tichtich-black',
    },
};

export function AppNotificationModal() {
    const { isOpen, title, description, variant, close } =
        useNotificationStore();

    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <TichTichModal
            isOpen={isOpen}
            onClose={close}
            size="lg"
            isDismissable={false}
            footer={
                <TichTichButton
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={close}
                >
                    Đóng
                </TichTichButton>
            }
        >
            <div className="flex flex-col items-center text-center gap-3">
                <Icon
                    className={cn('size-10 shrink-0', config.iconClassName)}
                    aria-hidden
                />
                <div>
                    <p
                        className={cn(
                            'text-base font-semibold',
                            config.titleClassName
                        )}
                    >
                        {title}
                    </p>
                    {description && (
                        <p className="mt-1 text-sm text-gray-600">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </TichTichModal>
    );
}
