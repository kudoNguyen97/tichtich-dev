import { useTranslation } from 'react-i18next';
import type { Profile } from '@/features/auth/types/auth.type';
import {
    PROFILE_TYPE_CONFIG,
    getProfileType,
} from '@/features/profiles/types';
import { ProfilePig } from '@/components/profiles/ProfilePig';
import { cn } from '@/utils/cn';
import * as motion from 'motion/react-client';

interface ProfileCardProps {
    profile: Profile;
    onSelect?: () => void;
}

export function ProfileCard({ profile, onSelect }: ProfileCardProps) {
    const { t } = useTranslation();
    const profileType = getProfileType(profile);
    const config = PROFILE_TYPE_CONFIG[profileType];
    const typeLabel =
        profileType === 'parent'
            ? t('profiles.typeParent')
            : t('profiles.typeChild');

    return (
        <>
            <motion.div
                style={{}}
                whileHover={{
                    scale: [null, 1.03],
                    transition: {
                        duration: 0.5,
                        times: [0, 0.6, 1],
                        ease: ['easeInOut', 'easeOut'],
                    },
                }}
                transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                }}
            >
                <button
                    type="button"
                    onClick={onSelect}
                    className={cn(
                        'relative overflow-hidden flex w-full items-center rounded-2xl px-4 text-left transition-opacity border-transparent hover:opacity-95 hover:border-tichtich-primary-200 hover:border-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tichtich-primary-200 focus-visible:ring-offset-2',
                        config.backgroundColorClass
                    )}
                    style={{ height: config.heightPx }}
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-tichtich-black">
                            {profile.fullName || profile.id}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-tichtich-black/80">
                            {typeLabel}
                        </p>
                    </div>
                    <ProfilePig
                        profileType={profileType}
                        className="h-[85%] max-h-[140px] w-auto"
                    />
                </button>
            </motion.div>
        </>
    );
}
