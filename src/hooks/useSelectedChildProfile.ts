import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import type { Profile } from '@/features/auth/types/auth.type';

/**
 * Trả về profile trẻ em đang được chọn (current kid).
 * Chỉ dùng trong các page dưới /children — route guard đã đảm bảo selectedProfile
 * là kid, nên mọi data hiển thị phải scope theo profile này.
 */
export function useSelectedChildProfile(): Profile | null {
    return useAuthStore((s) => s.selectedProfile);
}
