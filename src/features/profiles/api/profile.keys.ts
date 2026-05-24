export const profileKeys = {
    profile: ['profile'] as const,
    profileDetail: (id: string) => [...profileKeys.profile, id] as const,
    kidProfileDetail: (kidId: string, adultId: string) =>
        [...profileKeys.profile, 'kid', kidId, 'adult', adultId] as const,
    createProfile: () => [...profileKeys.profile, 'create'] as const,
};
