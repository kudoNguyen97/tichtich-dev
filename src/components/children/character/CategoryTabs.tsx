// import type { ApiCategory } from '@/types/item';
import { CATEGORY_TABS } from '@/constants/children/character/tabs';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface Props {
    value: any;
    onChange: (c: any) => void;
}

export function CategoryTabs({ value, onChange }: Props) {
    return (
        <div className="grid grid-cols-4 gap-1 rounded-lg bg-tichtich-primary-300 p-1">
            {CATEGORY_TABS.map(
                ({
                    key,
                    label,
                    Icon,
                }: {
                    key: string;
                    label: string;
                    Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
                }) => {
                    const active = key === value;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg p-3 transition-all duration-200 cursor-pointer',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                active
                                    ? 'bg-tichtich-primary-200 text-white scale-[1.03]'
                                    : 'text-tichtich-black hover:bg-tichtich-primary-100/30 active:scale-95'
                            )}
                            aria-pressed={active}
                        >
                            <Icon
                                className={cn(
                                    'size-6',
                                    active
                                        ? 'text-white'
                                        : 'text-tichtich-black'
                                )}
                            />
                            <span className="text-xs font-semibold">
                                {label}
                            </span>
                        </button>
                    );
                }
            )}
        </div>
    );
}
