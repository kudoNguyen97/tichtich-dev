import type { ProfileVariant } from '@/features/profiles/types/profile.type';
import { PROFILE_TYPE_CONFIG } from '@/features/profiles/types/profile.type';
import { cn } from '@/utils/cn';

interface ProfilePigProps {
    profileType: ProfileVariant;
    side?: 'left' | 'right';
    className?: string;
}

export function ProfilePig({ profileType, side, className }: ProfilePigProps) {
    const { pigImageSrc, pigPosition } = PROFILE_TYPE_CONFIG[profileType];
    const resolvedSide = side ?? pigPosition;
    const isRight = resolvedSide === 'right';

    return (
        <div
            className={cn(
                'absolute bottom-0 flex items-end justify-center overflow-visible',
                isRight ? 'right-0' : 'left-0',
                className
            )}
        >
            <img
                src={pigImageSrc}
                alt=""
                className="h-full w-auto object-contain object-center"
            />
        </div>
    );
}
