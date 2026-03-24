import { Switch } from 'react-aria-components';

import { cn } from '@/utils/cn';

export type TichTichNotificationSwitchCardProps = {
    label: string;
    value?: string;
    isSelected: boolean;
    onChange: (isSelected: boolean) => void;
    className?: string;
};

export function TichTichNotificationSwitchCard({
    label,
    value,
    isSelected,
    onChange,
    className,
}: TichTichNotificationSwitchCardProps) {
    return (
        <Switch
            isSelected={isSelected}
            onChange={onChange}
            className={cn(
                'group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-tichtich-primary-300 px-5 py-4 outline-none',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-tichtich-primary-200',
                className
            )}
        >
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <span className="text-sm font-medium text-tichtich-black/60">
                    {label}
                </span>
                {value !== undefined && value !== '' && (
                    <span className="text-base font-bold text-tichtich-black">
                        {value}
                    </span>
                )}
            </span>
            <span
                className={cn(
                    'inline-flex h-8 w-14 shrink-0 items-center rounded-full bg-neutral-300 px-0.5 transition-colors',
                    'group-data-selected:bg-tichtich-primary-200'
                )}
                aria-hidden
            >
                <span
                    className={cn(
                        'pointer-events-none size-7 rounded-full bg-white shadow-sm transition-[margin] duration-200 ease-out',
                        'group-data-selected:ml-auto'
                    )}
                />
            </span>
        </Switch>
    );
}
