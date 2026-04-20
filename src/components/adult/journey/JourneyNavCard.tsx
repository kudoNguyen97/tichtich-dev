import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface JourneyNavCardProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'tertiary';
    className?: string;
}

export function JourneyNavCard({
    label,
    onClick,
    variant = 'primary',
    className,
}: JourneyNavCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'w-full flex items-center justify-between rounded-lg px-5 py-6 transition-opacity cursor-pointer active:opacity-70',
                variant === 'primary'
                    ? 'bg-tichtich-primary-100'
                    : 'bg-tichtich-primary-300',
                className
            )}
        >
            <span className="text-sm font-bold text-tichtich-black">
                {label}
            </span>
            <ChevronRight className="w-5 h-5 text-tichtich-black shrink-0" />
        </button>
    );
}
