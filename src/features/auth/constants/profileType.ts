export const PROFILE_TYPE = {
    ADULT: 'adult',
    KID: 'kid',
} as const;

export type ProfileType = (typeof PROFILE_TYPE)[keyof typeof PROFILE_TYPE];
