import type { Profile } from '@/features/auth/types/auth.type';
import { getProfileType } from '@/features/profiles/types';
import type { ProfileType } from '@/features/profiles/types';
import { cn } from '@/utils/cn';

interface ProfileAvatarProps {
    profile: Profile;
    size: 'sm' | 'lg';
    showName?: boolean;
    className?: string;
}

const PROFILE_TYPE_AVATAR_SRC: Record<ProfileType, string> = {
    adult: '/images/avatar/adult-fullface.png',
    kidBoy: '/images/avatar/kidboy-fullface.png',
    kidGirl: '/images/avatar/kidgirl-fullface.png',
};

export function ProfileAvatar({
    profile,
    showName = false,
    className,
}: ProfileAvatarProps) {
    const profileType = getProfileType(profile);
    const pigImageSrc = PROFILE_TYPE_AVATAR_SRC[profileType];

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            <div
                className={cn(
                    'flex items-center justify-center overflow-hidden rounded-full bg-tichtich-primary-100',
                    'w-[109px] h-[109px] p-4'
                )}
            >
                <img
                    src={pigImageSrc}
                    alt=""
                    className={cn('object-contain', 'w-full h-full')}
                />
            </div>
            {showName && (
                <p className="text-center text-sm font-medium text-tichtich-black">
                    {profile.fullName}
                </p>
            )}
        </div>
    );
}
