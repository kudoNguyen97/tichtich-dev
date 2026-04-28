import { useMutation, useQuery } from '@tanstack/react-query';
import { itemKeys } from '@/features/items/api/item.keys';
import { itemService } from '@/features/items/api/item.service';
import type {
    EquipItemData,
    EquipItemPayload,
    EquippedItemRecord,
    GetItemsParams,
    Item,
    PurchaseItemData,
    PurchaseItemPayload,
    UnequipItemPayload,
} from '@/features/items/types/item.type';
import { rewardPointKeys } from '@/features/reward-points/api/rewardPoint.keys';
import { queryClient } from '@/lib/queryClient';
import { showError } from '@/lib/toast';

export function itemsQueryOptions(params: GetItemsParams) {
    return {
        queryKey: itemKeys.list(params),
        queryFn: () => itemService.getItems(params),
        enabled: !!params.category,
    };
}

export function useItems(params: GetItemsParams) {
    return useQuery(itemsQueryOptions(params));
}

export function useEquippedItems(profileId: string) {
    return useQuery({
        queryKey: itemKeys.equippedListByProfileId(profileId),
        queryFn: () => itemService.getEquippedItems(profileId),
        meta: {
            globalLoading: true,
        },
        enabled: Boolean(profileId),
    });
}

export function usePurchaseItem(profileId: string) {
    return useMutation<PurchaseItemData, Error, PurchaseItemPayload>({
        mutationFn: (payload) => itemService.purchase(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: itemKeys.equippedListByProfileId(profileId),
            });
            queryClient.invalidateQueries({
                queryKey: rewardPointKeys.byProfileId(profileId),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export function useEquipItem(profileId: string) {
    return useMutation<EquipItemData, Error, EquipItemPayload>({
        mutationFn: (payload) => itemService.equip(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: itemKeys.equippedListByProfileId(profileId),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export function useUnequipItem(profileId: string) {
    return useMutation<void, Error, UnequipItemPayload>({
        mutationFn: (payload) => itemService.unequip(profileId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: itemKeys.equippedListByProfileId(profileId),
            });
        },
        onError: (error) => {
            showError(error);
        },
    });
}

export type { Item, EquippedItemRecord };
