import { PROFILE_TYPE } from '@/features/auth/constants/profileType';
import type { Profile } from '@/features/auth/types/auth.type';

export const isKidProfile = (profile: Profile): boolean =>
    profile.profileType === PROFILE_TYPE.KID;

export const isAdultProfile = (profile: Profile): boolean =>
    profile.profileType === PROFILE_TYPE.ADULT;
