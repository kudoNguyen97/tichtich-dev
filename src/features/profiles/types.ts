export type ProfileType = 'parent' | 'boy' | 'girl';

export interface Profile {
    id: string;
    name: string;
    type: ProfileType;
}

export type PigPosition = 'left' | 'right';

export interface ProfileTypeConfig {
    backgroundColorClass: string;
    heightPx: number;
    pigImageSrc: string;
    pigPosition: PigPosition;
}

export const PROFILE_TYPE_CONFIG: Record<ProfileType, ProfileTypeConfig> = {
    parent: {
        backgroundColorClass: 'bg-profile-parent',
        heightPx: 194,
        pigImageSrc: '/images/pig-dad.png',
        pigPosition: 'right',
    },
    boy: {
        backgroundColorClass: 'bg-profile-boy',
        heightPx: 108,
        pigImageSrc: '/images/pig-boy-kid.png',
        pigPosition: 'left',
    },
    girl: {
        backgroundColorClass: 'bg-profile-girl',
        heightPx: 108,
        pigImageSrc: '/images/pig-gird-kid.png',
        pigPosition: 'right',
    },
};
