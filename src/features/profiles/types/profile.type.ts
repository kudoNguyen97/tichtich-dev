import type { Profile } from '@/features/auth/types/auth.type';
import { PROFILE_TYPE } from '@/features/auth/constants/profileType';
import { GENDER  } from '@/features/auth/constants/gender';
import type {Gender} from '@/features/auth/constants/gender';

export const PROFILE_VARIANT = {
    ADULT: 'adult',
    KID_BOY: 'kidBoy',
    KID_GIRL: 'kidGirl',
} as const;

export type ProfileVariant =
    (typeof PROFILE_VARIANT)[keyof typeof PROFILE_VARIANT];

export type PigPosition = 'left' | 'right';

export type ChildGender = Gender | null;

export interface ProfileTypeConfig {
    backgroundColorClass: string;
    heightPx: number;
    pigImageSrc: string;
    pigPosition: PigPosition;
}

export const PROFILE_TYPE_CONFIG: Record<ProfileVariant, ProfileTypeConfig> = {
    [PROFILE_VARIANT.ADULT]: {
        backgroundColorClass: 'bg-tichtich-primary-200',
        heightPx: 194,
        pigImageSrc: '/images/pig-dad.png',
        pigPosition: 'right',
    },
    [PROFILE_VARIANT.KID_BOY]: {
        backgroundColorClass: 'bg-tichtich-blue',
        heightPx: 108,
        pigImageSrc: '/images/pig-boy-kid.png',
        pigPosition: 'left',
    },
    [PROFILE_VARIANT.KID_GIRL]: {
        backgroundColorClass: 'bg-tichtich-pink',
        heightPx: 108,
        pigImageSrc: '/images/pig-gird-kid.png',
        pigPosition: 'right',
    },
};

export function getProfileType(profile: Profile): ProfileVariant {
    if (profile.profileType === PROFILE_TYPE.ADULT) return PROFILE_VARIANT.ADULT;
    return profile.gender === GENDER.FEMALE
        ? PROFILE_VARIANT.KID_GIRL
        : PROFILE_VARIANT.KID_BOY;
}
