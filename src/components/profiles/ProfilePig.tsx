import type { ProfileType } from '@/features/profiles/types';
import { PROFILE_TYPE_CONFIG } from '@/features/profiles/types';
import { cn } from '@/utils/cn';

interface ProfilePigProps {
    profileType: ProfileType;
    className?: string;
}

export function ProfilePig({ profileType, className }: ProfilePigProps) {
    const { pigImageSrc, pigPosition } = PROFILE_TYPE_CONFIG[profileType];
    const isRight = pigPosition === 'right';

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
