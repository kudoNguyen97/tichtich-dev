import type { Profile } from '@/features/auth/types/auth.type';

export type ProfileType = 'adult' | 'kidBoy' | 'kidGirl';

export type PigPosition = 'left' | 'right';

export interface ProfileTypeConfig {
    backgroundColorClass: string;
    heightPx: number;
    pigImageSrc: string;
    pigPosition: PigPosition;
}

export const PROFILE_TYPE_CONFIG: Record<ProfileType, ProfileTypeConfig> = {
    adult: {
        backgroundColorClass: 'bg-profile-parent',
        heightPx: 194,
        pigImageSrc: '/images/pig-dad.png',
        pigPosition: 'right',
    },
    kidBoy: {
        backgroundColorClass: 'bg-profile-boy',
        heightPx: 108,
        pigImageSrc: '/images/pig-boy-kid.png',
        pigPosition: 'left',
    },
    kidGirl: {
        backgroundColorClass: 'bg-profile-girl',
        heightPx: 108,
        pigImageSrc: '/images/pig-gird-kid.png',
        pigPosition: 'right',
    },
};

export function getProfileType(profile: Profile): ProfileType {
    if (profile.profileType === 'adult') return 'adult';
    return profile.gender === 'female' ? 'kidGirl' : 'kidBoy';
}
