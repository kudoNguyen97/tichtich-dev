import type { ApiItem, EquipSlot } from '@/features/items/types/item.type';

export interface Visual {
    emoji: string;
    color: string;
}

export const VISUAL_BY_SLUG: Partial<Record<string, Visual>> = {
    // Tops
    clothing_top_ao_den_uwu: { emoji: '🖤', color: '#222222' },
    clothing_top_ao_graffiti: { emoji: '🎨', color: '#9C27B0' },
    clothing_top_ao_soc_thuy_thu: { emoji: '👕', color: '#3B5BA5' },
    clothing_top_ao_hoodie_xanh: { emoji: '🧥', color: '#1976D2' },
    clothing_top_ao_vang_mua_he: { emoji: '🌞', color: '#FFC107' },
    clothing_top_ao_yem_jeans: { emoji: '👖', color: '#3F51B5' },

    // Shoes
    shoes_giay_dong_xu: { emoji: '🪙', color: '#FFD700' },
    shoes_giay_bale: { emoji: '🩰', color: '#F8BBD0' },
    shoes_giay_bata_vang: { emoji: '👟', color: '#FFEB3B' },
    shoes_giay_boot_ngau: { emoji: '🥾', color: '#5D4037' },
    shoes_giay_converse_cam: { emoji: '👟', color: '#FF5722' },

    // Accessory hat
    accessories_hat_non_dau: { emoji: '🍓', color: '#E63946' },
    accessories_hat_non_tai_meo: { emoji: '🐱', color: '#5D9CEC' },

    // Fashion sets
    fashion_set_chi_hang: { emoji: '🌕', color: '#FFD54F' },
    fashion_set_chu_cuoi: { emoji: '🌳', color: '#66BB6A' },
    fashion_set_ao_dai_do: { emoji: '👘', color: '#D32F2F' },
    fashion_set_vay_noel_nu: { emoji: '🎄', color: '#C62828' },
    fashion_set_noel_nam: { emoji: '🎅', color: '#B71C1C' },
    fashion_set_vay_xinh_sinh_nhat: { emoji: '🎂', color: '#EC407A' },
    fashion_set_ao_dau_lan: { emoji: '🦁', color: '#FB8C00' },
    fashion_set_harry_potter: { emoji: '⚡', color: '#4A148C' },
    fashion_set_heo_superman: { emoji: '🦸', color: '#1565C0' },
    fashion_set_heo_wonder_woman: { emoji: '💫', color: '#AD1457' },
    fashion_set_hiep_si_vang: { emoji: '🛡️', color: '#FFB300' },
    fashion_set_hiep_si_xanh: { emoji: '🛡️', color: '#039BE5' },
};

/** Fallback visual theo slot khi slug không match */
export const FALLBACK_BY_SLOT: Record<string, Visual> = {
    tops: { emoji: '👕', color: '#3B5BA5' },
    bottoms: { emoji: '👖', color: '#4A6FA5' },
    shoes: { emoji: '👟', color: '#A0673B' },
    hat: { emoji: '🎩', color: '#E63946' },
    eyewear: { emoji: '🕶️', color: '#222222' },
    necklace: { emoji: '📿', color: '#F0E5D8' },
    bracelet: { emoji: '⌚', color: '#222222' },
    fashion_set: { emoji: '💎', color: '#9C27B0' },
};

// const IMAGE_BY_SLUG: Partial<Record<string, string>> = {
//     clothing_top_ao_den_uwu:
//         '/src/assets/icons/items/clothings/shirt-top/uwu.svg?react',
//     clothing_top_ao_graffiti:
//         '/src/assets/icons/items/clothings/shirt-top/graffiti.svg?react',
//     clothing_top_ao_soc_thuy_thu:
//         '/src/assets/icons/items/clothings/shirt-top/sailor.svg?react',
//     clothing_top_ao_hoodie_xanh:
//         '/src/assets/icons/items/clothings/shirt-top/hoodie-blue.svg?react',
//     clothing_top_ao_vang_mua_he:
//         '/src/assets/icons/items/clothings/shirt-top/yellow-summer.svg?react',
//     clothing_top_ao_yem_jeans:
//         '/src/assets/icons/items/clothings/shirt-top/jeans.svg?react',
//     clothing_bottom_vay_pickleball:
//         '/src/assets/icons/items/clothings/trousers/pickleball.svg?react',
//     clothing_bottom_vay_jean_ngan:
//         '/src/assets/icons/items/clothings/trousers/short-jeans.svg?react',
//     clothing_bottom_vay_xoe_hong:
//         '/src/assets/icons/items/clothings/trousers/flared-pink.svg?react',
//     clothing_bottom_quan_keo_xanh:
//         '/src/assets/icons/items/clothings/trousers/blue-candy.svg?react',
//     clothing_bottom_quan_ran_ri:
//         '/src/assets/icons/items/clothings/trousers/ranri.svg?react',
//     clothing_bottom_quan_xanh_mua_he:
//         '/src/assets/icons/items/clothings/trousers/cold-blue.svg?react',
//     clothing_bottom_quan_den_ngau:
//         '/src/assets/icons/items/clothings/trousers/cool-black.svg?react',
//     shoes_giay_dong_xu: '/src/assets/icons/items/shoes/dimple.svg?react',
//     shoes_giay_bale: '/src/assets/icons/items/shoes/bale.svg?react',
//     shoes_giay_bata_vang: '/src/assets/icons/items/shoes/yellow-bata.svg?react',
//     shoes_giay_boot_ngau: '/src/assets/icons/items/shoes/cool-boot.svg?react',
//     shoes_giay_converse_cam: '/src/assets/icons/items/shoes/converse.svg?react',
//     accessories_hat_non_dau:
//         '/src/assets/icons/items/accessory/hat/strawberry.svg?react',
//     accessories_hat_non_tai_meo:
//         '/src/assets/icons/items/accessory/hat/cat-ear.svg?react',
//     accessories_eyewear_kinh_tron:
//         '/src/assets/icons/items/accessory/glasses/circle.svg?react',
//     accessories_necklace_day_chuyen_trai_tim:
//         '/src/assets/icons/items/accessory/necklace/heart.svg?react',
//     accessories_bracelet_dong_ho_thong_minh:
//         '/src/assets/icons/items/accessory/bracelet/clock.svg?react',
//     fashion_set_chi_hang:
//         '/src/assets/icons/items/fashion-set/sister-hang.svg?react',
//     fashion_set_chu_cuoi:
//         '/src/assets/icons/items/fashion-set/uncle-cuoi.svg?react',
//     fashion_set_ao_dai_do:
//         '/src/assets/icons/items/fashion-set/red-ao-dai.svg?react',
//     fashion_set_vay_noel_nu:
//         '/src/assets/icons/items/fashion-set/noel-girl.svg?react',
//     fashion_set_noel_nam:
//         '/src/assets/icons/items/fashion-set/noel-boy.svg?react',
//     fashion_set_vay_xinh_sinh_nhat:
//         '/src/assets/icons/items/fashion-set/birthday.svg?react',
//     fashion_set_ao_dau_lan:
//         '/src/assets/icons/items/fashion-set/unicorn-head.svg?react',
//     fashion_set_harry_potter:
//         '/src/assets/icons/items/fashion-set/harry-potter.svg?react',
//     fashion_set_heo_superman:
//         '/src/assets/icons/items/fashion-set/superman.svg?react',
//     fashion_set_heo_wonder_woman:
//         '/src/assets/icons/items/fashion-set/wonder-women.svg?react',
//     fashion_set_hiep_si_vang:
//         '/src/assets/icons/items/fashion-set/golden-knight.svg?react',
//     fashion_set_hiep_si_xanh:
//         '/src/assets/icons/items/fashion-set/blue-knight.svg?react',
// };
const IMAGE_BY_SLUG: Partial<Record<string, string>> = {
    clothing_top_ao_den_uwu: '/icons/items/clothings/shirt-top/uwu.svg',
    clothing_top_ao_graffiti: '/icons/items/clothings/shirt-top/graffiti.svg',
    clothing_top_ao_soc_thuy_thu: '/icons/items/clothings/shirt-top/sailor.svg',
    clothing_top_ao_hoodie_xanh:
        '/icons/items/clothings/shirt-top/hoodie-blue.svg',
    clothing_top_ao_vang_mua_he:
        '/icons/items/clothings/shirt-top/yellow-summer.svg',
    clothing_top_ao_yem_jeans: '/icons/items/clothings/shirt-top/jeans.svg',
    clothing_bottom_vay_pickleball:
        '/icons/items/clothings/trousers/pickleball.svg',
    clothing_bottom_vay_jean_ngan:
        '/icons/items/clothings/trousers/short-jeans.svg',
    clothing_bottom_vay_xoe_hong:
        '/icons/items/clothings/trousers/flared-pink.svg',
    clothing_bottom_quan_keo_xanh:
        '/icons/items/clothings/trousers/blue-candy.svg',
    clothing_bottom_quan_ran_ri: '/icons/items/clothings/trousers/ranri.svg',
    clothing_bottom_quan_xanh_mua_he:
        '/icons/items/clothings/trousers/cold-blue.svg',
    clothing_bottom_quan_den_ngau:
        '/icons/items/clothings/trousers/cool-black.svg',
    shoes_giay_dong_xu: '/icons/items/shoes/dimple.svg',
    shoes_giay_bale: '/icons/items/shoes/bale.svg',
    shoes_giay_bata_vang: '/icons/items/shoes/yellow-bata.svg',
    shoes_giay_boot_ngau: '/icons/items/shoes/cool-boot.svg',
    shoes_giay_converse_cam: '/icons/items/shoes/converse.svg',
    accessories_hat_non_dau: '/icons/items/accessory/hat/strawberry.svg',
    accessories_hat_non_tai_meo: '/icons/items/accessory/hat/cat-ear.svg',
    accessories_eyewear_kinh_tron: '/icons/items/accessory/glasses/circle.svg',
    accessories_necklace_day_chuyen_trai_tim:
        '/icons/items/accessory/necklace/heart.svg',
    accessories_bracelet_dong_ho_thong_minh:
        '/icons/items/accessory/bracelet/clock.svg',
    fashion_set_chi_hang: '/icons/items/fashion-set/sister-hang.svg',
    fashion_set_chu_cuoi: '/icons/items/fashion-set/uncle-cuoi.svg',
    fashion_set_ao_dai_do: '/icons/items/fashion-set/red-ao-dai.svg',
    fashion_set_vay_noel_nu: '/icons/items/fashion-set/noel-girl.svg',
    fashion_set_noel_nam: '/icons/items/fashion-set/noel-boy.svg',
    fashion_set_vay_xinh_sinh_nhat: '/icons/items/fashion-set/birthday.svg',
    fashion_set_ao_dau_lan: '/icons/items/fashion-set/unicorn-head.svg',
    fashion_set_harry_potter: '/icons/items/fashion-set/harry-potter.svg',
    fashion_set_heo_superman: '/icons/items/fashion-set/superman.svg',
    fashion_set_heo_wonder_woman: '/icons/items/fashion-set/wonder-women.svg',
    fashion_set_hiep_si_vang: '/icons/items/fashion-set/golden-knight.svg',
    fashion_set_hiep_si_xanh: '/icons/items/fashion-set/blue-knight.svg',
};

export function getVisual(
    item: Pick<ApiItem, 'slug' | 'itemType' | 'category'>
): Visual {
    const slot = getSlotFromItem(item);
    return VISUAL_BY_SLUG[item.slug] || FALLBACK_BY_SLOT[slot];
}

/** Visual chỉ từ snapshot (slug + slot) — dùng cho CharacterStage */
export function getVisualBySlug(slug: string, slot: EquipSlot): Visual {
    return VISUAL_BY_SLUG[slug] || FALLBACK_BY_SLOT[slot];
}

export function getItemImageSrc(slug: string): string | null {
    return IMAGE_BY_SLUG[slug] ?? null;
}

export function getSlotFromItem(
    item: Pick<ApiItem, 'itemType' | 'category'>
): EquipSlot {
    if (item.category === 'shoes') return 'shoes';
    if (item.category === 'fashion_set') return 'fashion_set';
    return (item.itemType ?? 'tops') as EquipSlot;
}
