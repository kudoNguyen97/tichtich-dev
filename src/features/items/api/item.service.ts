import { apiClient } from '@/lib/apiClient';
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

function profileHeader(profileId: string) {
    return {
        headers: {
            'x-profile-id': profileId,
        },
    };
}

export const itemService = {
    getItems: (params: GetItemsParams) =>
        apiClient.get<Item[]>('/items', {
            params: {
                category: params.category,
                ...(params.itemType ? { itemType: params.itemType } : {}),
            },
            ...(params.profileId ? { headers: { 'x-profile-id': params.profileId } } : {}),
        }),

    getEquippedItems: (profileId: string) =>
        apiClient.get<EquippedItemRecord[]>('/items/equipped', profileHeader(profileId)),

    purchase: (profileId: string, payload: PurchaseItemPayload) =>
        apiClient.post<PurchaseItemData>('/items/purchase', payload, profileHeader(profileId)),

    equip: (profileId: string, payload: EquipItemPayload) =>
        apiClient.post<EquipItemData>('/items/equip', payload, profileHeader(profileId)),

    unequip: (profileId: string, payload: UnequipItemPayload) =>
        apiClient.post<void>('/items/unequip', payload, profileHeader(profileId)),
};
