import type { Profile } from '@/features/profiles/types';
import { PROFILE_TYPE_CONFIG } from '@/features/profiles/types';
import { cn } from '@/utils/cn';

interface ProfileAvatarProps {
    profile: Profile;
    size: 'sm' | 'lg';
    showName?: boolean;
    className?: string;
}

export function ProfileAvatar({
    profile,
    size,
    showName = false,
    className,
}: ProfileAvatarProps) {
    const { pigImageSrc } = PROFILE_TYPE_CONFIG[profile.type];
    const isSm = size === 'sm';

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            <div
                className={cn(
                    'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-profile-boy',
                    isSm ? 'size-10' : 'size-24'
                )}
            >
                <img
                    src={pigImageSrc}
                    alt=""
                    className={cn(
                        'object-contain',
                        isSm ? 'h-8 w-8' : 'h-20 w-20'
                    )}
                />
            </div>
            {showName && (
                <p className="text-center text-sm font-medium text-tichtich-black">
                    {profile.name}
                </p>
            )}
        </div>
    );
}
