import { useState } from 'react';
import HomeCardSelectProfile from '@/components/adult/home/HomeCardSelectProfile';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { createFileRoute } from '@tanstack/react-router';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { cn } from '@/utils/cn';

export const Route = createFileRoute('/_app/adult/_layout/')({
    component: HomeAdultPage,
    head: () => ({
        meta: [{ title: 'Tích Tích - Phụ huynh' }],
    }),
});

function HomeAdultPage() {
    const selectedProfile = useAuthStore((s) => s.selectedProfile);
    const profiles = useAuthStore((s) => s.profiles);
    const managedKidProfileId = useAuthStore((s) => s.managedKidProfileId);
    const setManagedKidProfileId = useAuthStore(
        (s) => s.setManagedKidProfileId
    );

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const kidProfiles = profiles.filter((p) => p.profileType === 'kid');

    const handleSelect = () => {
        if (!kidProfiles.length) return;
        setIsSheetOpen(true);
    };

    const handleSelectKid = (kidId: string) => {
        const kid = kidProfiles.find((p) => p.id === kidId);
        if (!kid) return;
        setManagedKidProfileId(kid.id);
        setIsSheetOpen(false);
    };

    if (!selectedProfile) return null;

    let cardProfile = selectedProfile;
    if (kidProfiles.length > 0) {
        // Store đã resolve kid mặc định; ?? kidProfiles[0] phòng dữ liệu lệch tạm thời.
        const resolved =
            kidProfiles.find((p) => p.id === managedKidProfileId) ??
            kidProfiles[0];
        cardProfile = resolved;
    }

    return (
        <>
            <div className="px-4 pt-8 pb-6">
                <HomeCardSelectProfile
                    profile={cardProfile}
                    onSelect={handleSelect}
                />
            </div>

            <BottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title="Chọn tài khoản"
            >
                {kidProfiles.length === 0 ? (
                    <p className="text-center text-sm text-tichtich-black/70">
                        Chưa có tài khoản con.
                    </p>
                ) : (
                    <div className="flex gap-6 min-h-[200px]">
                        {kidProfiles.map((kid) => (
                            <button
                                key={kid.id}
                                type="button"
                                onClick={() => handleSelectKid(kid.id)}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-2 cursor-pointer'
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex h-22 w-22 p-3 items-center justify-center rounded-lg bg-white overflow-hidden',
                                        kid.gender === 'female'
                                            ? 'bg-[#F9CCD7] border border-[#f07997]'
                                            : 'bg-[#C0E0F0] border border-tichtich-primary-200',
                                        'transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg'
                                    )}
                                >
                                    <img
                                        src={
                                            kid.gender === 'female'
                                                ? '/images/face-icons/female-kid.png'
                                                : '/images/face-icons/male-kid.png'
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <span className="text-base font-bold text-tichtich-black">
                                    {kid.fullName}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </BottomSheet>
        </>
    );
}
