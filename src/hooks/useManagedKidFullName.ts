import { useMemo } from 'react';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { isKidProfile } from '@/features/auth/helpers/profile';

/**
 * Tên đầy đủ của profile trẻ đang được quản lý trong UI adult
 * (cùng logic subtitle trên AppBar adult).
 */
export function useManagedKidFullName(): string {
    const profiles = useAuthStore((s) => s.profiles);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);

    return useMemo(() => {
        const kidProfiles = profiles.filter(isKidProfile);
        return (
            kidProfiles.find((p) => p.id === managedKidProfileId)?.fullName ||
            kidProfiles[0]?.fullName ||
            '—'
        );
    }, [profiles, managedKidProfileId]);
}
