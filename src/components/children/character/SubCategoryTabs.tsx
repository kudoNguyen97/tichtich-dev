// import type { ApiCategory, ApiItemType } from '@/types/item';
import { CATEGORY_BY_KEY } from '@/constants/children/character/tabs';
import { cn } from '@/utils/cn';

interface Props {
    category: any;
    /** null khi category không có sub-tab */
    value: any;
    onChange: (s: any) => void;
}

export function SubCategoryTabs({ category, value, onChange }: Props) {
    const tabs = CATEGORY_BY_KEY[category].subTabs;
    if (tabs.length === 0) return null;

    return (
        <div
            className="grid gap-1 rounded-lg bg-[#E6D7B9] p-2"
            style={{
                gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
            }}
        >
            {tabs.map(
                ({ key, label, Icon }: { key: any; label: any; Icon: any }) => {
                    const active = key === value;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all duration-200 cursor-pointer',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                active
                                    ? 'bg-tichtich-primary-200 text-white shadow-md'
                                    : 'bg-[#E6D7B9] text-tichtich-black hover:bg-tichtich-primary-100/30 active:scale-95'
                            )}
                            aria-pressed={active}
                        >
                            {typeof Icon === 'string' ? (
                                <img
                                    src={Icon}
                                    alt={label}
                                    className="size-5"
                                />
                            ) : (
                                <Icon className="size-5" />
                            )}
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
