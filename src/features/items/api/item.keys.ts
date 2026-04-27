import type { GetItemsParams } from '@/features/items/types/item.type';

export const itemKeys = {
    all: ['items'] as const,
    lists: () => [...itemKeys.all, 'list'] as const,
    list: (params: GetItemsParams) =>
        [...itemKeys.lists(), params.category, params.itemType ?? 'all', params.profileId ?? ''] as const,
    equippedLists: () => [...itemKeys.all, 'equipped'] as const,
    equippedListByProfileId: (profileId: string) =>
        [...itemKeys.equippedLists(), profileId] as const,
};
