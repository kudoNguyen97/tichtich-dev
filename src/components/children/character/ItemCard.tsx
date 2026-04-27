import { Lock, Star } from 'lucide-react';
import type { ApiItem } from '@/features/items/types/item.type';
import {
    getItemImageSrc,
    getVisual,
} from '@/constants/children/character/itemVisuals';
import { cn } from '@/utils/cn';

interface Props {
    item: ApiItem;
    owned: boolean;
    equipped: boolean;
    affordable: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export function ItemCard({
    item,
    owned,
    equipped,
    affordable,
    disabled = false,
    onClick,
}: Props) {
    const visual = getVisual(item);
    const rare = item.rarity !== 'common';
    const imageSrc = item.imageUrl || getItemImageSrc(item.slug);

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'group relative flex flex-col items-center gap-0.5 rounded-lg p-4 transition-all duration-200 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100',
                equipped
                    ? 'bg-tichtich-primary-100'
                    : 'bg-[#E6D7B9] hover:bg-tichtich-primary-100/30'
            )}
            aria-label={`${item.itemName}${owned ? ', đã sở hữu' : `, giá ${item.pricePoints} sao`}${equipped ? ', đang trang bị' : ''}`}
        >
            <div
                className={cn(
                    'relative flex aspect-square w-full items-center justify-center rounded-lg bg-[#ACA290] transition',
                    rare && owned && 'ring-2 ring-yellow-400/70'
                )}
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt=""
                        className={cn(
                            'h-full w-full object-contain',
                            !owned && 'opacity-50'
                        )}
                        loading="lazy"
                    />
                ) : (
                    <span
                        className={cn(
                            'select-none transition',
                            !owned && 'opacity-50',
                            equipped && 'animate-pop'
                        )}
                    >
                        {visual.emoji}
                    </span>
                )}

                {!owned && (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex size-7 items-center justify-center rounded-full bg-[#F06724] text-white shadow-lg">
                            <Lock className="size-3.5" strokeWidth={3} />
                        </span>
                    </span>
                )}

                {/* {rare && (
                    <span className="absolute left-1 top-1 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-yellow-950 shadow">
                        {item.rarity}
                    </span>
                )} */}
            </div>

            <div className="flex w-full flex-col items-center gap-0 mt-3">
                <span
                    className={cn(
                        'line-clamp-1 text-xs font-semibold',
                        equipped ? 'text-tichtich-black' : 'text-tichtich-black'
                    )}
                >
                    {item.itemName}
                </span>
                {!owned && (
                    <span
                        className={cn(
                            'flex items-center gap-0.5 text-xs leading-none font-bold tabular-nums',
                            equipped
                                ? 'text-white'
                                : affordable
                                  ? 'text-[#F06724]'
                                  : 'text-destructive'
                        )}
                    >
                        {item.pricePoints}
                        <Star
                            className={cn(
                                'size-3',
                                equipped
                                    ? 'fill-white text-white'
                                    : 'fill-[#F06724] text-[#F06724]'
                            )}
                        />
                    </span>
                )}
            </div>
        </button>
    );
}
