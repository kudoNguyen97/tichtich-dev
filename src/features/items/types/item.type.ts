export type ItemCategory = 'clothing' | 'shoes' | 'accessory' | 'fashion_set';
export type ItemType =
    | 'tops'
    | 'bottoms'
    | 'hat'
    | 'eyewear'
    | 'necklace'
    | 'bracelet';

export type EquipSlot = ItemType | 'shoes' | 'fashion_set';

export interface Item {
    id: string;
    itemName: string;
    slug: string;
    itemType: string | null;
    category: ItemCategory;
    pricePoints: number;
    rarity: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    isUnlocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetItemsParams {
    category: ItemCategory;
    itemType?: string;
    profileId?: string;
}

export interface EquippedItemRecord {
    id: string;
    profileId: string;
    item: Item;
    itemType: string;
    equippedAt: string;
    updatedAt: string;
}

export interface PurchaseItemPayload {
    itemId: string;
    quantity: number;
}

export interface PurchaseItemData {
    id: string;
    profileId: string;
    item: Item;
    quantity: number;
    purchasedAt: string;
}

export interface EquipItemPayload {
    itemId: string;
}

export interface EquipItemData {
    id: string;
    profileId: string;
    item: Item;
    itemType: string;
    equippedAt: string;
    updatedAt: string;
}

export interface UnequipItemPayload {
    itemType: string;
}

// Keep aliases to match current character route naming.
export type ApiCategory = ItemCategory;
export type ApiItem = Item;
